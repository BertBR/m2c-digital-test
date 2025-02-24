.PHONY: dev log-api clean-api remove-all

dev:
	docker-compose up -d --build
	make log-nodejs-consumer

log-api:
	docker logs -f api

log-nodejs-consumer:
	docker logs -f nodejs-consumer

log-golang-consumer:
	docker logs -f golang-consumer

clean-api:
	docker rm -f api

remove-all:
	docker rm -f $$(docker ps -a -q)