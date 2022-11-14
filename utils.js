module.exports = {
  getUsuarioByName: (con, nombre, get) => {
    return new Promise( (resolve, reject) => {
      con.query(
        'INSERT IGNORE INTO usuarios (nombre) VALUES (?)',
        [nombre],
        (err) => {
          if (err) return reject(err);
          con.query(
            'SELECT * FROM usuarios WHERE nombre=?',
            [nombre],
            (err, result) => {
              if (err) return reject(err);
              resolve(result[0]);
            }
          );
        }
      );
    });
  },
  getInformacionByName: (con, nombre, get) => {
    return new Promise( (resolve, reject) => {
      con.query(
        'INSERT IGNORE INTO informaciones (nombre) VALUES (?)',
        [nombre],
        (err) => {
          if (err) return reject(err);
          con.query(
            'SELECT * FROM informaciones WHERE nombre=?',
            [nombre],
            (err, result) => {
              if (err) return reject(err);
              resolve(result[0]);
            }
          );
        }
      );
    });
  },
  getGrupoByName: (con, nombre, get) => {
    return new Promise( (resolve, reject) => {
      con.query(
        'INSERT IGNORE INTO grupos (nombre) VALUES (?)',
        [nombre],
        (err) => {
          if (err) return reject(err);
          con.query(
            'SELECT * FROM grupos WHERE nombre=?',
            [nombre],
            (err, result) => {
              if (err) return reject(err);
              resolve(result[0]);
            }
          );
        }
      );
    });
  },
  getLibroByCode: (con, nombre) => {
    return new Promise( (resolve, reject) => {
      con.query(
        'SELECT * FROM libros WHERE codigo=?',
        [nombre],
        (err, result) => {
          if (err) return reject(err);
          return result.length === 0 ? resolve({id: -1}) : resolve(result[0]);
        }
      );
    });
  }
}