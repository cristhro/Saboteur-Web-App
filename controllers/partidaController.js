var config = require("../config");
// DAOs
var DAOPartidas = require("../integration/DAOPartidas");
var daoPartida = new DAOPartidas(config.dbHost, config.dbUser, config.dbPassword, config.dbName);

// Middlewares
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({extended: true});
var middlePartida = require("../middlewares/partidaMiddleware");
var middleGeneral = require("../middlewares/generalMiddleware");
var middleUsuario = require("../middlewares/usuarioMiddleware");
var middleTablero = require("../middlewares/tableroMiddleware");

module.exports = function(app){
    // -----------------------------------------------------------------------------------------------------
    app.post('/partida/daoCrearPartida', middleGeneral.inicio, middlePartida.guardarPartida, middleUsuario.cargarDatosPerfil, middleGeneral.falloInterno, function(request, response) {
        if(request.session.success.isSuccess){
            response.render('profile', {
                datosPerfil: request.session.datosPerfil,
                usuario: request.session.usuario,
                id_usuario: request.session.id_usuario,
                error: request.session.error,
                success:request.session.success
            });
        }else{
            response.render('newgame', {
                datosPerfil: request.session.datosPerfil,
                usuario: request.session.usuario,
                id_usuario: request.session.id_usuario,
                error: request.session.error,
                success: request.session.success
            });
        }
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/partida/daoCerrarPartida/:id_partida', middleGeneral.inicio, middlePartida.cerrarPartida, middleTablero.inicializarTablero, middleUsuario.cargarDatosPerfil, middleGeneral.falloInterno, function(request, response) {
        response.render('profile', {
            datosPerfil: request.session.datosPerfil,
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
};
