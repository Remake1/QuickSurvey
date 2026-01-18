package graph

import (
	"context"
	"errors"

	"github.com/remake1/quicksurvey/api/graph/model"
	"github.com/remake1/quicksurvey/api/internal/domain"
	httpadapter "github.com/remake1/quicksurvey/api/internal/http"
)

func requireUserID(ctx context.Context) (string, error) {
	userID, ok := httpadapter.UserIDFromContext(ctx)
	if !ok {
		return "", graphError(domain.ErrUnauthenticated)
	}
	return userID, nil
}

func graphError(err error) error {
	switch {
	case errors.Is(err, domain.ErrInvalidCredentials):
		return errors.New("Invalid email or password")
	case errors.Is(err, domain.ErrUnauthenticated):
		return errors.New("Authentication required")
	case errors.Is(err, domain.ErrForbidden):
		return errors.New("Not authorized")
	case errors.Is(err, domain.ErrNotFound):
		return errors.New("Not found")
	case errors.Is(err, domain.ErrConflict):
		return errors.New("Already exists")
	case errors.Is(err, domain.ErrInvalidInput):
		return errors.New("Invalid input")
	default:
		return err
	}
}

func graphUser(user *domain.User) *model.User {
	if user == nil {
		return nil
	}
	return &model.User{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		CreatedAt: user.CreatedAt,
	}
}

func graphSurvey(survey *domain.Survey) *model.Survey {
	if survey == nil {
		return nil
	}
	return &model.Survey{
		ID:          survey.ID,
		Title:       survey.Title,
		Description: survey.Description,
		Questions:   graphQuestions(survey.Questions),
		Status:      model.SurveyStatus(survey.Status),
		Owner:       &model.User{ID: survey.OwnerID},
		CreatedAt:   survey.CreatedAt,
		UpdatedAt:   survey.UpdatedAt,
	}
}

func graphSurveys(surveys []*domain.Survey) []*model.Survey {
	out := make([]*model.Survey, 0, len(surveys))
	for _, survey := range surveys {
		out = append(out, graphSurvey(survey))
	}
	return out
}

func graphQuestions(questions []domain.Question) []model.Question {
	out := make([]model.Question, 0, len(questions))
	for _, question := range questions {
		switch question.Type {
		case domain.QuestionTypeMultipleChoice, domain.QuestionTypeCheckboxes, domain.QuestionTypeDropdown:
			out = append(out, &model.OptionsQuestion{
				ID:       question.ID,
				Title:    question.Title,
				Required: question.Required,
				Type:     model.QuestionType(question.Type),
				Options:  graphOptions(question.Options),
			})
		case domain.QuestionTypeDate:
			out = append(out, &model.DateQuestion{
				ID:       question.ID,
				Title:    question.Title,
				Required: question.Required,
				Type:     model.QuestionType(question.Type),
			})
		case domain.QuestionTypeLinearScale:
			min, max := 1, 5
			if question.Min != nil {
				min = *question.Min
			}
			if question.Max != nil {
				max = *question.Max
			}
			out = append(out, &model.ScaleQuestion{
				ID:       question.ID,
				Title:    question.Title,
				Required: question.Required,
				Type:     model.QuestionType(question.Type),
				Min:      min,
				Max:      max,
				MinLabel: question.MinLabel,
				MaxLabel: question.MaxLabel,
			})
		default:
			out = append(out, &model.TextQuestion{
				ID:       question.ID,
				Title:    question.Title,
				Required: question.Required,
				Type:     model.QuestionType(question.Type),
			})
		}
	}
	return out
}

func graphOptions(options []domain.Option) []*model.Option {
	out := make([]*model.Option, 0, len(options))
	for _, option := range options {
		out = append(out, &model.Option{ID: option.ID, Text: option.Text})
	}
	return out
}

func graphSurveyResponse(response *domain.SurveyResponse) *model.SurveyResponse {
	if response == nil {
		return nil
	}
	return &model.SurveyResponse{
		ID:        response.ID,
		SurveyID:  response.SurveyID,
		Answers:   graphAnswers(response.Answers),
		CreatedAt: response.CreatedAt,
	}
}

func graphSurveyResponses(responses []*domain.SurveyResponse) []*model.SurveyResponse {
	out := make([]*model.SurveyResponse, 0, len(responses))
	for _, response := range responses {
		out = append(out, graphSurveyResponse(response))
	}
	return out
}

func graphAnswers(answers []domain.Answer) []*model.Answer {
	out := make([]*model.Answer, 0, len(answers))
	for _, answer := range answers {
		out = append(out, &model.Answer{
			QuestionID:     answer.QuestionID,
			Type:           model.QuestionType(answer.Type),
			TextValue:      answer.TextValue,
			ChoiceValue:    answer.ChoiceValue,
			CheckboxValues: answer.CheckboxValues,
			DateValue:      answer.DateValue,
			ScaleValue:     answer.ScaleValue,
		})
	}
	return out
}

func domainQuestions(inputs []*model.QuestionInput) []domain.Question {
	out := make([]domain.Question, 0, len(inputs))
	for _, input := range inputs {
		if input == nil {
			continue
		}
		required := false
		if input.Required != nil {
			required = *input.Required
		}
		question := domain.Question{
			Title:    input.Title,
			Required: required,
			Type:     domain.QuestionType(input.Type),
			Options:  domainOptions(input.Options),
			Min:      input.Min,
			Max:      input.Max,
			MinLabel: input.MinLabel,
			MaxLabel: input.MaxLabel,
		}
		if input.ID != nil {
			question.ID = *input.ID
		}
		out = append(out, question)
	}
	return out
}

func domainOptions(inputs []*model.OptionInput) []domain.Option {
	out := make([]domain.Option, 0, len(inputs))
	for _, input := range inputs {
		if input == nil {
			continue
		}
		option := domain.Option{Text: input.Text}
		if input.ID != nil {
			option.ID = *input.ID
		}
		out = append(out, option)
	}
	return out
}

func domainAnswers(inputs []*model.AnswerInput) []domain.Answer {
	out := make([]domain.Answer, 0, len(inputs))
	for _, input := range inputs {
		if input == nil {
			continue
		}
		out = append(out, domain.Answer{
			QuestionID:     input.QuestionID,
			Type:           domain.QuestionType(input.Type),
			TextValue:      input.TextValue,
			ChoiceValue:    input.ChoiceValue,
			CheckboxValues: input.CheckboxValues,
			DateValue:      input.DateValue,
			ScaleValue:     input.ScaleValue,
		})
	}
	return out
}
