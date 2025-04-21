# Go parameters
BINARY_NAME=skribbl-server
MAIN_PATH=./cmd/main.go
COVERAGE_DIR=coverage

.PHONY: all build clean run test test-cover test-race fmt lint help

all: build

build:
	go build -o $(BINARY_NAME) $(MAIN_PATH)

clean:
	go clean
	rm -f $(BINARY_NAME)
	rm -rf $(COVERAGE_DIR)

run:
	go run $(MAIN_PATH)

test:
	go test -v ./...

test-cover:
	mkdir -p $(COVERAGE_DIR)
	go test -coverprofile=$(COVERAGE_DIR)/coverage.out ./...
	go tool cover -html=$(COVERAGE_DIR)/coverage.out -o $(COVERAGE_DIR)/coverage.html

test-race:
	go test -race ./...

fmt:
	go fmt ./...

lint:
	golangci-lint run

help:
	@echo "Make commands:"
	@echo "build        - Build the application"
	@echo "clean        - Clean build files and coverage reports"
	@echo "run          - Run the application"
	@echo "test         - Run tests with verbose output"
	@echo "test-cover   - Run tests with coverage report"
	@echo "test-race    - Run tests with race detector"
	@echo "fmt          - Format code"
	@echo "lint         - Run linter" 
