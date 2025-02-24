import { createId } from '@paralleldrive/cuid2';
import * as amqp from 'amqplib';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/messageDB';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'messageDB';

const messageSchema = new mongoose.Schema({
  identifier: { type: String, required: true, default: () => createId() },
  phone_number: { type: String, required: true },
  message: { type: String, required: true },
  campaign_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

const MessageModel = mongoose.model('Message', messageSchema);

async function consumeMessages() {
  const queue = process.env.QUEUE_NAME || 'default-queue';
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });

  console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const messageContent = msg.content.toString();
        console.log(`[x] Received ${messageContent}`);
        const { campaign_id, phone_number, message } = JSON.parse(messageContent).data;
        const receivedMessage = {
            phone_number,
            message,
            campaign_id
        };
        const newMessage = new MessageModel(receivedMessage);
        await newMessage.save();

        console.log(`[x] Message saved to MongoDB with ID: ${newMessage.identifier}`);
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg);
      }
    }
  }, {
    noAck: false,
  });
}

async function start() {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI, {dbName: MONGODB_DB_NAME});
    console.log('Connected to MongoDB');
    await consumeMessages();
  } catch (error) {
    console.error('Failed to start consumer:', error);
    process.exit(1);
  }
}

start();