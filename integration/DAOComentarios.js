"use strict";
var mysql = require("mysql");
/**
 * Creación del DAOComentarios
 * @param {type} host
 * @param {type} usuario
 * @param {type} password
 * @param {type} nombreBD
 * @returns {DAOComentarios}
 */
function DAOComentarios(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}
/**
 * Inserta un comentario de un jugador en una partida
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOComentarios.prototype.insertarComentario = function (datos, callback) {
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "INSERT INTO comentarios (id_partida, id_usuario, fecha, comentario) " +
                    "VALUES (?, ?, ?, ?)";
            var parametros = [datos.id_partida, datos.id_usuario, datos.fecha, datos.comentario];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, result) {
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
 * Elimina un comentario de un usuario en una partida
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOComentarios.prototype.eliminarComentario = function (datos, callback) {
    if (callback === undefined)
        callback = function () {};
    // INICIALIZAR CONEXIÓN
    var conexion = mysql.createConnection({
        host: this.host,
        user: this.usuario,
        password: this.password,
        database: this.nombreBD
    });
    // REALIZAR CONEXIÓN
    conexion.connect(function (err) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "DELETE FROM comentarios WHERE id_partida=? AND id_usuario=?";
            var parametros = [datos.id_partida, datos.id_usuario];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, result) {
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
 * Lee todos los comentarios que hay en una partida
 * @param {type} id_partida
 * @param {type} callback
 * @returns {undefined}
 */
DAOComentarios.prototype.leerComentariosPorPartida = function (id_partida, callback) {
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
          var sql = "SELECT c.comentario, c.fecha, u.usuario,u.id_usuario FROM comentarios c join usuarios u WHERE c.id_partida=? and c.id_usuario = u.id_usuario ;";
          var parametros = [id_partida];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, result) {
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
// Exportación del DAO
module.exports = DAOComentarios;
