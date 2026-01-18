-- name: CreateUser :one
INSERT INTO users (email, name, password_hash)
VALUES ($1, $2, $3)
RETURNING id, email, name, password_hash, created_at;

-- name: GetUserByEmail :one
SELECT id, email, name, password_hash, created_at
FROM users
WHERE email = $1;

-- name: GetUserByID :one
SELECT id, email, name, password_hash, created_at
FROM users
WHERE id = $1;

-- name: ListUsersByIDs :many
SELECT id, email, name, password_hash, created_at
FROM users
WHERE id = ANY($1::text[]);

-- name: CreateSurvey :one
INSERT INTO surveys (title, description, questions, owner_id)
VALUES ($1, $2, $3, $4)
RETURNING id, title, description, questions, status, owner_id, created_at, updated_at;

-- name: GetSurveyByID :one
SELECT id, title, description, questions, status, owner_id, created_at, updated_at
FROM surveys
WHERE id = $1;

-- name: ListSurveysByOwner :many
SELECT id, title, description, questions, status, owner_id, created_at, updated_at
FROM surveys
WHERE owner_id = $1
ORDER BY created_at DESC;

-- name: UpdateSurveyStatus :one
UPDATE surveys
SET status = $2, updated_at = now()
WHERE id = $1 AND owner_id = $3
RETURNING id, title, description, questions, status, owner_id, created_at, updated_at;

-- name: CreateSurveyResponse :one
INSERT INTO survey_responses (survey_id, answers)
VALUES ($1, $2)
RETURNING id, survey_id, answers, created_at;

-- name: ListResponsesBySurvey :many
SELECT id, survey_id, answers, created_at
FROM survey_responses
WHERE survey_id = $1
ORDER BY created_at DESC;

