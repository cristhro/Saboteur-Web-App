"use strict";

var mysql = require("mysql");
/**
 * Creación del DAOJuegan
 * @param {type} host
 * @param {type} usuario
 * @param {type} password
 * @param {type} nombreBD
 * @returns {nm$_DAOJuegan.DAOJuegan}
 */
function DAOJuegan(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}
/**
 * Inserta un usuario como nuevo jugador de una partida
 * @param {type} juegan
 * @param {type} callback
 * @returns {undefined}
 */
DAOJuegan.prototype.insertarJuegan = function (juegan, callback) {
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
            var sql = "INSERT INTO juegan (id_partida, id_usuario, rol, numero_turno, bloqueo) " +
                    "VALUES (?, ?, ?, ?, ?)";
            var parametros = [juegan.id_partida, juegan.id_usuario, juegan.rol, juegan.numero_turno, juegan.bloqueo];
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
 * Modifica el rol de un jugador, tanto rol como id se pasan por parámetro
 * @param {type} juegan
 * @param {type} callback
 * @returns {undefined}
 */
DAOJuegan.prototype.modificarJuegan = function (juegan, callback) {
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
            var sql = "UPDATE juegan SET rol =? WHERE id_usuario =? AND id_partida =?";
            var parametros = [juegan.rol, juegan.id_usuario, juegan.id_partida];
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
 * Operación que modifica el bloqueo de un jugador según el parámetro que se le pase
 * @param {type} juegan
 * @param {type} callback
 * @returns {undefined}
 */
DAOJuegan.prototype.modificaBloqueo = function (juegan, callback) {
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
            var sql = "UPDATE juegan SET bloqueo=? WHERE id_juegan =?";
            var parametros = [juegan.bloqueo,  juegan.id_juegan];
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
 *
 * @param {type} id_juegan
 * @param {type} callback
 * @returns {undefined}
 */
DAOJuegan.prototype.leerJueganPorId = function (id_juegan, callback) {
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
            var sql = "SELECT * FROM juegan WHERE id_juegan = ?";
            var parametros = [id_juegan];
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
 * Comprueba si un jugador ya participa en una partida
 * @param {type} id_juegan
 * @param {type} callback
 * @returns {undefined}
 */
DAOJuegan.prototype.comprobarSiParticipa = function (datos, callback) {
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
            var sql = "SELECT * FROM juegan WHERE id_partida = ? AND id_usuario = ?";
            var parametros = [datos.id_partida, datos.id_usuario];
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
/**
 * Comprueba si un jugador está bloqueado (1) o desbloqueado (0)
 * @param {type} datos
 * @param {type} callback
 * @returns {undefined}
 */
DAOJuegan.prototype.comprobarBloqueo = function (datos, callback) {
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
            var sql = "SELECT * FROM juegan WHERE id_partida=? AND id_usuario=?";
            var parametros = [datos.id_partida, datos.id_usuario];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, result) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (result[0].bloqueo === 1) {
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
/**
 * Cuando una partida termina, elimina a todos los jugadores de la tabla 'Juegan'
 * @param {type} id_juegan
 * @param {type} callback
 * @returns {undefined}
 */
DAOJuegan.prototype.eliminarJugadorPorId_partida = function (id_juegan, callback) {
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
            var sql = "DELETE FROM juegan WHERE id_juegan = ?";
            var parametros = [id_juegan];
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
 * Debido a que en la tabla juegan habrá muchas partidas simultáneas, nos interesa
 * leer los id de los usuarios que juegan en una determinada partida cuyo id lo
 * pasamos por parámetro
 * @param {type} id_partida
 * @param {type} callback
 * @returns {undefined}
 */
DAOJuegan.prototype.leerUsuariosPorIdPartida = function (id_partida, callback) {
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
            var sql = "SELECT id_usuario FROM juegan WHERE id_partida = ?";
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
DAOJuegan.prototype.leerRolByUsuario = function (usuario,id_partida, callback) {
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
            var sql = "SELECT j.rol FROM juegan j join  usuarios u WHERE j.id_usuario = u.id_usuario  and u.usuario = ? and j.id_partida =?";
            var parametros = [usuario, id_partida];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, result) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, result[0].rol);
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
// Exportación del DAO
module.exports = DAOJuegan;
