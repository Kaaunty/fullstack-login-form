const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const bcrypt = require('bcrypt');

const saltRounds = 10;

async function EncryptPassword(password) {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}
let con = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
});

function CreateDatabase() {
    const database = 'loginform';
    con.query(`CREATE DATABASE ${database}`, (error, results) => {
        if (error) {
            if (error.message.includes('database exists')) {
                console.log('Database já existe');
            }
        }
        con.changeUser({ database: 'loginform' }, function (err) {
            if (err) throw err;
            CreateTable();
        });
    });
}

function CreateTable() {
    con.connect(function (err) {
        if (err) throw err;
        var sql =
            'CREATE TABLE users ( id INT NOT NULL AUTO_INCREMENT,name VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL,password VARCHAR(255) NOT NULL,PRIMARY KEY (id),UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);';
        con.query(sql, function (err, result) {
            if (err) {
                if (err.message.includes('')) {
                    console.log('tabela ja criada');
                }
            }
        });
    });
}

CreateDatabase();

const app = express();

let initialPath = path.join(__dirname, 'public');

app.use(bodyParser.json());
app.use(express.static(initialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(initialPath, 'login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(initialPath, 'register.html'));
});

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;
    if (!email.length || !password.length) {
        res.json('fill all the fields');
    } else {
        con.query(
            'SELECT * FROM `users` WHERE `email` = ?',
            [email],
            function (err, results) {
                const hashedPassword = results[0].password;
                bcrypt.compare(
                    password,
                    hashedPassword,
                    function (err, result) {
                        if (result) {
                            res.json(results[0]);
                        } else {
                            res.json('email or password is incorrect');
                        }
                    }
                );
            }
        );
    }
});

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;
    if (!name.length || !email.length || !password.length) {
        res.json('fill all the fields');
    } else {
        EncryptPassword(password).then((result) => {
            con.query(
                'INSERT INTO users(id,name,email,password) VALUES (DEFAULT,?,?,?)',
                [name, email, result],
                (error, results) => {
                    if (error) {
                        if (error.message.includes('Duplicate entry')) {
                            res.json('Duplicate entry');
                        }
                    } else {
                        res.json('Registration completed');
                    }
                }
            );
        });
    }
});

app.listen(3000, (req, res) => {
    console.log('listening on port 3000.....');
});
