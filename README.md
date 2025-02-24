## M2C Digital - Test

This is a test for M2C Digital Company for a Senior Software Engineer role.

### About
Please read the `test-requirements.pdf` file to know everything about it.

### How to run
- Ensure you have docker installed on your computer
- Clone the project
```

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