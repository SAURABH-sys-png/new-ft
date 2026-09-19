# Admin and Authentication Routes

This document describes the admin routes and the authentication routes required to obtain an admin token.

## Base URL

```text
/api
```

## Authentication

### Admin routes

Every route under `/api/admin` is protected by:

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

The token must be valid, not expired or revoked, belong to an active user, and contain the `admin` role. Missing or invalid authentication returns `401`; a valid non-admin user returns `403`.

Authentication middleware responses:

```json
{ "message": "Authentication required. Please provide a valid token in the Authorization header." }
```

```json
{ "message": "Invalid token." }
```

```json
{ "message": "Forbidden. You do not have permission to perform this action." }
```

### Common server error

Most admin handlers return this shape for an unexpected database or server error:

```http
500 Internal Server Error
```

```json
{ "message": "Internal server error" }
```

---

# Authentication Routes

These routes are public and are used to create an account or obtain a JWT for admin requests.

## POST `/api/auth/signup`

Creates a user account and immediately returns a seven-day JWT.

### Request body

```json
{
  "username": "adminuser",
  "email": "admin@example.com",
  "mobileNumber": "+14155552671",
  "password": "strong-password"
}
```

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `username` | string | yes | Trimmed length must be 3-50 characters. |
| `password` | string | yes | Length must be 8-128 characters. |
| `email` | string | conditionally | At least `email` or `mobileNumber` is required. Must be a valid email address; it is trimmed and lowercased. |
| `mobileNumber` | string | conditionally | At least `mobileNumber` or `email` is required. Must use E.164 format, for example `+14155552671`. |

### Success response: `201 Created`

```json
{
  "message": "User created successfully",
  "token": "<jwt>",
  "user": {
    "uuid": "user-uuid",
    "username": "adminuser",
    "mobileNumber": "+14155552671",
    "email": "admin@example.com",
    "role": "user"
  }
}
```

New accounts receive the default role `user`. Creating an admin account requires changing the role through the admin role route or directly in the database.

### Errors

- `400`: `{ "message": "Username, password, and at least a mobile number or email are required." }`
- `409`: `{ "message": "An account with those details already exists" }`
- `500`: handled by the application error handler if an unexpected error occurs.

## POST `/api/auth/login`

Authenticates an active user and returns a seven-day JWT. The token's role is used by the admin middleware.

### Request body

Use either `identifier` or one of the specific identity fields:

```json
{
  "identifier": "admin@example.com",
  "password": "strong-password"
}
```

Specific-field form:

```json
{
  "email": "admin@example.com",
  "password": "strong-password"
}
```

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `identifier` | string | conditionally | May match a mobile number, username, or email. |
| `mobileNumber` | string | conditionally | Used when `identifier` is omitted. |
| `username` | string | conditionally | Used when `identifier` is omitted. |
| `email` | string | conditionally | Used when `identifier` is omitted; trimmed and lowercased. |
| `password` | string | yes | Length must be 8-128 characters. |

At least one login identity must be provided. If `identifier` is present, the server tries it as a mobile number, username, and email.

### Success response: `200 OK`

```json
{
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "uuid": "admin-uuid",
    "username": "adminuser",
    "mobileNumber": "+14155552671",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Errors

- `400`: `{ "message": "Password is required" }`
- `400`: `{ "message": "Please provide a mobile number, username, or email to login." }`
- `401`: `{ "message": "Invalid credentials" }`
- `403`: `{ "message": "User account is inactive or suspended." }`

---

# Admin Routes

## User Management

### GET `/api/admin/users`

Returns a paginated list of users, newest first.

### Query parameters

| Parameter | Type | Default | Rules |
|---|---|---:|---|
| `role` | string | none | Optional filter: `user`, `admin`, or `contributor`. |
| `isActive` | boolean string | none | Optional filter. Use `true` or `false`. |
| `page` | integer | `1` | Values below 1 become `1`. |
| `limit` | integer | `20` | Clamped to the range 1-100. |

Example:

```http
GET /api/admin/users?role=user&isActive=true&page=1&limit=20
```

### Success response: `200 OK`

```json
{
  "users": [
    {
      "uuid": "user-uuid",
      "username": "student1",
      "email": "student@example.com",
      "mobileNumber": "+14155552671",
      "role": "user",
      "isActive": true,
      "isMobileVerified": false,
      "isEmailVerified": true,
      "testSeriesAccess": [],
      "createdAt": "2026-09-18T10:00:00.000Z",
      "updatedAt": "2026-09-18T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

`passwordHash` is excluded from normal user queries.

### GET `/api/admin/users/:uuid`

Returns one user by UUID.

### Path parameter

| Parameter | Type | Required |
|---|---|---:|
| `uuid` | string | yes |

### Success response: `200 OK`

Returns the user document as JSON, excluding the password hash.

### Errors

- `404`: `{ "message": "User not found" }`

### PUT `/api/admin/users/:uuid/role`

Changes a user's role.

### Request body

```json
{ "role": "contributor" }
```

`role` must be one of `user`, `admin`, or `contributor`. An admin cannot change their own role.

### Success response: `200 OK`

Returns the updated user document.

### Errors

- `400`: `{ "message": "Invalid role. Must be one of: user, admin, contributor" }`
- `400`: `{ "message": "You cannot change your own role" }`
- `404`: `{ "message": "User not found" }`

### PATCH `/api/admin/users/:uuid/active`

Activates or deactivates a user.

### Request body

```json
{ "isActive": false }
```

`isActive` must be a JSON boolean, not a string.

### Success response: `200 OK`

Returns the updated user document.

### Errors

- `400`: `{ "message": "isActive must be a boolean" }`
- `404`: `{ "message": "User not found" }`

### DELETE `/api/admin/users/:uuid`

Deletes a user and their associated analytics document.

### Success response: `200 OK`

```json
{ "message": "User and associated analytics deleted successfully" }
```

### Errors

- `404`: `{ "message": "User not found" }`

### PATCH `/api/admin/users/:uuid/verification`

Updates one or both verification flags.

### Request body

```json
{
  "isMobileVerified": true,
  "isEmailVerified": true
}
```

Both fields are optional, but at least one must be a JSON boolean. Unknown or non-boolean values are ignored; a body with no valid update fields is rejected.

### Success response: `200 OK`

Returns the updated user document.

### Errors

- `400`: `{ "message": "Provide at least one of: isMobileVerified, isEmailVerified" }`
- `404`: `{ "message": "User not found" }`

## Test-Series Access

### POST `/api/admin/users/:uuid/test-series-access`

Grants or reactivates a user's access to a test series.

### Request body

```json
{
  "testSeriesUuid": "test-series-uuid",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

| Field | Type | Required | Rules |
|---|---|---:|---|
| `testSeriesUuid` | string | yes | Must be truthy. |
| `expiresAt` | date string | no | Must be parseable by JavaScript `Date.parse`. |

If access already exists, it is set to `active` and its purchase date is reset. If supplied, `expiresAt` is updated.

### Success response: `200 OK`

Returns the updated user document. The access entry has this shape:

```json
{
  "testSeriesUuid": "test-series-uuid",
  "status": "active",
  "purchasedAt": "2026-09-18T10:00:00.000Z",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

### Errors

- `400`: `{ "message": "testSeriesUuid is required" }`
- `400`: `{ "message": "expiresAt must be a valid date" }`
- `404`: `{ "message": "User not found" }`

### PATCH `/api/admin/users/:uuid/test-series-access/:testSeriesUuid/revoke`

Marks a user's matching test-series access as revoked. It does not remove the access entry.

### Success response: `200 OK`

Returns the updated user document. The matching access entry has `status: "revoked"`.

### Errors

- `404`: `{ "message": "User not found" }`
- `404`: `{ "message": "Test series access not found for this user" }`

## Analytics

### GET `/api/admin/analytics/platform`

Returns platform-wide user counts. `recentSignups` counts users created during the previous 30 days.

### Success response: `200 OK`

```json
{
  "totalUsers": 100,
  "activeUsers": 94,
  "inactiveUsers": 6,
  "roleBreakdown": {
    "user": 90,
    "admin": 3,
    "contributor": 7
  },
  "recentSignups": 12
}
```

### GET `/api/admin/analytics/user/:uuid`

Returns analytics for a specific user.

### Success response: `200 OK`

```json
{
  "uuid": "analytics-uuid",
  "userUuid": "user-uuid",
  "testPerformance": [],
  "createdAt": "2026-09-18T10:00:00.000Z",
  "updatedAt": "2026-09-18T10:00:00.000Z"
}
```

### Errors

- `404`: `{ "message": "User not found" }`
- `404`: `{ "message": "Analytics not found for this user" }`

## Exams

### POST `/api/admin/exams`

Creates an exam.

### Request body

```json
{
  "title": "Computer Science Entrance Exam",
  "description": "Core computer science assessment"
}
```

`title` must be a non-empty string. `description` is optional.

### Success response: `201 Created`

Returns the created exam document:

```json
{
  "uuid": "exam-uuid",
  "title": "Computer Science Entrance Exam",
  "description": "Core computer science assessment",
  "createdAt": "2026-09-18T10:00:00.000Z",
  "updatedAt": "2026-09-18T10:00:00.000Z"
}
```

### Errors

- `400`: `{ "message": "title is required" }`

### GET `/api/admin/exams`

Returns up to 100 exams.

### Success response: `200 OK`

Returns an array containing `uuid`, `title`, `description`, `createdAt`, and `updatedAt` for each exam.

### PUT `/api/admin/exams/:uuid`

Updates an exam.

### Request body

```json
{
  "title": "Updated exam title",
  "description": "Updated description"
}
```

The controller sends both fields to the model. `title` should be a non-empty string; `description` is optional.

### Success response: `200 OK`

Returns the updated exam document.

### Errors

- `404`: `{ "message": "Exam not found" }`

### DELETE `/api/admin/exams/:uuid`

Deletes an exam.

### Success response: `200 OK`

```json
{ "message": "Exam deleted successfully" }
```

### Errors

- `404`: `{ "message": "Exam not found" }`

## Tests

### POST `/api/admin/tests`

Creates a test linked to an existing exam.

### Request body

```json
{
  "title": "Algorithms Test 1",
  "examUuid": "exam-uuid"
}
```

The controller requires a non-empty string `title` and a string `examUuid`; the referenced exam must exist.

### Success response: `201 Created`

Returns the created test document.

### Errors

- `400`: `{ "message": "title and examUuid are required" }`
- `400`: `{ "message": "Exam not found" }`

> Implementation note: the `Tests` schema currently also marks `timeReq` as required, but the create controller does not read or pass `timeReq`. As a result, test creation may return `500` until that controller/schema mismatch is resolved.

### GET `/api/admin/tests`

Returns up to 100 tests.

### Success response: `200 OK`

Each returned test includes `uuid`, `examUuid`, `title`, `questions`, `isPublished`, `createdAt`, and `updatedAt`.

### PUT `/api/admin/tests/:uuid`

Updates a test's title and exam association.

### Request body

```json
{
  "title": "Updated test title",
  "examUuid": "exam-uuid"
}
```

### Success response: `200 OK`

Returns the updated test document.

### Errors

- `404`: `{ "message": "Test not found" }`

### DELETE `/api/admin/tests/:uuid`

Deletes a test.

### Success response: `200 OK`

```json
{ "message": "Test deleted successfully" }
```

### Errors

- `404`: `{ "message": "Test not found" }`

### PATCH `/api/admin/tests/:uuid/publish`

Sets `isPublished` to `true`.

### Success response: `200 OK`

Returns the updated test document.

### Errors

- `404`: `{ "message": "Test not found" }`

### PATCH `/api/admin/tests/:uuid/unpublish`

Sets `isPublished` to `false`.

### Success response: `200 OK`

Returns the updated test document.

### Errors

- `404`: `{ "message": "Test not found" }`

## Questions and Answers

### POST `/api/admin/questions`

Creates a question, attaches it to a test, and creates its answer record.

### Request body

```json
{
  "testUuid": "test-uuid",
  "questionText": "Which data structure uses FIFO ordering?",
  "options": ["Stack", "Queue", "Tree", "Graph"],
  "answer": "Queue",
  "optionNumber": 2
}
```

| Field | Type | Required | Rules |
|---|---|---:|---|
| `testUuid` | string | yes | Referenced test must exist. |
| `questionText` | string | yes | Must be a string. |
| `options` | array | yes | Must be a non-empty array. |
| `answer` | string | yes | Must be a string. |
| `optionNumber` | integer | yes | Must be an integer. |

### Success response: `201 Created`

Returns the created question document. The answer is stored separately and is not included in this response.

### Errors

- `400`: `{ "message": "testUuid, questionText, options, answer, and optionNumber are required" }`
- `400`: `{ "message": "Test not found" }`

### GET `/api/admin/questions`

Returns up to 100 questions.

### Success response: `200 OK`

Returns an array containing `uuid`, `testUuid`, `question`, `options`, `createdAt`, and `updatedAt`. Answer records are not returned.

### PUT `/api/admin/questions/:uuid`

Updates a question and its associated answer record.

### Request body

```json
{
  "questionText": "Which data structure uses FIFO ordering?",
  "options": ["Stack", "Queue", "Tree", "Graph"],
  "answer": "Queue",
  "optionNumber": 2
}
```

The controller updates the question's `question` and `options`, then updates the answer's `answer` and `optionNumber`.

### Success response: `200 OK`

Returns the updated question document. The answer record is not included.

### Errors

- `404`: `{ "message": "Question not found" }`

### DELETE `/api/admin/questions/:uuid`

Deletes a question, its answer record, and the question UUID from its parent test.

### Success response: `200 OK`

```json
{ "message": "Question and answer deleted successfully" }
```

### Errors

- `404`: `{ "message": "Question not found" }`
