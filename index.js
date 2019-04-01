require('babel-polyfill');
const Database = require('./database');
const Log = require('./log');
var RxDB = require('rxdb');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser')
var server = express();
var path = require('path');

server.use(express.static(__dirname+'/public'));
server.use(bodyParser.urlencoded({extended : true}));
server.use(bodyParser.json());

server.use(session({
    secret : 'pbkk',
    resave : true,
    saveUninitialized : true
}));

server.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/src/login.html'));
});

server.get('/register',function(req,res){
    res.sendFile(path.join(__dirname + '/src/register.html'));
});

server.post('/daftar', async function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    if (username && password){
        const db = await Database.get();
        db.users.register(username, password);
    }
    res.redirect('/')
    res.end();
});

server.post('/login', async function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    if (username && password){
        try {
            const db = await Database.get();
            const users = await db.users.findOne({ username: {$eq: username}, password: {$eq: password}}).exec();
            // console.error(users.get('username'));
            if (!users) {
                // console.error('users not found');
                db.logs.insertLog(username, 'Login Gagal Bosq');
                return res.redirect("/status");
            } else {
                db.logs.insertLog(username, 'Login Sukses Bosq');
                return res.redirect("/home");
            }
        } catch(e) {
            Log.error(e);
        }
    }
});

server.get('/home',function(req,res){
    res.sendFile(path.join(__dirname + '/src/yes.html'));
})

server.get('/status', function(req,res){
    res.sendFile(path.join(__dirname + '/src/status.html'));
})

server.listen(9000, function(){
    console.log('Server Run!');
});