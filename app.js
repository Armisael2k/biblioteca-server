const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const con = require('./db');
app.set('port', 891);

app.get('/api/vacantes', function(req, res) {
    con.query(
        'SELECT v.*, u.nombre publicador_nombre\
        FROM vacantes v\
        INNER JOIN usuarios u ON v.id_usuario = u.id',
        (err, result) => {
            console.log(result);
            if (err) { console.error(err.sqlMessage); return res.send({ success: 0, msg: err.sqlMessage }) }
            res.send({ success: 1, result: result });
        }
    );
});
    
server.listen(app.get('port'), () => console.log(`Server en el puerto ${app.get('port')}`));