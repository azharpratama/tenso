.PHONY: install start dev clean docker-up docker-down

install:
	cd web && npm install
	cd forwarder && npm install

start:
	@echo "Starting Tenso (Manual Mode)..."
	@echo "Open two terminals:"
	@echo "1. make start-forwarder"
	@echo "2. make start-web"

start-forwarder:
	cd forwarder && npm start

start-web:
	cd web && npm run dev

docker-up:
	docker-compose up --build -d

docker-down:
	docker-compose down

clean:
	rm -rf web/.next
	rm -rf web/node_modules
	rm -rf forwarder/node_modules
	rm -rf forwarder/dist
