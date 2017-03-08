"use strict";

var mysql = require("mysql");

function DAOUsuarios(host, usuario, password, nombreBD) {
    this.host = host;
    this.usuario = usuario;
    this.password = password;
    this.nombreBD = nombreBD;
}
DAOUsuarios.prototype.insertarUsuario = function(user, callback) {
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
            callback(err, null);
        } else {
            var sql = "INSERT INTO usuarios(usuario, clave, nombre_completo, sexo, foto, nacimiento) " +
                "VALUES (?, ?, ?, ?, ?, ?)";
            var parametros = [user.usuario, user.clave, user.nombre_completo, user.sexo, user.imagen, user.nacimiento];
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

DAOUsuarios.prototype.verificarUsuario = function(datosLogin, callback) {
    if (callback === undefined) callback = function() {};
      // INICIALIZAR CONEXIÓN
      var conexion = mysql.createConnection({
          host: this.host,
          user: this.usuario,
          password: this.password,
          database: this.nombreBD
      });
      // REALIZAR CONEXIÓN
      conexion.connect(function(err, resultado) {
          if (err) {
              callback(err, null);
          } else {
              var sql = "SELECT * FROM `usuarios` WHERE usuario = ? AND clave = ?"
              var parametros = [datosLogin.usuario, datosLogin.clave];
              // EJECUTAR CONSULTAS
              conexion.query(sql, parametros,
                  function(err, result) {
                      if (err) {
                          callback(err, null);
                      } else {
                          if(result.length > 0){
                              resultado = {id_usuario: result[0].id_usuario};
                              callback(null, resultado);
                            }
                            else{
                              resultado = {id_usuario: null};;
                              callback(null,resultado);
                            }
                      }
                      // CERRAR CONEXIÓN
                      conexion.end();
                  }
              );
          }
      });
};

DAOUsuarios.prototype.modificarUsuario = function(user, callback) {
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
            var sql = "UPDATE usuarios SET clave = ?, nombre_completo = ?, sexo = ? , foto = ?, nacimiento = ? WHERE id_usuario = ? ";
            var parametros = [ user.clave, user.nombre_completo, user.sexo, user.foto, user.nacimiento, user.id_usuario];
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

DAOUsuarios.prototype.leerUsuarioPorId = function(id_usuario, callback) {
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
                var sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
                var parametros = [id_usuario];
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

DAOUsuarios.prototype.eliminarUsuarioPorId = function(id_usuario, callback) {
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
                var sql = "DELETE FROM usuarios WHERE  id_usuario = ?";
                var parametros = [id_usuario];
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

DAOUsuarios.prototype.leerUsuarioPorNombre = function(usuario, callback) {
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
                var sql = "SELECT `id_usuario`, `usuario`, `clave`, `nombre_completo`, `sexo`, `nacimiento` FROM usuarios WHERE usuario=?";
                var parametros = [usuario];
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
DAOUsuarios.prototype.obtenerImagen = function (id_usuario, callback) {
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
    conexion.connect(function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            var sql = "SELECT foto FROM usuarios WHERE id_usuario = ?";
            var parametros = [id_usuario];
            // EJECUTAR CONSULTAS
            conexion.query(sql, parametros,
                    function (err, resultado) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, resultado);
                        }
                        // CERRAR CONEXIÓN
                        conexion.end();
                    }
            );
        }
    });
};
// Exportación del DAO
module.exports = DAOUsuarios;
