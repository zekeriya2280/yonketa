//const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
var mongoDBPeopleUrl = 'mongodb://127.0.0.1:27017/newPeople';
const express = require('express')
var http = require('http').createServer(express);
const path = require('path')
const Profile = require('./models/Profile')
const PORT = process.env.PORT // || 9000
const PORT2 = process.env.PORT // || 9001
const { Pool } = require('pg');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const name = "";
const email = "";
const password = "";
const store = require('data-store')({ path: process.cwd() + '/foo.json' });
var users = [];
var connections = new Set();
var counter;
counter = store.get('counter');
if (counter == null) {
    counter = 1;
    store.set('counter', 1);
}
console.log(store.get('counter'));
var peopleJson = [100];
var rannumjson = [];
peopleJson[0] = {
    "name": "zek",
    "email": "zekeriyacoskun2280@gmail.com",
    "password": "zeki_1234"
};
var profilesjson = {};
var rannums = {};
var currUser = {};

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});
express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    //.get('/times', (req, res) => res.send(showTimes()))
    //.get('/cool', (req, res) => res.send(cool()))
    .get('/chat', (req, res) => {
        MongoClient.connect(mongoDBPeopleUrl, function(err, db) {
            if (err) throw err;
            db.collection("person").insertOne(peopleJson[counter], function(err, res) {
                if (err) throw err;
                console.log("Document inserted");
            });
            db.close();
        });
    })
    .post('/people', urlencodedParser, function(req, res) {

        profilesjson = {
                "name": req.body.name,
                "email": req.body.email,
                "password": req.body.password,
            },
            peopleJson[counter] = profilesjson;

        //console.log(store.get('counter'));
        store.set('counter', store.get('counter') + 1);
        res.end(JSON.stringify(peopleJson));
    })
    .get('/people', (req, res) => {
        //store.del('counter');
        //console.log(store.get('counter'));
        MongoClient.connect(mongoDBPeopleUrl, function(err, db) {
            if (err) throw err;
            console.log("Switched to " + db.databaseName + " database");

            db.collection("person").find({}).toArray(function(err, data) {
                if (err) throw err;
                res.json(data);
            });
        });
    })
    .get('/currentUser', (req, res) => {
        //store.del('counter');
        //console.log(store.get('counter'));
        MongoClient.connect(mongoDBPeopleUrl, function(err, db) {
            if (err) throw err;
            console.log("Switched to " + db.databaseName + " database");

            db.collection("currentUser").find({}).toArray(function(err, data) {
                if (err) throw err;
                res.json(data);
            });
        });
    })
    .post('/currentUser', urlencodedParser, (req, res) => {
        //store.del('counter');
        console.log("currentUser: " + req.body.currentUser);
        currUser = {
                "currentUser": req.body.currentUser
            },
            //rannumjson.push(rannums);


            MongoClient.connect(mongoDBPeopleUrl, function(err, db) {
                if (err) throw err;
                console.log("Switched to " + db.databaseName + " database");

                db.collection("currentUser").update({}, currUser);
            });
        console.log("Document inserted");
        res.end(JSON.stringify(currUser));
    })
    .get('/randomyonketas', (req, res) => {
        //store.del('counter');
        //console.log(store.get('counter'));
        MongoClient.connect(mongoDBPeopleUrl, function(err, db) {
            if (err) throw err;
            console.log("Switched to " + db.databaseName + " database");

            db.collection("randomyonketas").find({}).toArray(function(err, data) {
                if (err) throw err;
                res.json(data);
            });
        });
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

express()

.get('/randomyonketas', (req, res) => {
        //store.del('counter');
        //console.log(store.get('counter'));
        MongoClient.connect(mongoDBPeopleUrl, function(err, db) {
            if (err) throw err;
            console.log("Switched to " + db.databaseName + " database");

            db.collection("randomyonketas").find({}).toArray(function(err, data) {
                if (err) throw err;
                res.json(data);
            });
        });
    })
    .post('/randomyonketas', urlencodedParser, (req, res) => {
        //store.del('counter');
        console.log(req.body.id);
        rannums = {
                "id": req.body.id,
                "number": req.body.number,
            },
            rannumjson.push(rannums);


        MongoClient.connect(mongoDBPeopleUrl, function(err, db) {
            if (err) throw err;
            console.log("Switched to " + db.databaseName + " database");

            db.collection("randomyonketas").insertOne(rannumjson[rannumjson.length - 1], function(err, data) {


            });
        });
        console.log("Document inserted");
        res.end(JSON.stringify(rannumjson));
    })
    .get('/isDoneRanYonketas', (req, res) => {

        console.log("isdone");
        MongoClient.connect(mongoDBPeopleUrl, function(err, db) {
            if (err) throw err;
            console.log("Switched to " + db.databaseName + " database");

            db.collection("isDoneRandomYonketas").find({}).toArray(function(err, data) {
                if (err) throw err;
                res.json(data);
            });
        });
    })
    .post('/isDoneRanYonketas', urlencodedParser, (req, res) => {
        //store.del('counter');
        //console.log(store.get('counter'));
        MongoClient.connect(mongoDBPeopleUrl, function(err, db) {
            if (err) throw err;
            console.log("Switched to " + db.databaseName + " database");

            db.collection("isDoneRanYonketas").updateOne({ "isDoneRanYonketas": "false" }, { $set: { "isDoneRanYonketas": "true" } }, { upsert: true });
        });
    })
    .listen(PORT2, () => console.log(`Listening on ${ PORT2 }`))
    /*
    io.on('disconnect', function(socket) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });
    io.on('send message', function(socket) {
        socket.emit('new message', { msg: data });
        console.log(data);
    });
    */