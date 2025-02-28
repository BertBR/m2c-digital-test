## M2C Digital - Test

This is a test for M2C Digital Company for a Senior Software Engineer role.

### About
Please read the `test-requirements.pdf` file to know everything about it.

### How to run
- Ensure you have docker installed on your computer
- Clone the project
```
git clone git@github.com:BertBR/m2c-digital-test.git
cd m2c-digital-test
```
- Run it with: `make` command in project **root** directory

### ENV Table

|NAME|VALUE|DESCRIPTION|
|---|---|---|
|RABBITMQ_URL|amqp://guest:guest@rabbitmq:5672/|RabbitMQ URI (DSN)
|QUEUE_NAME|sms_queue| Queue name
|MONGODB_URI|mongodb://mongo:mongo@mongo_db:27017| MongoDB URI
|MONGODB_DB_NAME|m2c_db| Mongo database name
|MAX_MESSAGES_COUNT|3| Max messages count

### API Docs
- After start NestJS API, you can find all related information trought address http://localhost:8080/doc with credentials (admin:topsecret)

### Container Logs and Info
- Check `Makefile` in the project root to know how to inspect container logs

### How to Use
- Access [Login Route on Swagger](http://localhost:8080/doc/#/auth/AuthController_login)
- Log-In with default Admin user
- Then, go to the [Create Campaign Route](http://localhost:8080/doc/#/campaign/CampaignController_create) to create a fake campaign and send messages to the consumers