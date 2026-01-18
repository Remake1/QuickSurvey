package domain

import (
	"errors"
	"time"
)

type SurveyStatus string

const (
	SurveyStatusDraft     SurveyStatus = "DRAFT"
	SurveyStatusPublished SurveyStatus = "PUBLISHED"
)

type QuestionType string

const (
	QuestionTypeShortAnswer    QuestionType = "short_answer"
	QuestionTypeParagraph      QuestionType = "paragraph"
	QuestionTypeMultipleChoice QuestionType = "multiple_choice"
	QuestionTypeCheckboxes     QuestionType = "checkboxes"
	QuestionTypeDropdown       QuestionType = "dropdown"
	QuestionTypeDate           QuestionType = "date"
	QuestionTypeLinearScale    QuestionType = "linear_scale"
)

var (
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUnauthenticated    = errors.New("authentication required")
	ErrForbidden          = errors.New("not authorized")
	ErrNotFound           = errors.New("not found")
	ErrConflict           = errors.New("already exists")
	ErrInvalidInput       = errors.New("invalid input")
)

type User struct {
	ID           string
	Email        string
	Name         *string
	PasswordHash string
	CreatedAt    time.Time
}

type Option struct {
	ID   string `json:"id"`
	Text string `json:"text"`
}

type Question struct {
	ID       string       `json:"id"`
	Title    string       `json:"title"`
	Required bool         `json:"required"`
	Type     QuestionType `json:"type"`
	Options  []Option     `json:"options,omitempty"`
	Min      *int         `json:"min,omitempty"`
	Max      *int         `json:"max,omitempty"`
	MinLabel *string      `json:"minLabel,omitempty"`
	MaxLabel *string      `json:"maxLabel,omitempty"`
}

type Answer struct {
	QuestionID     string       `json:"questionId"`
	Type           QuestionType `json:"type"`
	TextValue      *string      `json:"textValue,omitempty"`
	ChoiceValue    *string      `json:"choiceValue,omitempty"`
	CheckboxValues []string     `json:"checkboxValues,omitempty"`
	DateValue      *string      `json:"dateValue,omitempty"`
	ScaleValue     *int         `json:"scaleValue,omitempty"`
}

type Survey struct {
	ID          string
	Title       string
	Description *string
	Questions   []Question
	Status      SurveyStatus
	OwnerID     string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type SurveyResponse struct {
	ID        string
	SurveyID  string
	Answers   []Answer
	CreatedAt time.Time
}
