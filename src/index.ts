import {evTransMessage} from "./Lib/Message/evTransMessage";

const express = require("express");
import { Request, Response } from 'express';
import {MessageModel} from "./Lib/Message/MessageModel";
import {RabbitMQSender} from "./Lib/Message/RabbitMQSender";
const dotenv = require('dotenv');
const cors = require("cors");
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
const messageModel = new MessageModel();
const rabbitMQSender = new RabbitMQSender();
app.options("*", cors());
const port = Number(process.env.PORT || 3331);

app.get('/', (request: Request, response: Response):Response  => response.json({ answer: 42 }));
app.post('/mail/send', async (request: Request, response: Response) => {
	let status = 'success';
	let evMessage = new evTransMessage(request.body);
	try {
		const result = await messageModel.create(evMessage);
		evMessage.addMessageId(evMessage, result.insertId);
		await rabbitMQSender.queueMessage(evMessage);
	} catch (error) {
		console.log(error);
		status = 'error'
	}
	return response.json({evMessage, status});
})

app.listen(port, () => {
	console.log(`🚀 Server running on port ${port}!`)
});

module.exports = app;
