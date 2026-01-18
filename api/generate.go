package api

//go:generate go run github.com/sqlc-dev/sqlc/cmd/sqlc generate
//go:generate go run github.com/99designs/gqlgen generate
//go:generate sh -c "cd internal/infrastructure/dataloader && go run github.com/vektah/dataloaden UserLoader string '*User'"
