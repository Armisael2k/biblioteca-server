const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const con = require('./db');
const utils = require('./utils');
app.use(express.json());
app.set('port', 900);

app.post('/api/alumno', function(req, res) {
    const { matricula } = req.body;
    try {
        console.log('Busqueda', matricula);
        con.query(
            'SELECT a.*, c.nombre carrera, g.nombre grupo\
            FROM alumnos a\
            INNER JOIN carreras c ON a.id_carrera = c.id\
            INNER JOIN grupos g ON a.id_grupo = g.id\
            WHERE matricula=?',
            [matricula],
            (err, result) => {
                if (err) { console.error(err.sqlMessage); return res.send({ success: 0, message: err.sqlMessage }) }
                res.send({ success: 1, result: result[0] });
            }
        );
    } catch (error) {
        console.log(err);
        res.send({ success: 0 });
    }
});

app.post('/api/registrar-entrada', async (req, res) => {
    try {
        const { tipo, nombre, informacion } = req.body;
    
        const { id: usuarioId } = await utils.getUsuarioByName(con, nombre);
        const { id: informacionId } = await utils.getInformacionByName(con, informacion);

        console.log('Registrar entrada', tipo, nombre, informacion);
        
        con.query(
            'INSERT INTO entradas (id_usuario, id_informacion, tipo)\
            VALUES (?, ?, ?)',
            [usuarioId, informacionId, tipo],
            (err, result) => {
                if (err) { console.error(err.sqlMessage); return res.send({ success: 0, message: err.sqlMessage }) }
                if (result.affectedRows === 0) return res.send({ success: 0, message: 'Error desconocido' });
                res.send({ success: 1 });
            }
        );
    } catch (err) {
        console.log(err);
        res.send({ success: 0 });
    }
});

app.post('/api/registrar-prestamo-computadora', async (req, res) => {
    const { nombre, carrera: informacion, grupo, computadora } = req.body;
    console.log('Registrar_PC', nombre, informacion, grupo, computadora);

    try {
        const { id: usuarioId } = await utils.getUsuarioByName(con, nombre);
        const { id: informacionId } = await utils.getInformacionByName(con, informacion);

        con.query(
            'INSERT INTO prestamos_computadoras (id_usuario, id_informacion, numero)\
            VALUES (?, ?, ?)',
            [usuarioId, informacionId, computadora],
            (err, result) => {
                if (err) { console.log(err.sqlMessage); return res.send({ success: 0, message: err.sqlMessage }) }
                if (result.affectedRows === 0) return res.send({ success: 0, message: 'Error desconocido' });
                res.send({ success: 1 });
            }
        );
    } catch (err) {
        console.log(err);
        res.send({ success: 0 });
    }
});

app.post('/api/registrar-prestamo-libro', async (req, res) => {
    const { nombre, informacion, tipo, libro } = req.body;
    console.log('Prestamo Libro', nombre, informacion, tipo, libro);
    
    try {
        const { id: usuarioId } = await utils.getUsuarioByName(con, nombre);
        const { id: informacionId } = await utils.getInformacionByName(con, informacion);
        const { id: libroId, nombre: libroNombre } = await utils.getLibroByCode(con, libro);

        if (libroId === -1) return res.send({ success: 0, message: 'Libro no encontrado' });

        con.query(
            'INSERT INTO prestamos (id_usuario, id_libro)\
            VALUES (?, ?)',
            [usuarioId, libroId],
            (err, result) => {
                if (err) {
                    if (err.errno === 1062) return res.send({ success: 0, message: 'El libro ya se encuentra prestado' });
                    console.log(err);
                    return res.send({ success: 0, message: err.sqlMessage })
                }
                if (result.affectedRows === 0) return res.send({ success: 0, message: 'Error desconocido' });
                res.send({ success: 1, message: `${libroNombre} prestado con éxito` });
                
                // con.query(
                //     'INSERT INTO registros_libros (id_usuario, id_libro, id_informacion, tipo, movimiento)\
                //     VALUES (?, ?, ?, ?, 1)',
                //     [usuarioId, libroId, informacionId, tipo],
                //     (err, result) => {
                //         if (err) { console.log(err); return res.send({ success: 0, message: err.sqlMessage }) }
                //         if (result.affectedRows === 0) return res.send({ success: 0, message: 'Error desconocido' });
                //         res.send({ success: 1, message: `${libroNombre} prestado con éxito` });
                //     }
                // );

            }
        );
        
    } catch (err) {
        console.log(err);
        res.send({ success: 0, message: err.message });
    }
});

app.post('/api/registrar-devolucion-libro', async (req, res) => {
    const { libro } = req.body;
    console.log('Devolución Libro', libro);

    try {
        const { id: libroId, nombre: libroNombre } = await utils.getLibroByCode(con, libro);

        if (libroId === -1) return res.send({ success: 0, message: 'Libro no encontrado' });

        con.query(
            'DELETE FROM prestamos WHERE id_libro=? LIMIT 1',
            [libroId],
            (err, result) => {
                if (err) { console.log(err.sqlMessage); return res.send({ success: 0, message: err.sqlMessage }) }
                if (result.affectedRows === 0) return res.send({ success: 0, message: 'El libro no se encuentra prestado' });
                res.send({ success: 1, message: `devolución del libro ${libroNombre} registrada` });
            }
        );
    } catch (err) {
        console.log(err);
        res.send({ success: 0 });
    }
});

server.listen(app.get('port'), () => console.log(`Server en el puerto ${app.get('port')}`));