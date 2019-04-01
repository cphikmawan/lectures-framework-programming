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
            db.users.find({
                username: {$eq: username}, password: {$eq: password}
            }).$.subscribe(users => {
                users.every(user => {
                    if(user.username === username && user.password === password) {
                        db.logs.insertLog(username, 'Login Berhasil');
                        res.redirect("/home");
                    }
                });
            });
        } catch(e) {
            Log.error(e);
        }
    }
    // res.redirect("/home");
    // res.end();
});

server.get('/home',function(req,res){
    res.sendFile(path.join(__dirname + '/src/yes.html'));
})

server.get('/gagal/:id', async function(req,res){
    var username = req.params.id;
    const db = await Database.get();
    db.logs.insertLog(username, 'Login Gagal');
    res.sendFile(path.join(__dirname + '/src/status.html'));
})

server.listen(9000, function(){
    console.log('Server Run!');
});