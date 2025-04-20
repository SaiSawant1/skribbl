# Go parameters
BINARY_NAME=skribbl-server
MAIN_PATH=./cmd/main.go

.PHONY: all build clean run test coverage fmt lint help

all: build

build:
	go build -o $(BINARY_NAME) $(MAIN_PATH)

clean:
	go clean
	rm -f $(BINARY_NAME)

run:
	go run $(MAIN_PATH)

test:
	go test ./...

coverage:
	go test ./... -coverprofile=coverage.out
	go tool cover -html=coverage.out

fmt:
	go fmt ./...

lint:
	golangci-lint run

help:
	@echo "Make commands:"
	@echo "build    - Build the application"
	@echo "clean    - Clean build files"
	@echo "run      - Run the application"
	@echo "test     - Run tests"
	@echo "coverage - Generate test coverage report"
	@echo "fmt      - Format code"
	@echo "lint     - Run linter" 
