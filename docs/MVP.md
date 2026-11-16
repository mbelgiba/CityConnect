# CityConnect

CityConnect is a responsive civic reporting MVP. The Spring Boot application serves the API and the English, Russian, and Kazakh interface from one process. New accounts are citizens by default; an administrator manages roles and staff access.

## Capabilities

- Registration, username login, BCrypt password hashing, one hour bearer tokens, profile editing, password changes, login throttling, and administrator-assisted password recovery with single-use 30 minute codes.
- Roles: `CITIZEN`, `EMPLOYEE`, and `ADMIN`. Citizens submit and edit their own reports while the report is new. Employees can work only on reports assigned to them. Administrators manage roles, departments, and assignments.
- Public report discussion and support voting, status history, optional internal staff notes, category/status/search filters, server-side sorting and pagination, and employee work queues.
- Optional latitude and longitude on reports, browser geolocation entry, a Leaflet map with activity circles, and user notifications for assignments and report status changes.
- Administrator analytics for report status, categories, departments, monthly volume, ageing active reports, and average resolution time; CSV export protects spreadsheet formula cells.
- H2 file storage for local development and a PostgreSQL Maven profile for deployment. Flyway applies schema updates.

## Start locally

Requirements: Java 21 and Maven 3.9 or newer.

```sh
scripts/check-environment.sh
scripts/run.sh
```

Open `http://localhost:8080`. To use another port, run `PORT=8081 scripts/run.sh`. The first launch creates a `cityadmin` account and writes its random password to the ignored `password.md` file. Keep that file private. Save the credential securely before removing it.

The interface uses Leaflet and OpenStreetMap tiles from public CDN/tile services. If those services are unreachable, report creation, lists, and the rest of the application remain available; the map shows a fallback message.

## PostgreSQL

Create a PostgreSQL database and user, then provide `DB_URL`, `DB_USER`, `DB_PASSWORD`, and `CITYCONNECT_JWT_SECRET` (at least 32 bytes). Start with the optional Maven profile:

```sh
DB_URL=jdbc:postgresql://localhost:5432/cityconnect \
DB_USER=cityconnect DB_PASSWORD='your-secret' \
CITYCONNECT_JWT_SECRET='replace-with-a-random-secret-of-at-least-32-bytes' \
mvn -Ppostgres -Dspring-boot.run.profiles=postgres spring-boot:run
```

The PostgreSQL driver and Flyway PostgreSQL module are isolated in the `postgres` profile, so the normal H2 build does not need those downloads.

## API

Authenticated routes use `Authorization: Bearer <token>`.

### Accounts

- `POST /api/auth/register` — `fullName`, `username`, `email`, `password` (10–72 characters).
- `POST /api/auth/login` — `username`, `password`.
- `GET /api/auth/me`, `PATCH /api/auth/profile`, `PATCH /api/auth/password`.
- `POST /api/auth/password-reset` — public endpoint requiring an administrator-issued `token` and a new password.
- `GET /api/admin/users`, `PATCH /api/admin/users/{id}/role`, `POST /api/admin/users/{id}/password-reset` — administrator only. The MVP returns recovery codes to the administrator; email delivery is not configured.

### Reports and staff workflow

- `GET /api/incidents?status=IN_PROGRESS&category=Roads%20and%20sidewalks&q=bridge&page=0&size=25&sort=createdAt,desc` — reports, with optional status/category/search and pagination.
- `POST /api/incidents` — `title`, `description`, `category`, `location`, and optional `latitude`, `longitude`.
- `PATCH /api/incidents/{id}` and `DELETE /api/incidents/{id}` — only the owner, only while status is `NEW`.
- `PATCH /api/incidents/{id}/status` — administrators or the employee assigned to the report; body: `status` and optional `note`.
- `GET /api/incidents/{id}/history` — public status timeline.
- `GET|POST /api/incidents/{id}/comments`, `PUT|DELETE /api/incidents/{id}/vote` — signed-in community interaction.
- `GET /api/incidents/assigned` — employee's assigned work queue.
- `GET|POST /api/incidents/{id}/internal-notes` — administrator or assigned employee only.
- `GET|POST /api/admin/departments`, `PATCH /api/admin/departments/{id}` — department management.
- `PATCH /api/admin/users/{id}/department` — assign an employee to a department.
- `PATCH /api/admin/incidents/{id}/assignment` — assign a department and an employee from that department to a report; send `null` values to clear the assignment.

### Notifications and administration

- `GET /api/notifications` — latest 20 notifications plus unread count.
- `PATCH /api/notifications/{id}/read`, `POST /api/notifications/read-all`.
- `GET /api/admin/analytics` — aggregate counts and trends.
- `GET /api/admin/reports.csv` — spreadsheet-friendly CSV export.
- `GET /api/health` — application health.

## Build and verification

```sh
mvn test-compile
mvn test
node --check src/main/resources/static/js/app.js
```

The integration tests use an isolated in-memory H2 database. Maven may need network access once to download uncached plugins and dependencies.

## MVP boundaries

Recovery codes are delivered by an administrator rather than email/SMS. Notifications are stored and shown in the inbox; push delivery and real-time sockets are not configured. Map coordinates are optional and entered by the reporter or browser geolocation. Login throttling is process-local and resets on restart. Access/refresh token rotation and cookie-based authentication are not part of this MVP.
