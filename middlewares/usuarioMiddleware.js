var config = require("../config");
var DAOUsuarios = require("../integration/DAOUsuarios");
var daoUsuario = new DAOUsuarios(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOPartidas = require("../integration/DAOPartidas");
var daoPartida = new DAOPartidas(config.dbHost, config.dbUser, config.dbPassword, config.dbName);

/**
 * Middleware que llama al método leerPartidas del DAOPartidas
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function cargarDatosPerfil(request, response, next) {
    daoPartida.leerPartidas(function(err, resultado) {
        request.session.datosPerfil = resultado;
        next();
    });
}
/**
 * Middleware que llama al método verificarUsuario del DAOUsuario
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function verificarUsuario(request, response, next) {
     // Combprobamos si el usuario existe
        daoUsuario.leerUsuarioPorNombre(request.body.usuario, function(err, result) {
            if (err) {
                console.log('ERROR: al leer un usuario por nombre.');
            } else {
                // Si existe
                if (result.length > 0) {
                    // Comprobamos si es correcta la contraseña
                    daoUsuario.verificarUsuario(request.body, function(err, resultado) {
                        if (err) {
                            console.log('ERROR: al verificar un usuario.');
                        }
                        if (resultado.id_usuario !== null) {
                            request.session.id_usuario = resultado.id_usuario;
                            request.session.usuario = request.body.usuario;
                            request.session.success = {
                                isSuccess: true,
                                msg: 'Has iniciado sesión con éxito.'
                            };
                            next();
                        } else {
                            next(new Error('la contraseña introducida es incorrecta.'));
                        }
                    });
                } else {
                    next(new Error('los datos no coinciden con ninguna cuenta de usuario.'));
                }
            }
        });
}
/**
 * Middleware que inserta un usuario en la BBDD
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function guardarUsuario(request, response, next) {
    request.body.imagen = request.file.buffer;
    if(request.body.usuario === ''||request.body.clave ==='' || request.body.nombre_completo==='' || request.body.nombre_completo===''){
        next(Error('Los campos con * en rojo Son obligatorios'));
    }else{
        daoUsuario.insertarUsuario(request.body, function(err, result) {
        if (err) {
            next(err);
        } else {
            request.session.success = {
                isSuccess: true,
                msg: request.body.usuario + ', te has registrado con éxito.'
            };
            console.log("AVISO: usuario guardado con éxito");
            next();
        }
    });
    }
}
/**
 * 
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function cerrarSession(request, response, next) {
    
    request.session.destroy(function(err) {
        next();
    });
}
// Exportanción de los middlewares
module.exports = {
    cargarDatosPerfil: cargarDatosPerfil,
    verificarUsuario: verificarUsuario,
    guardarUsuario: guardarUsuario,
    cerrarSession: cerrarSession
};
