.PHONY: start-dev

start-dev:
	@echo "Starting development server..."
	@yarn install
	@yarn build
	@echo "Running database migrations..."
	@yarn migration:run
	@echo "Starting server..."
	@yarn run start:debug