package kz.cityconnect;

import jakarta.persistence.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.security.SecureRandom;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermission;
import java.util.Base64;
import java.util.Set;
import java.util.List;
import java.util.Optional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

enum Role { CITIZEN, EMPLOYEE, ADMIN }
enum IncidentStatus { NEW, UNDER_REVIEW, ACCEPTED, IN_PROGRESS, RESOLVED, REJECTED, CLOSED }

@Entity @Table(name="department")
class Department {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,unique=true,length=100) private String name;
    @Column(length=500) private String description;
    @Column(name="created_at",nullable=false) private Instant createdAt=Instant.now();
    protected Department(){}
    Department(String name,String description){this.name=name;this.description=description;}
    Long getId(){return id;} String getName(){return name;} String getDescription(){return description;}
    void update(String name,String description){this.name=name;this.description=description;}
}

@Entity
@Table(name="app_user")
class AppUser {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false, unique=true, length=40) private String username;
    @Column(nullable=false, unique=true, length=254) private String email;
    @Column(name="full_name", nullable=false, length=80) private String fullName;
    @Column(name="password_hash", nullable=false, length=100) private String passwordHash;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private Role role;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="department_id") private Department department;
    @Column(name="created_at", nullable=false) private Instant createdAt = Instant.now();
    protected AppUser() {}
    AppUser(String username, String email, String fullName, String passwordHash, Role role) { this.username=username; this.email=email; this.fullName=fullName; this.passwordHash=passwordHash; this.role=role; }
    Long getId(){return id;} String getUsername(){return username;} String getEmail(){return email;} String getFullName(){return fullName;} String getPasswordHash(){return passwordHash;} Role getRole(){return role;} void setRole(Role role){this.role=role;} Department getDepartment(){return department;} void setDepartment(Department department){this.department=department;}
    void updateProfile(String fullName, String email){this.fullName=fullName;this.email=email;}
    void updatePasswordHash(String passwordHash){this.passwordHash=passwordHash;}
}

@Entity
@Table(name="incident")
class Incident {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="reference_code", nullable=false, unique=true, length=24) private String referenceCode;
    @Column(nullable=false, length=120) private String title;
    @Column(nullable=false, length=3000) private String description;
    @Column(nullable=false, length=60) private String category;
    @Column(nullable=false, length=200) private String location;
    @Column private Double latitude;
    @Column private Double longitude;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=30) private IncidentStatus status = IncidentStatus.NEW;
    @ManyToOne(fetch=FetchType.EAGER, optional=false) @JoinColumn(name="created_by", nullable=false) private AppUser createdBy;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="department_id") private Department department;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="assigned_employee_id") private AppUser assignedEmployee;
    @Column(name="created_at", nullable=false) private Instant createdAt = Instant.now();
    @Column(name="updated_at", nullable=false) private Instant updatedAt = Instant.now();
    protected Incident() {}
    Incident(String referenceCode,String title,String description,String category,String location,Double latitude,Double longitude,AppUser createdBy){this.referenceCode=referenceCode;this.title=title;this.description=description;this.category=category;this.location=location;this.latitude=latitude;this.longitude=longitude;this.createdBy=createdBy;}
    Long getId(){return id;} String getReferenceCode(){return referenceCode;} String getTitle(){return title;} String getDescription(){return description;} String getCategory(){return category;} String getLocation(){return location;} Double getLatitude(){return latitude;} Double getLongitude(){return longitude;} IncidentStatus getStatus(){return status;} void setStatus(IncidentStatus status){this.status=status;} AppUser getCreatedBy(){return createdBy;} Instant getCreatedAt(){return createdAt;} Instant getUpdatedAt(){return updatedAt;} void setUpdatedAt(Instant updatedAt){this.updatedAt=updatedAt;} Department getDepartment(){return department;} AppUser getAssignedEmployee(){return assignedEmployee;} void assign(Department department,AppUser employee){this.department=department;this.assignedEmployee=employee;this.updatedAt=Instant.now();}
    void updateDetails(String title,String description,String category,String location,Double latitude,Double longitude){this.title=title;this.description=description;this.category=category;this.location=location;this.latitude=latitude;this.longitude=longitude;this.updatedAt=Instant.now();}
}

@Entity @Table(name="incident_internal_note")
class IncidentInternalNote {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="incident_id",nullable=false) private Incident incident;
    @ManyToOne(fetch=FetchType.EAGER,optional=false) @JoinColumn(name="author_id",nullable=false) private AppUser author;
    @Column(nullable=false,length=2000) private String body;
    @Column(name="created_at",nullable=false) private Instant createdAt=Instant.now();
    protected IncidentInternalNote(){}
    IncidentInternalNote(Incident incident,AppUser author,String body){this.incident=incident;this.author=author;this.body=body;}
    Long getId(){return id;} AppUser getAuthor(){return author;} String getBody(){return body;} Instant getCreatedAt(){return createdAt;}
}

@Entity
@Table(name="incident_status_history")
class IncidentStatusHistory {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="incident_id", nullable=false) private Incident incident;
    @ManyToOne(fetch=FetchType.EAGER, optional=false) @JoinColumn(name="changed_by", nullable=false) private AppUser changedBy;
    @Enumerated(EnumType.STRING) @Column(name="from_status", length=30) private IncidentStatus fromStatus;
    @Enumerated(EnumType.STRING) @Column(name="to_status", nullable=false, length=30) private IncidentStatus toStatus;
    @Column(length=500) private String note;
    @Column(name="created_at", nullable=false) private Instant createdAt=Instant.now();
    protected IncidentStatusHistory(){}
    IncidentStatusHistory(Incident incident,AppUser changedBy,IncidentStatus fromStatus,IncidentStatus toStatus,String note){this.incident=incident;this.changedBy=changedBy;this.fromStatus=fromStatus;this.toStatus=toStatus;this.note=note;}
    Long getId(){return id;} AppUser getChangedBy(){return changedBy;} IncidentStatus getFromStatus(){return fromStatus;} IncidentStatus getToStatus(){return toStatus;} String getNote(){return note;} Instant getCreatedAt(){return createdAt;}
}

@Entity
@Table(name="incident_comment")
class IncidentComment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="incident_id", nullable=false) private Incident incident;
    @ManyToOne(fetch=FetchType.EAGER, optional=false) @JoinColumn(name="author_id", nullable=false) private AppUser author;
    @Column(nullable=false, length=1000) private String body;
    @Column(name="created_at", nullable=false) private Instant createdAt = Instant.now();
    protected IncidentComment() {}
    IncidentComment(Incident incident, AppUser author, String body) { this.incident=incident; this.author=author; this.body=body; }
    Long getId(){return id;} Incident getIncident(){return incident;} AppUser getAuthor(){return author;} String getBody(){return body;} Instant getCreatedAt(){return createdAt;}
}

@Entity
@Table(name="incident_vote", uniqueConstraints=@UniqueConstraint(name="uk_incident_vote_user", columnNames={"incident_id","user_id"}))
class IncidentVote {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="incident_id", nullable=false) private Incident incident;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="user_id", nullable=false) private AppUser user;
    @Column(name="created_at", nullable=false) private Instant createdAt = Instant.now();
    protected IncidentVote() {}
    IncidentVote(Incident incident, AppUser user) { this.incident=incident; this.user=user; }
}

interface UserRepository extends JpaRepository<AppUser,Long> {
    Optional<AppUser> findByUsername(String username);
    Optional<AppUser> findByUsernameIgnoreCase(String username);
    boolean existsByUsernameIgnoreCase(String username);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
    List<AppUser> findAllByRoleOrderByFullNameAsc(Role role);
    long countByRole(Role role);
}
interface DepartmentRepository extends JpaRepository<Department,Long> { Optional<Department> findByNameIgnoreCase(String name); }
interface IncidentRepository extends JpaRepository<Incident,Long> {
    List<Incident> findAllByOrderByCreatedAtDesc();
    List<Incident> findAllByCreatedByIdOrderByCreatedAtDesc(Long id);
    List<Incident> findAllByAssignedEmployee_IdOrderByCreatedAtDesc(Long id);
    @org.springframework.data.jpa.repository.Query("select i from Incident i where (:status is null or i.status = :status) and (:category is null or lower(i.category) = lower(:category)) and (:q is null or lower(i.title) like lower(concat('%',:q,'%')) or lower(i.description) like lower(concat('%',:q,'%')) or lower(i.location) like lower(concat('%',:q,'%')))")
    org.springframework.data.domain.Page<Incident> search(@org.springframework.data.repository.query.Param("status") IncidentStatus status,@org.springframework.data.repository.query.Param("category") String category,@org.springframework.data.repository.query.Param("q") String query,org.springframework.data.domain.Pageable pageable);
}
interface IncidentStatusHistoryRepository extends JpaRepository<IncidentStatusHistory,Long> { List<IncidentStatusHistory> findAllByIncident_IdOrderByCreatedAtAsc(Long id); }
interface IncidentInternalNoteRepository extends JpaRepository<IncidentInternalNote,Long> { List<IncidentInternalNote> findAllByIncident_IdOrderByCreatedAtAsc(Long id); }

@Entity @Table(name="user_notification")
class UserNotification {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id",nullable=false) private AppUser user;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="incident_id") private Incident incident;
    @Column(nullable=false,length=30) private String type;
    @Column(nullable=false,length=160) private String title;
    @Column(nullable=false,length=500) private String body;
    @Column(name="created_at",nullable=false) private Instant createdAt=Instant.now();
    @Column(name="read_at") private Instant readAt;
    protected UserNotification(){}
    UserNotification(AppUser user,Incident incident,String type,String title,String body){this.user=user;this.incident=incident;this.type=type;this.title=title;this.body=body;}
    Long getId(){return id;} Long getIncidentId(){return incident==null?null:incident.getId();} String getType(){return type;} String getTitle(){return title;} String getBody(){return body;} Instant getCreatedAt(){return createdAt;} Instant getReadAt(){return readAt;} void markRead(){if(readAt==null)readAt=Instant.now();}
}
interface UserNotificationRepository extends JpaRepository<UserNotification,Long>{
    org.springframework.data.domain.Page<UserNotification> findAllByUser_IdOrderByCreatedAtDesc(Long userId,org.springframework.data.domain.Pageable pageable);
    long countByUser_IdAndReadAtIsNull(Long userId);
    Optional<UserNotification> findByIdAndUser_Id(Long id,Long userId);
    List<UserNotification> findAllByUser_IdAndReadAtIsNull(Long userId);
}
interface IncidentCommentRepository extends JpaRepository<IncidentComment,Long> {
    List<IncidentComment> findAllByIncident_IdOrderByCreatedAtAsc(Long incidentId);
    long countByIncident_Id(Long incidentId);
}
interface IncidentVoteRepository extends JpaRepository<IncidentVote,Long> {
    boolean existsByIncident_IdAndUser_Id(Long incidentId, Long userId);
    long countByIncident_Id(Long incidentId);
    void deleteByIncident_IdAndUser_Id(Long incidentId, Long userId);
}

@Entity
@Table(name="password_reset_token")
class PasswordResetToken {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.EAGER, optional=false) @JoinColumn(name="user_id", nullable=false) private AppUser user;
    @Column(name="token_hash", nullable=false, unique=true, length=64, columnDefinition="CHAR(64)") private String tokenHash;
    @Column(name="created_at", nullable=false) private Instant createdAt = Instant.now();
    @Column(name="expires_at", nullable=false) private Instant expiresAt;
    @Column(name="consumed_at") private Instant consumedAt;
    protected PasswordResetToken() {}
    PasswordResetToken(AppUser user, String tokenHash, Instant expiresAt) { this.user=user; this.tokenHash=tokenHash; this.expiresAt=expiresAt; }
    Long getId(){return id;} AppUser getUser(){return user;} Instant getExpiresAt(){return expiresAt;} Instant getConsumedAt(){return consumedAt;} void consume(){this.consumedAt=Instant.now();}
}

interface PasswordResetRepository extends JpaRepository<PasswordResetToken,Long> {
    Optional<PasswordResetToken> findByTokenHashAndConsumedAtIsNull(String tokenHash);
    void deleteAllByUser_Id(Long userId);
}

@Component
class AdminBootstrap implements CommandLineRunner {
    private final UserRepository users;
    AdminBootstrap(UserRepository users) { this.users=users; }
    @Override public void run(String... args) throws Exception {
        if (users.existsByUsernameIgnoreCase("cityadmin")) return;
        Path credentialFile = Path.of("password.md");
        String password;
        if (Files.exists(credentialFile)) {
            String contents = Files.readString(credentialFile);
            java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("(?m)^Password: `([A-Za-z0-9_-]{40,})`$").matcher(contents);
            if (!matcher.find()) throw new IllegalStateException("password.md exists but does not contain the generated CityConnect administrator credential format");
            password = matcher.group(1);
        } else {
            byte[] random = new byte[32];
            new SecureRandom().nextBytes(random);
            password = Base64.getUrlEncoder().withoutPadding().encodeToString(random);
            String credentials = "# CityConnect initial administrator\n\nUsername: `cityadmin`\nEmail: `cityadmin@cityconnect.local`\nPassword: `"+password+"`\n\nStore this password securely and remove this file after saving it.\n";
            Files.writeString(credentialFile, credentials, java.nio.file.StandardOpenOption.CREATE_NEW, java.nio.file.StandardOpenOption.WRITE);
            try { Files.setPosixFilePermissions(credentialFile, Set.of(PosixFilePermission.OWNER_READ, PosixFilePermission.OWNER_WRITE)); }
            catch (UnsupportedOperationException ignored) { /* Non-POSIX filesystem: file remains local and git-ignored. */ }
        }
        users.save(new AppUser("cityadmin", "cityadmin@cityconnect.local", "CityConnect Administrator", SecurityConfig.passwordEncoder().encode(password), Role.ADMIN));
        System.out.println("CityConnect administrator initialized. Credentials are stored in password.md.");
    }
}
