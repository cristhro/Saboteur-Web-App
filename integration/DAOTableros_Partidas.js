"use strict";

var mysql = require("mysql");

function DAOTableros_Partidas(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}
/**
 * Inserta los datos de una fila de la tabla 'tableros_partida'
 * @param {type} dato
 * @param {type} callback
 * @returns {undefined}
 */
DAOTableros_Partidas.prototype.insertarTableros_Partidas = function(id_partida, fila, columna, carta, callback) {
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "INSERT INTO tableros_partidas (id_partida, fila, columna, carta) " +
                "VALUES (?, ?, ?, ?)";
            var parametros = [id_partida, fila, columna, carta];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                    }
                    // CERRAR CONEXIÓN
                    conexion.end();
                }
            );
        }
    });
};
/**
 * Mediante unas coordenadas, modifica la carta del tablero
 * @param {type} dato
 * @param {type} callback
 * @returns {undefined}
 */
DAOTableros_Partidas.prototype.modificarCarta_Coordenadas = function(id_partida, fila, columna, carta, callback) {
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "UPDATE tableros_partidas SET carta=? WHERE id_partida=? AND fila=? AND columna=?";
            var parametros = [carta, id_partida, fila, columna];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                    }
                    // CERRAR CONEXIÓN
                    conexion.end();
                }
            );
        }
    });
};
DAOTableros_Partidas.prototype.modificarTableros_Partidas = function(tableros_partidas, callback) {
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "UPDATE tableros_partidas SET carta = ? WHERE id_tableros_partidas = ?";
            var parametros = [ tableros_partidas.carta, tableros_partidas.id_tableros_partidas];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                function(err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                    }
                    // CERRAR CONEXIÓN
                    conexion.end();
                }
            );
        }
    });
};
DAOTableros_Partidas.prototype.leerTableroPorId_partida = function(id_partida, callback) {
        if (callback === undefined) callback = function() {};
        // INICIALIZAR CONEXIÓN
        var conexion = mysql.createConnection({
            host: this.host,
            user: this.usuario,
            password: this.password,
            database: this.nombreBD
        });
        // REALIZAR CONEXIÓN
        conexion.connect(function(err) {
            if (err) {
                callback(err,null);
            } else {
                var sql = "SELECT fila, columna, carta FROM tableros_partidas WHERE id_partida = ? order by fila ASC";
                var parametros = [id_partida];
                // EJECUTAR CONSULTAS
                conexion.query(sql, parametros,
                    function(err, result) {
                      if (err) {
                          callback(err,null);
                      } else {
                        callback(null, result);
                      }
                      // CERRAR CONEXIÓN
                      conexion.end();
                    }
                  );
            }
        });

};
DAOTableros_Partidas.prototype.eliminarTableros_PartidasPorId = function(id_tableros_partidas, callback) {
        if (callback === undefined) callback = function() {};
        // INICIALIZAR CONEXIÓN
        var conexion = mysql.createConnection({
            host: this.host,
            user: this.usuario,
            password: this.password,
            database: this.nombreBD
        });
        // REALIZAR CONEXIÓN
        conexion.connect(function(err) {
            if (err) {
                callback(err,null);
            } else {
                var sql = "DELETE FROM tableros_partidas WHERE  id_tableros_partidas = ?";
                var parametros = [id_tableros_partidas];
                // EJECUTAR CONSULTAS
                conexion.query(sql, parametros,
                    function(err, result) {
                      if (err) {
                          callback(err,null);
                      } else {
                        callback(null, result);
                      }
                      // CERRAR CONEXIÓN
                      conexion.end();
                    }
                  );
            }
        });

};
// Exportación del DAO
module.exports = DAOTableros_Partidas;
