import {Recipient, Recipients} from "./Recipient";

export class evTransMessage {
	html: string = '';
	text: string = '';
	subject: string = '';
	messageId: number = 0;
	from: Recipient = {
		email: '',
		name: '',
	}
	to: Recipients = [
		{
			email: '',
			name: '',
		}
	]

	constructor(requestBody: any) {
		this.createFromRequestBody(requestBody)
	}

	createFromRequestBody(requestBody: any) {
		const {body, headers} = requestBody;
		this.html = body.html;
		this.text = body.text;
		this.subject = headers.subject;
		this.getFrom(headers);
		this.getTo(headers);
	}

	addMessageId(evMessage: evTransMessage, messageId: number) {
		evMessage.messageId = messageId;
	}

	private getFrom(headers: any): void {
		let from: any = Object.entries(headers.from)[0] ?? ['', '']
		this.from.email = from[0] ?? '';
		this.from.name = from[1] ?? '';
	}

	private getTo(headers: any): void {
		let to: any = Object.entries(headers.to);
		to.forEach((singleTo: any) => {
			let recipient: Recipient = {
				name: singleTo[0] ?? '',
				email: singleTo[1] ?? '',
			}
			this.to.push(recipient)
		})
	}
}

