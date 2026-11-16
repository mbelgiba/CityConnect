package kz.cityconnect;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;

@Service
class AccountService {
    private final UserRepository users;
    private final PasswordResetRepository resets;
    private final PasswordEncoder passwords;
    private final TokenService tokens;
    private final SecureRandom random = new SecureRandom();

    AccountService(UserRepository users, PasswordResetRepository resets, PasswordEncoder passwords, TokenService tokens) {
        this.users = users;
        this.resets = resets;
        this.passwords = passwords;
        this.tokens = tokens;
    }

    @Transactional
    AuthResponse register(RegisterRequest request) {
        String username = request.username().trim();
        String email = normalizeEmail(request.email());
        if (users.existsByUsernameIgnoreCase(username) || users.existsByEmailIgnoreCase(email))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username or email is already registered");
        AppUser user = users.save(new AppUser(username, email, request.fullName().trim(), passwords.encode(request.password()), Role.CITIZEN));
        return tokens.response(user);
    }

    @Transactional(readOnly = true)
    AuthResponse login(LoginRequest request, String clientKey) {
        LoginAttemptLimiter.check(clientKey);
        AppUser user = users.findByUsernameIgnoreCase(request.username().trim())
                .orElse(null);
        if (user == null || !passwords.matches(request.password(), user.getPasswordHash())) {
            LoginAttemptLimiter.failed(clientKey);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
        LoginAttemptLimiter.succeeded(clientKey);
        return tokens.response(user);
    }

    @Transactional(readOnly = true)
    UserView currentUser(String username) {
        return users.findByUsername(username).map(UserView::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account no longer exists"));
    }

    @Transactional
    UserView updateProfile(String username, ProfileRequest request) {
        AppUser user = requiredUser(username);
        String email = normalizeEmail(request.email());
        if (users.existsByEmailIgnoreCaseAndIdNot(email, user.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        user.updateProfile(request.fullName().trim(), email);
        return UserView.from(users.save(user));
    }

    @Transactional
    void changePassword(String username, PasswordChangeRequest request) {
        AppUser user = requiredUser(username);
        if (!passwords.matches(request.currentPassword(), user.getPasswordHash()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        if (passwords.matches(request.newPassword(), user.getPasswordHash()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a password you have not used before");
        user.updatePasswordHash(passwords.encode(request.newPassword()));
        users.save(user);
        resets.deleteAllByUser_Id(user.getId());
    }

    @Transactional
    PasswordResetIssued issuePasswordReset(long userId) {
        AppUser user = users.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));
        resets.deleteAllByUser_Id(userId);
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        Instant expiresAt = Instant.now().plusSeconds(30 * 60);
        resets.save(new PasswordResetToken(user, hash(rawToken), expiresAt));
        return new PasswordResetIssued(user.getUsername(), rawToken, expiresAt);
    }

    @Transactional
    void resetPassword(PasswordResetRequest request) {
        PasswordResetToken reset = resets.findByTokenHashAndConsumedAtIsNull(hash(request.token()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset code is invalid or expired"));
        if (!reset.getExpiresAt().isAfter(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset code is invalid or expired");
        }
        AppUser user = reset.getUser();
        user.updatePasswordHash(passwords.encode(request.newPassword()));
        users.save(user);
        resets.deleteAllByUser_Id(user.getId());
    }

    private AppUser requiredUser(String username) {
        return users.findByUsername(username).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account no longer exists"));
    }

    private static String normalizeEmail(String email) { return email.trim().toLowerCase(Locale.ROOT); }

    private static String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception error) {
            throw new IllegalStateException("SHA-256 is unavailable", error);
        }
    }
}

record ProfileRequest(@jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(min=2,max=80) String fullName,
                      @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Email @jakarta.validation.constraints.Size(max=254) String email) {}
record PasswordChangeRequest(@jakarta.validation.constraints.NotBlank String currentPassword,
                             @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(min=10,max=72) String newPassword) {}
record PasswordResetRequest(@jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(min=40,max=64) String token,
                            @jakarta.validation.constraints.NotBlank @jakarta.validation.constraints.Size(min=10,max=72) String newPassword) {}
record PasswordResetIssued(String username, String token, Instant expiresAt) {}

@Service
class LoginAttemptLimiter {
    private static final int MAX_FAILURES = 5;
    private static final long WINDOW_SECONDS = 15 * 60;
    private static final java.util.Map<String, Attempt> ATTEMPTS = new java.util.concurrent.ConcurrentHashMap<>();

    static void check(String key) {
        Attempt attempt = ATTEMPTS.get(key);
        if (attempt != null && attempt.blockedUntil != null && attempt.blockedUntil.isAfter(Instant.now()))
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many sign-in attempts. Try again in 15 minutes.");
        if (attempt != null && attempt.blockedUntil != null) ATTEMPTS.remove(key, attempt);
    }

    static void failed(String key) {
        Instant now = Instant.now();
        ATTEMPTS.compute(key, (ignored, previous) -> {
            int failures = previous == null || previous.startedAt.plusSeconds(WINDOW_SECONDS).isBefore(now) ? 1 : previous.failures + 1;
            return new Attempt(failures, previous == null || failures == 1 ? now : previous.startedAt,
                    failures >= MAX_FAILURES ? now.plusSeconds(WINDOW_SECONDS) : null);
        });
        if (ATTEMPTS.size() > 10_000) ATTEMPTS.entrySet().removeIf(entry -> entry.getValue().startedAt.plusSeconds(WINDOW_SECONDS).isBefore(now));
    }

    static void succeeded(String key) { ATTEMPTS.remove(key); }

    private record Attempt(int failures, Instant startedAt, Instant blockedUntil) {}
}
