const exp = require('constants');
const express = require('express');
const { readFile } = require('fs');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const cors = require('cors');

const PORT = process.env.PORT;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '#123Class123',
    database: 'db_rbgslider'
});

db.connect((err) => {
    if (err) throw err;
    console.log('server connected');
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    readFile('./index.html', 'utf-8', (err, html) => {
        if (err) throw err;
        console.log("Connection Attempt");
        res.send(html);
    })
});

app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE db_rbgslider';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Created db');
    })
});

app.get('/info', (req, res) => {
    let sql = 'SELECT * FROM db_rbgslider.rgb;';
    console.log("Req made");
    db.query(sql, (err, result) => {
        if (err) throw err;
        condensed = Object.assign({}, ...result.map((x) => ({ [x.color]: x.value })));
        res.json(condensed);
        console.log(condensed);
    });
});

app.post('/', (req, res) => {
    const parcel = req.body;
    const color = Object.keys(parcel.data);
    const value = parcel.data[color[0]];
    let sql = "UPDATE rgb SET value = " + value + " WHERE color = '" + color + "'";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Updated slider data');
    })
});

app.get('/creatergbtable', (req, res) => {
    let sql = 'CREATE TABLE rgb(color varchar(255), value INT)';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Created rgbtable');
    })
});

app.get('/zero', (req, res) => {
    let sql = "INSERT INTO rgb(color, value) VALUES ('r', 0),('g', 0),('b', 0)";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Zeros');
    })
});

app.get('/update', (req, res) => {
    let sql = 'UPDATE rgb SET value = 100';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Updated');
    })
});

app.listen(3000, () => {
    console.log('Server started on 3000');
});