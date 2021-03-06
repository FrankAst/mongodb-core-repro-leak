import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export default class DB {
  static mongoose = mongoose;
  static consoleErr = console.error;
  static consoleLog = console.log;
  static _connectionStr;

  static data = mongoose.createConnection();

  static init(connectionStr) {
    if (connectionStr) this._connectionStr = connectionStr;
    return Promise.all([DB.openDB('data')]);
  }

  static close() {
    return Promise.all([DB.closeDB('data')]);
  }

  static openDB(name = 'data') {
    return new Promise((resolve, reject) => {
      const uri = process.env.MONGO_CONNECTION_STRING || this._connectionStr;
      const opts = {};

      opts.promiseLibrary = global.Promise;
      opts.autoReconnect = true;
      opts.reconnectTries = Number.MAX_VALUE;
      opts.reconnectInterval = 1000;
      opts.useNewUrlParser = true;

      const db = DB[name];

      db.consoleErr = DB.consoleErr;
      db.consoleLog = DB.consoleLog;

      db.on('error', e => {
        if (e.message.code === 'ETIMEDOUT') {
          db.consoleErr(Date.now(), e);
          db.connect(
            uri,
            opts
          );
        }
        db.consoleErr(e);
      });

      db.once('open', () => {
        db.consoleLog(`Successfully connected to ${uri}`);
        resolve(db);
      });
      db.once('disconnected', () => {
        db.consoleLog(`Disconnected from ${uri}`);
        reject();
      });

      db.openUri(uri, opts);
    });
  }

  static closeDB(name = 'data') {
    // $FlowFixMe
    if (DB[name]) {
      return DB[name].close();
    }
    return Promise.resolve();
  }
}
