"use strict";
var mysql = require("mysql");

/**
 * Función que inicializa por atributos del DAOPartidas
 * @param {type} host
 * @param {type} usuario
 * @param {type} password
 * @param {type} nombreBD
 * @returns {nm$_DAOPartidas.DAOPartidas}
 */
function DAOPartidas(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}
/**
 * Crea una nueva partida (pasada por parámetro)
 * @param {type} partida
 * @param {type} callback
 * @returns {undefined}
 */
DAOPartidas.prototype.crearPartida = function (partida, callback) {
  if (callback === undefined) callback = function() {};

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
          var sql = "INSERT INTO partidas(nombre, estado, creador, fecha, numMax_jugadores, num_jugadores, turno, ganador, nombre_jugadores, turnos_restantes) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          var parametros = [partida.nombre, partida.estado, partida.creador, partida.fecha,
                            partida.numMax_jugadores, partida.num_jugadores, partida.turno, partida.ganador, partida.nombre_jugadores, partida.turnos_restantes];
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
 * Devuelve los campos de la partida cuyo id se pasa por parámetro
 * @param {type} id
 * @param {type} callback
 * @returns {undefined}
 */
DAOPartidas.prototype.leerPartidaPorId = function (id, callback) {
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
          var sql = "SELECT * FROM partidas  WHERE id_partida = ?";
          var parametros = [id];
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
DAOPartidas.prototype.leerJugadoresPorId_partida = function (id, callback) {
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
          var sql = "SELECT u.id_usuario, u.usuario, j.id_juegan, j.id_partida, j.bloqueo FROM  usuarios u join juegan j  WHERE j.id_partida  = ? and u.id_usuario = j.id_usuario";
          var parametros = [id];
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
DAOPartidas.prototype.leerPartidaJueganPorId = function (id, callback) {
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
          var sql = "SELECT * FROM partidas p  join juegan j WHERE p.id_partida = j.id_partida and p.id_partida = ?";
          var parametros = [id];
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
 * Devuelve los campos de la partida cuyo nombre se pasa por parámetro
 * @param {type} nombre
 * @param {type} callback
 * @returns {undefined}
 */
DAOPartidas.prototype.leerPartidaPorNombre = function (nombre, callback) {
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
          var sql = "SELECT * FROM partidas WHERE nombre=?";
          var parametros = [nombre];
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
 * Devuelve todas las partidas de la tabla 'partidas'
 * @param {type} callback
 * @returns {undefined}
 */
DAOPartidas.prototype.leerPartidas = function (callback) {
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
          var sql = "SELECT * FROM partidas";
          // EJECUTAR CONSULTAS
          conexion.query(sql,
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
 * Modifica todos los campos de una partida (pasada por parámetro)
 * @param {type} partida
 * @param {type} callback
 * @returns {undefined}
 */
DAOPartidas.prototype.modificarPartida = function(partida, callback) {
  if (callback === undefined) callback = function() {};
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
            var sql = "UPDATE partidas SET nombre=?, estado=?, creador=?, fecha=?, num_jugadores=?, turno=?, ganador=?, numMax_jugadores=?, nombre_jugadores=?,turnos_restantes=? WHERE id_partida =?";
            var parametros = [partida.nombre, partida.estado, partida.creador, partida.fecha, partida.num_jugadores, partida.turno, partida.ganador, partida.numMax_jugadores, partida.nombre_jugadores,partida.turnos_restantes, partida.id_partida];
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
 * Resta 1 a los turnos totales de la partida
 * @param {type} partida
 * @param {type} callback
 * @returns {undefined}
 */
DAOPartidas.prototype.restarTotalTurnos = function(turnos_restantes, id_partida, callback) {
  if (callback === undefined) callback = function() {};
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
            var sql = "UPDATE partidas SET turnos_restantes=? WHERE id_partida=?";
            var parametros = [turnos_restantes, id_partida];
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
 * Elimina una partida por su id
 * @param {type} id_partida
 * @param {type} callback
 * @returns {undefined}
 */
DAOPartidas.prototype.eliminarPartidaPorId = function(id_partida, callback) {
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
                var sql = "DELETE FROM partidas WHERE  id_partida = ?";
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

DAOPartidas.prototype.comprobarSiExistePartida = function (nombre, callback) {
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
            var sql = "SELECT * FROM partidas WHERE nombre=?";
            var parametros = [nombre];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, result) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (result.length > 0) {
                                callback(null, true);
                            } else {
                                callback(null, false);
                            }
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
DAOPartidas.prototype.leerGanadoresPorRol= function (id_partida, rol, callback) {
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
          var sql = "SELECT u.usuario FROM juegan j join usuarios u WHERE j.id_usuario = u.id_usuario and j.rol = ? and j.id_partida = ?";
           var parametros = [rol,id_partida];
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
// Exportanción del DAO
module.exports = DAOPartidas;
