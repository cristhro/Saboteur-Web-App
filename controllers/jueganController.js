var config = require("../config");
// DAOs
var DAOPartidas = require("../integration/DAOPartidas");
var daoPartida = new DAOPartidas(config.dbHost, config.dbUser, config.dbPassword, config.dbName);

// Middlewares
var middlePartida = require("../middlewares/partidaMiddleware");
var middleGeneral = require("../middlewares/generalMiddleware");
var middleJuegan = require("../middlewares/jueganMiddleware");
var middleUsuario = require("../middlewares/usuarioMiddleware");
var middleTablero = require("../middlewares/tableroMiddleware");

module.exports = function(app){
    // -----------------------------------------------------------------------------------------------------
    app.get('/juegan/daoInsertarJuegan/:id_partida', middleGeneral.inicio, middleJuegan.unirsePartida, middleGeneral.falloInterno, middleUsuario.cargarDatosPerfil, function(request, response) {
        if(request.session.success.isSuccess){
            response.render('profile', {
                datosPerfil: request.session.datosPerfil,
                usuario: request.session.usuario,
                id_usuario: request.session.id_usuario,
                error: request.session.error,
                success:request.session.success
            });
        }else{
            response.render('joingame', {
                datosPerfil: request.session.datosPerfil,
                usuario: request.session.usuario,
                id_usuario: request.session.id_usuario,
                error: request.session.error,
                success: request.session.success
            });
        }
    });
    // -----------------------------------------------------------------------------------------------------
        app.get('/juegan/daoInsertar_y_Cerrar/:id_partida', middleGeneral.inicio, middleJuegan.unirsePartida, middlePartida.cerrarPartida, middleTablero.inicializarTablero, middleGeneral.falloInterno, middleUsuario.cargarDatosPerfil, function(request, response) {
        if(request.session.success.isSuccess){
            response.render('profile', {
                datosPerfil: request.session.datosPerfil,
                usuario: request.session.usuario,
                id_usuario: request.session.id_usuario,
                error: request.session.error,
                success:request.session.success
            });
        }else{
            response.render('joingame', {
                datosPerfil: request.session.datosPerfil,
                usuario: request.session.usuario,
                id_usuario: request.session.id_usuario,
                error: request.session.error,
                success: request.session.success
            });
        }
    });
    // -----------------------------------------------------------------------------------------------------
}
