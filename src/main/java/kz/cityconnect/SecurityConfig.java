package kz.cityconnect;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Configuration
public class SecurityConfig {
    private final Key key;
    public SecurityConfig(@Value("${cityconnect.jwt-secret}") String secret) {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) throw new IllegalArgumentException("JWT secret must be at least 32 bytes");
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
    @Bean public static PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }
    @Bean public SecurityFilterChain filterChain(HttpSecurity http, TokenFilter tokenFilter) throws Exception {
        return http.csrf(csrf -> csrf.disable()).cors(cors -> cors.disable()).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a.requestMatchers("/", "/index.html", "/css/**", "/js/**", "/api/health", "/api/auth/register", "/api/auth/login", "/api/auth/password-reset", "/error").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH,"/api/incidents/*/status").hasAnyRole("ADMIN","EMPLOYEE")
                        .requestMatchers("/api/**").authenticated().anyRequest().permitAll())
                .addFilterBefore(tokenFilter, UsernamePasswordAuthenticationFilter.class).build();
    }
    @Bean public TokenFilter tokenFilter(UserRepository users) { return new TokenFilter(key, users); }
    @Bean public TokenService tokenService(UserRepository users) { return new TokenService(key); }
}

class TokenService {
    private final Key key;
    TokenService(Key key) { this.key=key; }
    AuthResponse response(AppUser user) {
        Instant now=Instant.now(), expiry=now.plusSeconds(3600);
        String token=Jwts.builder().subject(user.getUsername()).claim("role",user.getRole().name()).issuedAt(Date.from(now)).expiration(Date.from(expiry)).signWith(key).compact();
        return new AuthResponse(token,"Bearer",3600,UserView.from(user));
    }
}

class TokenFilter extends OncePerRequestFilter {
    private final Key key; private final UserRepository users;
    TokenFilter(Key key,UserRepository users){this.key=key;this.users=users;}
    @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws ServletException,IOException {
        String header=request.getHeader("Authorization");
        if(header!=null && header.startsWith("Bearer ")) try {
            Claims claims=Jwts.parser().verifyWith((javax.crypto.SecretKey)key).build().parseSignedClaims(header.substring(7)).getPayload();
            AppUser user=users.findByUsername(claims.getSubject()).orElse(null);
            if(user!=null) {
                var auth=new UsernamePasswordAuthenticationToken(user.getUsername(),null,List.of(new SimpleGrantedAuthority("ROLE_"+user.getRole().name())));
                org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (RuntimeException ignored) { org.springframework.security.core.context.SecurityContextHolder.clearContext(); }
        chain.doFilter(request,response);
    }
}
