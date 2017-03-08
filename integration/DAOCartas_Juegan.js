"use strict";
var mysql = require("mysql");
/**
 * Creación del DAOCartas_Juegan
 * @param {type} host
 * @param {type} usuario
 * @param {type} password
 * @param {type} nombreBD
 * @returns {nm$_DAOCartas_Juegan.DAOCartas_Juegan}
 */
function DAOCartas_Juegan(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}
/**
 * Inserta las cartas que tendrá un usuario al empezar la partida
 * @param {type} cartas_juegan
 * @param {type} callback
 * @returns {undefined}
 */
DAOCartas_Juegan.prototype.insertarCartas_Juegan = function(id_partida, id_usuario, id_carta, callback) {
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
            var sql = "INSERT INTO cartas_juegan (id_partida, id_usuario, id_carta) " +
                "VALUES (?, ?, ?)";
            var parametros = [id_partida, id_usuario, id_carta];
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
 * Sustituye una carta por otra (de un jugador en una partida)
 * @param {type} cartas_juegan
 * @param {type} callback
 * @returns {undefined}
 */
DAOCartas_Juegan.prototype.modificarCartas_Juegan = function(id_cartas_juegan, nueva_carta, callback) {
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
            var sql = "UPDATE cartas_juegan SET id_carta=? WHERE id_cartas_juegan=?";
            var parametros = [nueva_carta, id_cartas_juegan];
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

DAOCartas_Juegan.prototype.leerCartas_Juegan = function(id_usuario, id_partida, callback) {
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
                var sql = "SELECT * FROM cartas_juegan WHERE id_usuario=? and  id_partida=?";
                var parametros = [id_usuario, id_partida] ;
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
 * Lee el id de la tabla según los parámetros recibidos
 * @param {type} id_usuario
 * @param {type} id_partida
 * @param {type} callback
 * @returns {undefined}
 */
DAOCartas_Juegan.prototype.leerCartaPorIdTabla = function(datos, callback) {
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
                var sql = "SELECT id_cartas_juegan FROM cartas_juegan WHERE id_usuario=? AND id_partida=? AND id_carta=?";
                var parametros = [datos.id_usuario, datos.id_partida, datos.id_carta] ;
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
 *
 * @param {type} id_cartas_juegan
 * @param {type} callback
 * @returns {undefined}
 */
DAOCartas_Juegan.prototype.eliminarCartas_JueganPorId = function(id_cartas_juegan, callback) {
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
                var sql = "DELETE FROM cartas_juegan WHERE  id_cartas_juegan = ?";
                var parametros = [id_cartas_juegan];
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
module.exports = DAOCartas_Juegan;
