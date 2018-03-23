/**
 * Created by Дмитрий on 05.05.2017
 */
const mysql = require('mysql2/promise');

class Mysql {

  constructor() {
    this.slowQueryLogMs = 3 * 1000;
  }

  async connect(config) {
    this.connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      flags: config.flags,
      //socketPath  : '/var/lib/mysql/mysql.sock'
    });
  }

  async query(query, values, options = {}) {
    if (!this.connection) {
      throw new Error('mysql connection error');
    }
    let startTime = Date.now();
    let [rows, fields] = await this.connection.query(query, values);
    if (Date.now() - startTime >= this.slowQueryLogMs) {
      console.error('time error', query, values, new Date(startTime).toLocaleString(), ' - ', new Date().toLocaleString());
    }
    if (options.limit === 1) {
      return rows[0] || null;
    } else {
      return rows;
    }
  }

  async queryOne(query, values, options = {}) {
    options.limit = 1;
    return await this.query(query, values, options);
  }
}

module.exports = new Mysql();
