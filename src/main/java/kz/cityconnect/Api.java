package kz.cityconnect;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.servlet.http.HttpServletRequest;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
class Api {
    private final UserRepository users;
    private final IncidentRepository incidents;
    private final IncidentCommentRepository comments;
    private final IncidentVoteRepository votes;
    private final TokenService tokens;
    private final AccountService accounts;
    private final IncidentStatusHistoryRepository history;
    private final DepartmentRepository departments;
    private final IncidentInternalNoteRepository internalNotes;
    private final UserNotificationRepository notifications;

    Api(UserRepository users, IncidentRepository incidents, IncidentCommentRepository comments, IncidentVoteRepository votes, TokenService tokens, AccountService accounts, IncidentStatusHistoryRepository history, DepartmentRepository departments, IncidentInternalNoteRepository internalNotes,UserNotificationRepository notifications) {
        this.users = users; this.incidents = incidents; this.comments = comments; this.votes = votes; this.tokens = tokens; this.accounts = accounts; this.history=history; this.departments=departments; this.internalNotes=internalNotes;this.notifications=notifications;
    }

    @GetMapping("/health")
    Health health() { return new Health("UP", "CityConnect MVP"); }

    @PostMapping("/auth/register")
    @ResponseStatus(HttpStatus.CREATED)
    AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return accounts.register(request);
    }

    @PostMapping("/auth/login")
    AuthResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        String key = request.username().trim().toLowerCase(java.util.Locale.ROOT) + "@" + servletRequest.getRemoteAddr();
        return accounts.login(request, key);
    }

    @GetMapping("/auth/me")
    UserView me(Authentication auth) { return accounts.currentUser(auth.getName()); }

    @PatchMapping("/auth/profile")
    UserView updateProfile(@Valid @RequestBody ProfileRequest request, Authentication auth) {
        return accounts.updateProfile(auth.getName(), request);
    }

    @PatchMapping("/auth/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void changePassword(@Valid @RequestBody PasswordChangeRequest request, Authentication auth) {
        accounts.changePassword(auth.getName(), request);
    }

    @PostMapping("/auth/password-reset")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        accounts.resetPassword(request);
    }

    @GetMapping("/incidents")
    List<IncidentView> list(Authentication auth, @RequestParam(required=false) String status, @RequestParam(required=false) String category,
                            @RequestParam(required=false) String q, @RequestParam(defaultValue="0") int page,
                            @RequestParam(defaultValue="100") int size, @RequestParam(defaultValue="createdAt,desc") String sort) {
        AppUser user = current(auth);
        IncidentStatus parsedStatus=null;
        if(status!=null&&!status.isBlank()) try { parsedStatus=IncidentStatus.valueOf(status.trim().toUpperCase(java.util.Locale.ROOT)); }
        catch(IllegalArgumentException ex){throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Unknown status");}
        org.springframework.data.domain.Sort order;
        if("createdAt,asc".equals(sort)) order=org.springframework.data.domain.Sort.by("createdAt").ascending();
        else if("updatedAt,desc".equals(sort)) order=org.springframework.data.domain.Sort.by("updatedAt").descending();
        else if("createdAt,desc".equals(sort)) order=org.springframework.data.domain.Sort.by("createdAt").descending();
        else throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Unsupported sort order");
        var pageable=org.springframework.data.domain.PageRequest.of(Math.max(0,page),Math.max(1,Math.min(100,size)),order);
        return incidents.search(parsedStatus,category==null||category.isBlank()?null:category.trim(),q==null||q.isBlank()?null:q.trim(),pageable).stream().map(incident -> view(incident, user)).toList();
    }

    @GetMapping("/incidents/assigned")
    List<IncidentView> assigned(Authentication auth){
        AppUser actor=current(auth);
        if(actor.getRole()!=Role.EMPLOYEE) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Employee role required");
        return incidents.findAllByAssignedEmployee_IdOrderByCreatedAtDesc(actor.getId()).stream().map(item->view(item,actor)).toList();
    }

    @PostMapping("/incidents")
    @ResponseStatus(HttpStatus.CREATED)
    IncidentView create(@Valid @RequestBody CreateIncidentRequest request, Authentication auth) {
        AppUser user = current(auth);
        Incident incident = new Incident("CC-%08d".formatted(System.nanoTime() & 0xffffffffL), request.title().trim(),
                request.description().trim(), request.category().trim(), request.location().trim(),request.latitude(),request.longitude(), user);
        incident=incidents.save(incident);
        history.save(new IncidentStatusHistory(incident,user,null,IncidentStatus.NEW,"Report submitted"));
        return view(incident, user);
    }

    @PatchMapping("/incidents/{id}")
    IncidentView update(@PathVariable long id,@Valid @RequestBody IncidentUpdateRequest request,Authentication auth){
        AppUser actor=current(auth); Incident incident=incidents.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Report not found"));
        if(!incident.getCreatedBy().getId().equals(actor.getId())||incident.getStatus()!=IncidentStatus.NEW) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Only your new reports can be edited");
        incident.updateDetails(request.title().trim(),request.description().trim(),request.category().trim(),request.location().trim(),request.latitude(),request.longitude());
        return view(incidents.save(incident),actor);
    }

    @DeleteMapping("/incidents/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable long id,Authentication auth){
        AppUser actor=current(auth); Incident incident=incidents.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Report not found"));
        if(!incident.getCreatedBy().getId().equals(actor.getId())||incident.getStatus()!=IncidentStatus.NEW) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Only your new reports can be deleted");
        incidents.delete(incident);
    }

    @PatchMapping("/incidents/{id}/status")
    IncidentView status(@PathVariable long id, @Valid @RequestBody StatusUpdateRequest request, Authentication auth) {
        AppUser actor = current(auth);
        if (actor.getRole() == Role.CITIZEN) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Staff role required");
        Incident incident = incidents.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        requireStaffAccess(incident,actor);
        IncidentStatus next;
        try { next = IncidentStatus.valueOf(request.status()); }
        catch (IllegalArgumentException ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown status"); }
        IncidentStatus previous=incident.getStatus();
        incident.setStatus(next);
        incident.setUpdatedAt(Instant.now());
        Incident saved=incidents.save(incident);
        if(previous!=next){
            history.save(new IncidentStatusHistory(saved,actor,previous,next,request.note()==null?null:request.note().trim()));
            if(!saved.getCreatedBy().getId().equals(actor.getId())) notifications.save(new UserNotification(saved.getCreatedBy(),saved,"STATUS","Report status updated","Report "+saved.getReferenceCode()+" is now "+next.name().replace('_',' ')+"."));
        }
        return view(saved, actor);
    }

    @GetMapping("/incidents/{id}/history")
    List<IncidentStatusView> statusHistory(@PathVariable long id){
        requireIncident(id);
        return history.findAllByIncident_IdOrderByCreatedAtAsc(id).stream().map(IncidentStatusView::from).toList();
    }

    @GetMapping("/notifications")
    NotificationInbox notificationInbox(Authentication auth){
        AppUser user=current(auth);var page=notifications.findAllByUser_IdOrderByCreatedAtDesc(user.getId(),org.springframework.data.domain.PageRequest.of(0,20));
        return new NotificationInbox(page.stream().map(NotificationView::from).toList(),notifications.countByUser_IdAndReadAtIsNull(user.getId()));
    }

    @PatchMapping("/notifications/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void markNotificationRead(@PathVariable long id,Authentication auth){
        UserNotification item=notifications.findByIdAndUser_Id(id,current(auth).getId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Notification not found"));
        item.markRead();notifications.save(item);
    }

    @PostMapping("/notifications/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void markAllNotificationsRead(Authentication auth){notifications.findAllByUser_IdAndReadAtIsNull(current(auth).getId()).forEach(item->{item.markRead();notifications.save(item);});}

    @GetMapping("/incidents/{id}/internal-notes")
    List<InternalNoteView> listInternalNotes(@PathVariable long id,Authentication auth){
        AppUser actor=current(auth); Incident incident=requireIncident(id); requireStaffAccess(incident,actor);
        return internalNotes.findAllByIncident_IdOrderByCreatedAtAsc(id).stream().map(InternalNoteView::from).toList();
    }

    @PostMapping("/incidents/{id}/internal-notes")
    @ResponseStatus(HttpStatus.CREATED)
    InternalNoteView addInternalNote(@PathVariable long id,@Valid @RequestBody InternalNoteRequest request,Authentication auth){
        AppUser actor=current(auth); Incident incident=requireIncident(id); requireStaffAccess(incident,actor);
        return InternalNoteView.from(internalNotes.save(new IncidentInternalNote(incident,actor,request.body().trim())));
    }

    @GetMapping("/incidents/{id}/comments")
    List<CommentView> comments(@PathVariable long id) {
        requireIncident(id);
        return comments.findAllByIncident_IdOrderByCreatedAtAsc(id).stream().map(CommentView::from).toList();
    }

    @PostMapping("/incidents/{id}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    CommentView addComment(@PathVariable long id, @Valid @RequestBody CommentRequest request, Authentication auth) {
        Incident incident = requireIncident(id);
        AppUser author = current(auth);
        return CommentView.from(comments.save(new IncidentComment(incident, author, request.body().trim())));
    }

    @PutMapping("/incidents/{id}/vote")
    VoteView vote(@PathVariable long id, Authentication auth) {
        Incident incident = requireIncident(id);
        AppUser user = current(auth);
        if (!votes.existsByIncident_IdAndUser_Id(id, user.getId())) {
            try { votes.saveAndFlush(new IncidentVote(incident, user)); }
            catch (DataIntegrityViolationException duplicateRequest) {
                if (!votes.existsByIncident_IdAndUser_Id(id, user.getId())) throw duplicateRequest;
            }
        }
        return new VoteView(votes.countByIncident_Id(id), true);
    }

    @DeleteMapping("/incidents/{id}/vote")
    VoteView unvote(@PathVariable long id, Authentication auth) {
        requireIncident(id);
        AppUser user = current(auth);
        votes.deleteByIncident_IdAndUser_Id(id, user.getId());
        return new VoteView(votes.countByIncident_Id(id), false);
    }

    @PatchMapping("/admin/users/{id}/role")
    UserView role(@PathVariable long id, @Valid @RequestBody RoleRequest request) {
        AppUser user = users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        try {
            Role next=Role.valueOf(request.role());
            if(user.getRole()==Role.ADMIN&&next!=Role.ADMIN&&users.countByRole(Role.ADMIN)<=1) throw new ResponseStatusException(HttpStatus.CONFLICT,"At least one administrator must remain");
            user.setRole(next);
        }
        catch (IllegalArgumentException ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown role"); }
        return UserView.from(users.save(user));
    }

    @GetMapping("/admin/users")
    List<UserView> users() { return users.findAll().stream().map(UserView::from).toList(); }

    @GetMapping("/admin/departments")
    List<DepartmentView> departments(){return this.departments.findAll().stream().map(DepartmentView::from).toList();}

    @GetMapping("/admin/analytics")
    AnalyticsView analytics(){
        List<Incident> all=incidents.findAll();
        Map<String,Long> statuses=new java.util.TreeMap<>(),categories=new java.util.TreeMap<>(),departmentCounts=new java.util.TreeMap<>();
        Map<String,Long> monthly=new java.util.TreeMap<>();
        java.time.YearMonth current=java.time.YearMonth.now();
        for(int i=5;i>=0;i--) monthly.put(current.minusMonths(i).toString(),0L);
        long resolved=0,active=0,overdue=0;double hours=0;long resolvedDurations=0;
        Instant overdueCutoff=Instant.now().minusSeconds(7L*24*60*60);
        for(Incident item:all){
            String status=item.getStatus().name();statuses.merge(status,1L,Long::sum);categories.merge(item.getCategory(),1L,Long::sum);
            if(item.getDepartment()!=null)departmentCounts.merge(item.getDepartment().getName(),1L,Long::sum);
            java.time.YearMonth month=java.time.YearMonth.from(item.getCreatedAt().atZone(java.time.ZoneId.systemDefault()));
            monthly.computeIfPresent(month.toString(),(key,value)->value+1);
            if(item.getStatus()==IncidentStatus.RESOLVED||item.getStatus()==IncidentStatus.CLOSED){resolved++;hours+=java.time.Duration.between(item.getCreatedAt(),item.getUpdatedAt()).toSeconds()/3600.0;resolvedDurations++;}
            else if(item.getStatus()!=IncidentStatus.REJECTED){active++;if(item.getCreatedAt().isBefore(overdueCutoff))overdue++;}
        }
        return new AnalyticsView(all.size(),active,resolved,overdue,resolvedDurations==0?0:Math.round(hours/resolvedDurations*10.0)/10.0,statuses,categories,departmentCounts,monthly,Instant.now());
    }

    @GetMapping("/admin/reports.csv")
    ResponseEntity<String> exportReports(){
        StringBuilder csv=new StringBuilder("id,reference,title,description,category,location,latitude,longitude,status,created_by,department,assigned_employee,created_at,updated_at\r\n");
        for(Incident item:incidents.findAllByOrderByCreatedAtDesc()){
            csv.append(item.getId()).append(',').append(csv(item.getReferenceCode())).append(',').append(csv(item.getTitle())).append(',').append(csv(item.getDescription())).append(',').append(csv(item.getCategory())).append(',').append(csv(item.getLocation())).append(',').append(item.getLatitude()==null?"":item.getLatitude()).append(',').append(item.getLongitude()==null?"":item.getLongitude()).append(',').append(csv(item.getStatus().name())).append(',').append(csv(item.getCreatedBy().getUsername())).append(',').append(csv(item.getDepartment()==null?"":item.getDepartment().getName())).append(',').append(csv(item.getAssignedEmployee()==null?"":item.getAssignedEmployee().getUsername())).append(',').append(csv(item.getCreatedAt().toString())).append(',').append(csv(item.getUpdatedAt().toString())).append("\r\n");
        }
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=cityconnect-reports.csv").contentType(MediaType.parseMediaType("text/csv;charset=UTF-8")).body("\uFEFF"+csv);
    }

    @PostMapping("/admin/departments")
    @ResponseStatus(HttpStatus.CREATED)
    DepartmentView createDepartment(@Valid @RequestBody DepartmentRequest request){
        if(departments.findByNameIgnoreCase(request.name().trim()).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT,"Department name is already registered");
        return DepartmentView.from(departments.save(new Department(request.name().trim(),request.description()==null?null:request.description().trim())));
    }

    @PatchMapping("/admin/departments/{id}")
    DepartmentView updateDepartment(@PathVariable long id,@Valid @RequestBody DepartmentRequest request){
        Department department=departments.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Department not found"));
        if(departments.findByNameIgnoreCase(request.name().trim()).filter(other->!other.getId().equals(id)).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT,"Department name is already registered");
        department.update(request.name().trim(),request.description()==null?null:request.description().trim()); return DepartmentView.from(departments.save(department));
    }

    @PatchMapping("/admin/users/{id}/department")
    UserView assignUserDepartment(@PathVariable long id,@RequestBody UserDepartmentRequest request){
        AppUser user=users.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Account not found"));
        if(user.getRole()!=Role.EMPLOYEE) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Only employees can be assigned to a department");
        Department department=request.departmentId()==null?null:departments.findById(request.departmentId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Department not found"));
        user.setDepartment(department);return UserView.from(users.save(user));
    }

    @PatchMapping("/admin/incidents/{id}/assignment")
    IncidentView assignIncident(@PathVariable long id,@RequestBody IncidentAssignmentRequest request,Authentication auth){
        AppUser actor=current(auth); Incident incident=requireIncident(id);
        Department department=request.departmentId()==null?null:departments.findById(request.departmentId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Department not found"));
        AppUser employee=request.employeeId()==null?null:users.findById(request.employeeId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Employee not found"));
        if(employee!=null&&(employee.getRole()!=Role.EMPLOYEE||department==null||employee.getDepartment()==null||!department.getId().equals(employee.getDepartment().getId()))) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Choose an employee from the selected department");
        AppUser previousEmployee=incident.getAssignedEmployee();
        incident.assign(department,employee);Incident saved=incidents.save(incident);
        if(employee!=null&&(previousEmployee==null||!previousEmployee.getId().equals(employee.getId()))) notifications.save(new UserNotification(employee,saved,"ASSIGNMENT","A report has been assigned to you","Report "+saved.getReferenceCode()+" needs your attention."));
        return view(saved,actor);
    }

    @PostMapping("/admin/users/{id}/password-reset")
    PasswordResetIssued issuePasswordReset(@PathVariable long id) { return accounts.issuePasswordReset(id); }

    private Incident requireIncident(long id) { return incidents.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found")); }
    private static String csv(String value){String safe=value==null?"":value;if(!safe.isEmpty()&&"=+-@\t\r".indexOf(safe.charAt(0))>=0)safe="'"+safe;return "\""+safe.replace("\"","\"\"")+"\"";}
    private void requireStaffAccess(Incident incident,AppUser actor){if(actor.getRole()!=Role.ADMIN&&(actor.getRole()!=Role.EMPLOYEE||incident.getAssignedEmployee()==null||!incident.getAssignedEmployee().getId().equals(actor.getId()))) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Report is not assigned to this employee");}
    private IncidentView view(Incident incident, AppUser user) {
        return IncidentView.from(incident, comments.countByIncident_Id(incident.getId()), votes.countByIncident_Id(incident.getId()), votes.existsByIncident_IdAndUser_Id(incident.getId(), user.getId()));
    }
    private AppUser current(Authentication auth) { return users.findByUsername(auth.getName()).orElseThrow(); }
}

record Health(String status, String application) {}
record AuthResponse(String token, String tokenType, long expiresIn, UserView user) {}
record UserView(long id, String username, String fullName, String email, Role role,Long departmentId,String departmentName) {
    static UserView from(AppUser u) { return new UserView(u.getId(), u.getUsername(), u.getFullName(), u.getEmail(), u.getRole(),u.getDepartment()==null?null:u.getDepartment().getId(),u.getDepartment()==null?null:u.getDepartment().getName()); }
}
record IncidentView(long id, String referenceCode, String title, String description, String category, String location,
                    IncidentStatus status, String createdBy, long createdById, Instant createdAt, Instant updatedAt, long commentCount, long voteCount, boolean votedByMe,Long departmentId,String departmentName,Long assignedEmployeeId,String assignedEmployee,Double latitude,Double longitude) {
    static IncidentView from(Incident i, long commentCount, long voteCount, boolean votedByMe) { return new IncidentView(i.getId(), i.getReferenceCode(), i.getTitle(), i.getDescription(), i.getCategory(), i.getLocation(), i.getStatus(), i.getCreatedBy().getUsername(), i.getCreatedBy().getId(), i.getCreatedAt(), i.getUpdatedAt(), commentCount, voteCount, votedByMe,i.getDepartment()==null?null:i.getDepartment().getId(),i.getDepartment()==null?null:i.getDepartment().getName(),i.getAssignedEmployee()==null?null:i.getAssignedEmployee().getId(),i.getAssignedEmployee()==null?null:i.getAssignedEmployee().getUsername(),i.getLatitude(),i.getLongitude()); }
}
record CommentView(long id, String body, String author, Instant createdAt) {
    static CommentView from(IncidentComment comment) { return new CommentView(comment.getId(), comment.getBody(), comment.getAuthor().getUsername(), comment.getCreatedAt()); }
}
record VoteView(long voteCount, boolean voted) {}
record IncidentStatusView(String fromStatus,String toStatus,String changedBy,String note,Instant createdAt){
    static IncidentStatusView from(IncidentStatusHistory item){return new IncidentStatusView(item.getFromStatus()==null?null:item.getFromStatus().name(),item.getToStatus().name(),item.getChangedBy().getUsername(),item.getNote(),item.getCreatedAt());}
}
record DepartmentView(long id,String name,String description){static DepartmentView from(Department item){return new DepartmentView(item.getId(),item.getName(),item.getDescription());}}
record InternalNoteView(long id,String body,String author,Instant createdAt){static InternalNoteView from(IncidentInternalNote note){return new InternalNoteView(note.getId(),note.getBody(),note.getAuthor().getUsername(),note.getCreatedAt());}}
record NotificationView(long id,String type,String title,String body,Long incidentId,Instant createdAt,Instant readAt){static NotificationView from(UserNotification item){return new NotificationView(item.getId(),item.getType(),item.getTitle(),item.getBody(),item.getIncidentId(),item.getCreatedAt(),item.getReadAt());}}
record NotificationInbox(List<NotificationView> items,long unreadCount){}
record AnalyticsView(long total,long active,long resolved,long overdue,double averageResolutionHours,Map<String,Long> statuses,Map<String,Long> categories,Map<String,Long> departments,Map<String,Long> monthlyCounts,Instant generatedAt){}
