package kz.cityconnect;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
class ApiExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> invalidBody(MethodArgumentNotValidException error, HttpServletRequest request) {
        Map<String, String> fields = error.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, field -> field.getDefaultMessage() == null ? "Invalid value" : field.getDefaultMessage(), (first, ignored) -> first, LinkedHashMap::new));
        return response(HttpStatus.BAD_REQUEST, "Please check the submitted fields", request, fields);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<ApiError> invalidParameter(ConstraintViolationException error, HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "One or more values are invalid", request, Map.of());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<ApiError> unreadableBody(HttpMessageNotReadableException error, HttpServletRequest request) {
        return response(HttpStatus.BAD_REQUEST, "The request body is missing or malformed", request, Map.of());
    }

    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<ApiError> expectedStatus(ResponseStatusException error, HttpServletRequest request) {
        HttpStatus status = HttpStatus.valueOf(error.getStatusCode().value());
        String message = error.getReason() == null ? status.getReasonPhrase() : error.getReason();
        return response(status, message, request, Map.of());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<ApiError> duplicate(DataIntegrityViolationException error, HttpServletRequest request) {
        return response(HttpStatus.CONFLICT, "This change conflicts with existing data. Refresh and try again.", request, Map.of());
    }

    @ExceptionHandler(AuthenticationException.class)
    ResponseEntity<ApiError> unauthenticated(AuthenticationException error, HttpServletRequest request) {
        return response(HttpStatus.UNAUTHORIZED, "Please sign in and try again", request, Map.of());
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<ApiError> forbidden(AccessDeniedException error, HttpServletRequest request) {
        return response(HttpStatus.FORBIDDEN, "You do not have permission to perform this action", request, Map.of());
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiError> unexpected(Exception error, HttpServletRequest request) {
        log.error("Unexpected API error on {} {}", request.getMethod(), request.getRequestURI(), error);
        return response(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong. Please try again.", request, Map.of());
    }

    private ResponseEntity<ApiError> response(HttpStatus status, String message, HttpServletRequest request, Map<String, String> fields) {
        return ResponseEntity.status(status).body(new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), message, request.getRequestURI(), fields));
    }
}

record ApiError(Instant timestamp, int status, String error, String message, String path, Map<String, String> fields) {}
