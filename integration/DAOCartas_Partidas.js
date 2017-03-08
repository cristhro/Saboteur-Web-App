"use strict";
var mysql = require("mysql");
/**
 * Creación del DAOCartas_Partidas
 * @param {type} host
 * @param {type} usuario
 * @param {type} password
 * @param {type} nombreBD
 * @returns {nm$_DAOCartas_Partidas.DAOCartas_Partidas}
 */
function DAOCartas_Partidas(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}
DAOCartas_Partidas.prototype.leerCartas_PartidasPorId = function(datos, callback) {
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
                var sql = "SELECT * FROM cartas_partida WHERE id_partida=? AND id_usuario=? AND activa =?";
                var parametros = [datos.id_partida, datos.id_usuario, datos.activa];
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
/**
 * Inserta una carta especial a un usuario en una partida
 * @param {type} cartas_partidas
 * @param {type} callback
 * @returns {undefined}
 */

DAOCartas_Partidas.prototype.insertarCartas_Partidas = function(id_partida, id_usuario, id_carta, activa, callback) {
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
            var sql = "INSERT INTO cartas_partida (id_partida, id_usuario, id_carta, activa) " +
                "VALUES (?, ?, ?, ?)";
            var parametros = [id_partida, id_usuario, id_carta, activa];
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
 * Modifica una carta especial de un usuario en una partida
 * @param {type} cartas_partidas
 * @param {type} callback
 * @returns {undefined}
 */
DAOCartas_Partidas.prototype.modificarCartas_Partidas = function(dato, callback) {
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
            var sql = "UPDATE cartas_partida SET activa=? WHERE id_cartas_partidas=?";
            var parametros = [dato.activa, dato.id_carta_especial];
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


DAOCartas_Partidas.prototype.eliminarCartas_PartidasPorId = function(id_cartas_partidas, callback) {
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
                var sql = "DELETE FROM cartas_partida WHERE  id_cartas_partidas = ?";
                var parametros = [id_cartas_partidas];
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
module.exports = DAOCartas_Partidas;
