require('babel-polyfill');
var RxDB = require('rxdb');
RxDB.plugin(require('pouchdb-adapter-node-websql'));
RxDB.plugin(require('pouchdb-adapter-http'));

const Database = {};

const userSchema = {
    title: 'users schema',
    description: 'all users data here',
    version: 0,
    type: 'object',
    properties: {
        username: {
            type: 'string',
        },
        password: {
            type: 'string'
        }
    },
};

const logsSchema = {
    title: 'users schema',
    description: 'all users data here',
    version: 0,
    type: 'object',
    properties: {
        username: {
            type: 'string',
        },
        message: {
            type: 'string'
        }
    },
};

const SYNC_URL = 'http://admin:admin@10.151.36.19:5984/';

const create = async () => {
    const database = await RxDB
        .create({
            name: 'putanginamo',
            adapter: 'websql',
            password: '',
            multiInstance: true
        });
    await database.collection({
        name: 'users',
        schema: userSchema,
        statics: {
            async register(username, password) {
                return this.insert({
                    username,
                    password
                });
            },
        }
    });
    database.collections.users.sync({
        remote: SYNC_URL + 'users/'
    });

    await database.collection({
        name: 'logs',
        schema: logsSchema,
        statics: {
            async insertLog(username, message) {
                return this.insert({
                    username,
                    message
                });
            },
        }
    });
    database.collections.logs.sync({
        remote: SYNC_URL + 'logs/'
    });
    return database;
};

let createPromise = null;
Database.get = async () => {
    if (!createPromise) createPromise = create();
    return createPromise;
};

module.exports = Database;