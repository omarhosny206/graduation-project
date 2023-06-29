import client, { Channel, Connection } from 'amqplib';
import * as dotenv from 'dotenv';

import ApiError from '../utils/api-error';

dotenv.config();

const RABBITMQ_EXCHANGE_NAME: string = process.env.RABBITMQ_EXCHANGE_NAME!!;
const RABBITMQ_EXCHANGE_TYPE: string = process.env.RABBITMQ_EXCHANGE_TYPE!!;
const RABBITMQ_QUEUE_NAME: string = process.env.RABBITMQ_QUEUE_NAME!!;
const RABBITMQ_BINDING_KEY: string = process.env.RABBITMQ_BINDING_KEY!!;
const RABBITMQ_ROUTING_KEY: string = process.env.RABBITMQ_ROUTING_KEY!!;
const RABBITMQ_CONNECTION_URL_EC2 = process.env.RABBITMQ_CONNECTION_URL_EC2!!;
const RABBITMQ_CONNECTION_URL_MQ = process.env.RABBITMQ_CONNECTION_URL_MQ!!;

async function connect() {
  try {
    const connection: Connection = await client.connect(RABBITMQ_CONNECTION_URL_MQ);

    const channel: Channel = await connection.createChannel();

    await channel.assertExchange(RABBITMQ_EXCHANGE_NAME, RABBITMQ_EXCHANGE_TYPE);
    await channel.assertQueue(RABBITMQ_QUEUE_NAME, { durable: true });
    await channel.bindQueue(RABBITMQ_QUEUE_NAME, RABBITMQ_EXCHANGE_NAME, RABBITMQ_BINDING_KEY);

    return channel;
  } catch (error) {
    throw ApiError.from(error);
  }
}

export async function publish(message: any) {
  try {
    const channel: Channel = await connect();

    const messageIsSent = channel.publish(
      RABBITMQ_EXCHANGE_NAME,
      RABBITMQ_ROUTING_KEY,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    if (messageIsSent) {
      console.log('Message Sent');
    } else {
      console.log('Message Not Sent');
    }
  } catch (error) {
    throw ApiError.from(error);
  }
}
