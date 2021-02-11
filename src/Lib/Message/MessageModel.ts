import {evTransMessage} from "./evTransMessage";
const mysql2 = require('mysql2');
const query = require('../../../db/db-connection');

export class MessageModel {
	tableName = 'messages';

	find = async (params = {}) => {
		let sql = `SELECT * FROM ${this.tableName}`;
		return await query(sql);
	}

	create = async (evTransMessage: evTransMessage) => {
		let sql = `INSERT INTO ${this.tableName} (message_payload) VALUES ("${mysql2.escape(JSON.stringify(evTransMessage))}")`;
		return await query(sql);
	}
}
