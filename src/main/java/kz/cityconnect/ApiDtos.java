package kz.cityconnect;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

record RegisterRequest(@NotBlank @Size(min=2,max=80) String fullName,
                       @NotBlank @Size(min=3,max=40) String username,
                       @NotBlank @Email @Size(max=254) String email,
                       @NotBlank @Size(min=10,max=72) String password) {}
record LoginRequest(@NotBlank String username, @NotBlank String password) {}
record CreateIncidentRequest(@NotBlank @Size(max=120) String title,
                             @NotBlank @Size(max=3000) String description,
                             @NotBlank @Size(max=60) String category,
                             @NotBlank @Size(max=200) String location,
                             @jakarta.validation.constraints.DecimalMin("-90.0") @jakarta.validation.constraints.DecimalMax("90.0") Double latitude,
                             @jakarta.validation.constraints.DecimalMin("-180.0") @jakarta.validation.constraints.DecimalMax("180.0") Double longitude) {}
record StatusRequest(@NotBlank String status) {}
record StatusUpdateRequest(@NotBlank String status, @jakarta.validation.constraints.Size(max=500) String note) {}
record RoleRequest(@NotBlank String role) {}
record CommentRequest(@NotBlank @Size(max=1000) String body) {}
record IncidentUpdateRequest(@NotBlank @Size(max=120) String title,@NotBlank @Size(max=3000) String description,@NotBlank @Size(max=60) String category,@NotBlank @Size(max=200) String location,@jakarta.validation.constraints.DecimalMin("-90.0") @jakarta.validation.constraints.DecimalMax("90.0") Double latitude,@jakarta.validation.constraints.DecimalMin("-180.0") @jakarta.validation.constraints.DecimalMax("180.0") Double longitude) {}
record DepartmentRequest(@NotBlank @Size(max=100) String name,@Size(max=500) String description) {}
record UserDepartmentRequest(Long departmentId) {}
record IncidentAssignmentRequest(Long departmentId,Long employeeId) {}
record InternalNoteRequest(@NotBlank @Size(max=2000) String body) {}
