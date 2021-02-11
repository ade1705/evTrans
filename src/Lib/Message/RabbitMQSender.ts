import {evTransMessage} from "./evTransMessage";

const amqplib = require('amqplib');
const dotenv = require('dotenv');
dotenv.config();
const amqp_url = process.env.CLOUDAMQP_URL;

export class RabbitMQSender {
	queueMessage = async (evMessage: evTransMessage) => {
		const conn = await amqplib.connect(amqp_url);
		const ch = await conn.createChannel()
		const exchange = process.env.RABBITMQ_EXHANGE;
		const queue = process.env.RABBITMQ_QUEUE;
		await ch.assertExchange(exchange, 'direct', {durable: true}).catch(console.error);
		await ch.assertQueue(queue, {durable: true});
		await ch.sendToQueue(queue, Buffer.from(JSON.stringify(evMessage)));
		setTimeout( function()  {
			ch.close();
			conn.close();},  500 );
	}
}
