package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/nrednav/cuid2"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MessageWrapper struct {
	Pattern string  `json:"pattern"`
	Data    Message `json:"data"`
}

type Message struct {
	Identifier  string    `json:"identifier" bson:"identifier"`
	PhoneNumber string    `json:"phone_number" bson:"phone_number"`
	Message     string    `json:"message" bson:"message"`
	CampaignID  string    `json:"campaign_id" bson:"campaign_id"`
	CreatedAt   time.Time `json:"created_at" bson:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" bson:"updated_at"`
	Deleted     bool      `json:"deleted" bson:"deleted"`
}

func main() {
	mongoURI := getEnv("MONGODB_URI", "mongodb://localhost:27017")
	dbName := getEnv("MONGODB_DB_NAME", "m2c_db")
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			log.Fatalf("Failed to disconnect from MongoDB: %v", err)
		}
	}()

	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}
	fmt.Println("Connected to MongoDB")

	collection := client.Database(dbName).Collection("messages")
	rabbitMQURL := getEnv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
	conn, err := amqp.Dial(rabbitMQURL)
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer conn.Close()

	channel, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %v", err)
	}
	defer channel.Close()

	queueName := getEnv("QUEUE_NAME", "default-queue")
	_, err = channel.QueueDeclare(
		queueName, // name
		true,      // durable
		false,     // delete when unused
		false,     // exclusive
		false,     // no-wait
		nil,       // arguments
	)
	if err != nil {
		log.Fatalf("Failed to declare a queue: %v", err)
	}

	fmt.Printf("[*] Waiting for messages in %s. To exit press CTRL+C\n", queueName)

	msgs, err := channel.Consume(
		queueName, // queue
		"",        // consumer
		false,     // auto-ack (set to false to manually acknowledge)
		false,     // exclusive
		false,     // no-local
		false,     // no-wait
		nil,       // args
	)
	if err != nil {
		log.Fatalf("Failed to register a consumer: %v", err)
	}

	for msg := range msgs {
		go func(msg amqp.Delivery) {
			defer func() {
				if r := recover(); r != nil {
					log.Printf("Recovered from panic: %v", r)
				}
			}()

			fmt.Printf("[x] Received Body: %s\n", msg.Body)

			var wrapper MessageWrapper
			if err := json.Unmarshal(msg.Body, &wrapper); err != nil {
				log.Printf("Failed to parse message: %v", err)
				msg.Nack(false, true)
				return
			}

			data := wrapper.Data
			fmt.Printf("[x] Parsed Message: %+v\n", wrapper)

			newMessage := Message{
				Identifier:  cuid2.Generate(),
				PhoneNumber: data.PhoneNumber,
				Message:     data.Message,
				CampaignID:  data.CampaignID,
				CreatedAt:   time.Now(),
				UpdatedAt:   time.Now(),
				Deleted:     false,
			}

			fmt.Printf("[x] Saving message to MongoDB: %+v\n", newMessage)

			_, err := collection.InsertOne(context.TODO(), newMessage)
			if err != nil {
				log.Printf("Failed to save message to MongoDB: %v", err)
				msg.Nack(false, true)
				return
			}

			fmt.Printf("[x] Message saved to MongoDB with ID: %s\n", newMessage.Identifier)
			msg.Ack(false)
		}(msg)
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
