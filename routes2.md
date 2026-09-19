# User Routes

This document describes the user routes, which are authenticated endpoints for general users.

## Base URL

```text
/api/users
```

## Authentication

Every route under `/api/users` is protected and requires a valid user token:

```http
Authorization: Bearer <jwt>
Content-Type: application/json
```

The token must be valid, not expired or revoked, and belong to an active user. Missing or invalid authentication returns `401`; a suspended or inactive user returns `403`.

---

## Exams and Tests

### GET `/api/users/exams`

Returns a list of exams (up to 100).

### Success response: `200 OK`

```json
[
  {
    "uuid": "exam-uuid",
    "title": "Computer Science Entrance Exam",
    "description": "Core computer science assessment",
    "createdAt": "2026-09-18T10:00:00.000Z",
    "updatedAt": "2026-09-18T10:00:00.000Z"
  }
]
```

### GET `/api/users/tests`

Returns a list of tests (up to 100).

### Success response: `200 OK`

```json
[
  {
    "uuid": "test-uuid",
    "examUuid": "exam-uuid",
    "title": "Algorithms Test 1",
    "questions": ["question-uuid-1", "question-uuid-2"],
    "isPublished": true,
    "createdAt": "2026-09-18T10:00:00.000Z",
    "updatedAt": "2026-09-18T10:00:00.000Z"
  }
]
```

---

## Test Sessions

### POST `/api/users/test-sessions`

Starts a new test session for a specific test. The test must exist, be published, and have a valid time requirement.

### Request body

```json
{
  "testId": "test-uuid"
}
```

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `testId` | string | yes | Must not be empty. |

### Success response: `201 Created`

```json
{
  "message": "Test session started successfully",
  "sessionId": "session-uuid",
  "startedAt": "2026-09-18T10:00:00.000Z",
  "expiresAt": "2026-09-18T11:00:00.000Z",
  "duration": 60,
  "questions": [
    {
      "questionId": "question-uuid",
      "question": "Which data structure uses FIFO ordering?",
      "options": ["Stack", "Queue", "Tree", "Graph"]
    }
  ]
}
```

### Errors

- `400`: `{ "message": "testId is required" }`
- `403`: `{ "message": "Test is not published" }`
- `404`: `{ "message": "Test not found" }`
- `409`: `{ "message": "An active session already exists for this test" }`
- `500`: `{ "message": "Test has an invalid time requirement" }` or `{ "message": "Test snapshot could not be generated" }`

### GET `/api/users/test-sessions/:sessionId`

Returns the details of an existing test session. If the session is `in-progress` but has passed its expiration time, it will automatically be finalized.

### Path parameter

| Parameter | Type | Required |
|---|---|---:|
| `sessionId` | string | yes |

### Success response: `200 OK`

```json
{
  "sessionId": "session-uuid",
  "testId": "test-uuid",
  "status": "in-progress",
  "startedAt": "2026-09-18T10:00:00.000Z",
  "expiresAt": "2026-09-18T11:00:00.000Z",
  "submittedAt": "2026-09-18T10:55:00.000Z",
  "expiredAt": null,
  "duration": 60,
  "questions": [
    {
      "questionId": "question-uuid",
      "question": "Which data structure uses FIFO ordering?",
      "options": ["Stack", "Queue", "Tree", "Graph"]
    }
  ],
  "answers": [
    {
      "questionId": "question-uuid",
      "selectedOption": 1,
      "timeSpentSeconds": 15,
      "answeredAt": "2026-09-18T10:01:15.000Z"
    }
  ]
}
```

### Errors

- `404`: `{ "message": "Session not found" }`

### PATCH `/api/users/test-sessions/:sessionId/answers`

Saves or updates an answer for a specific question in an active test session.

### Request body

```json
{
  "questionId": "question-uuid",
  "selectedOption": 1,
  "timeSpentSeconds": 15
}
```

### Fields

| Field | Type | Required | Rules |
|---|---|---:|---|
| `questionId` | string | yes | Must belong to this test session. |
| `selectedOption` | integer | yes | Must be a non-negative integer and within valid option range. |
| `timeSpentSeconds` | number | no | Defaults to 0. Must be a non-negative number. |

### Success response: `200 OK`

```json
{
  "message": "Answer saved successfully",
  "sessionId": "session-uuid",
  "questionId": "question-uuid"
}
```

### Errors

- `400`: `{ "message": "questionId is required" }`
- `400`: `{ "message": "selectedOption must be a non-negative integer" }`
- `400`: `{ "message": "timeSpentSeconds must be a non-negative number" }`
- `400`: `{ "message": "Question does not belong to this test session" }`
- `400`: `{ "message": "selectedOption must be between 0 and X" }`
- `404`: `{ "message": "Session not found" }`
- `409`: `{ "message": "Session is already <status>" }`
- `409`: `{ "message": "Session has expired" }`
- `409`: `{ "message": "Session is no longer in-progress" }`

### POST `/api/users/test-sessions/:sessionId/submit`

Submits the test session. An optional final answer can be provided in the request body to be saved before submission. If the session has already expired, it will be finalized with status `expired`.

### Request body (Optional)

```json
{
  "questionId": "question-uuid",
  "selectedOption": 1,
  "timeSpentSeconds": 15
}
```

### Success response: `200 OK`

```json
{
  "message": "Test submitted successfully",
  "sessionId": "session-uuid",
  "status": "submitted"
}
```

### Errors

- `404`: `{ "message": "Session not found" }`
- `409`: `{ "message": "Session cannot be submitted from status: <status>" }`
- `409`: `{ "message": "Failed to submit test, session state changed" }`

### GET `/api/users/test-sessions/:sessionId/result`

Returns the summary result of a finalized (submitted or expired) session. Answer keys are not exposed.

### Path parameter

| Parameter | Type | Required |
|---|---|---:|
| `sessionId` | string | yes |

### Success response: `200 OK`

```json
{
  "sessionId": "session-uuid",
  "testId": "test-uuid",
  "status": "submitted",
  "result": {
    "totalScore": 8,
    "percentage": 80,
    "correctAnswers": 8,
    "wrongAnswers": 2,
    "unansweredQuestions": 0,
    "attemptedQuestions": 10
  }
}
```

### Errors

- `403`: `{ "message": "Cannot view result of an in-progress test" }`
- `403`: `{ "message": "Cannot view result of an abandoned test" }`
- `404`: `{ "message": "Session not found" }`
