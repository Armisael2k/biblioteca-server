const express = require('express');
const http = require('http');
const crypto = require('crypto');
const app = express();
const server = http.createServer(app);
const con = require('./db');
app.use(express.json());
app.set('port', 891);

app.get('/api/vacantes', (req, res) => {
    con.query(
        'SELECT v.*, u.nombre publicador_nombre\
        FROM vacantes v\
        INNER JOIN usuarios u ON v.id_usuario = u.id',
        (err, result) => {
            if (err) { console.error(err.sqlMessage); return res.send({ success: 0, msg: err.sqlMessage }) }
            res.send({ success: 1, result: result });
        }
    );
});

app.post('/api/acceder', async (req, res) => {
    let { user, password } = req.body;
    password = crypto.createHash('sha256').update(password).digest('hex');
    con.query(
        'SELECT id, nombre, usuario FROM usuarios WHERE usuario=? AND contrasena=?',
        [user, password],
        (err, result) => {
            if (err) { console.error(err.sqlMessage); return res.send({ success: 0, msg: err.sqlMessage }) }
            res.send({ success: 1, result: result[0] });
        }
    );
});
    
server.listen(app.get('port'), () => console.log(`Server en el puerto ${app.get('port')}`));