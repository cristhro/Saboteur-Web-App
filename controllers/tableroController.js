"use strict"
// Middlewares
var middlePartida = require("../middlewares/partidaMiddleware");
var middleTablero = require("../middlewares/tableroMiddleware");
var middleGeneral = require("../middlewares/generalMiddleware");
var middleJuegan = require("../middlewares/jueganMiddleware");

module.exports = function(app){
    // -----------------------------------------------------------------------------------------------------
    app.get('/tablero/daoMostrarTablero/:id_partida', middleGeneral.inicio, middlePartida.cargarDatosPartidaConRol,middlePartida.cargarDatosJugadores, middleTablero.cargarDatosTablero, middleTablero.cargarCartasJugador, middleTablero.cargarComentarios, middleGeneral.falloInterno, function(request, response) {
        
        response.render('game', {
            datosPartida:request.session.datosPartida,
            datosTablero:request.session.datosTablero,
            datosJugadores:request.session.datosJugadores,
            datosCartasJugador:request.session.datosCartasJugador,
            datosComentarios:request.session.comentarios,
            datosJuego: { cartaEnJuego: {carta: null, pos: null},cartaEspecialEnJuego: {carta: null, pos: null, id: null}, casillasOcultas: { hay: false, casillasOcultas: null}},
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/tablero/procesar_carta/:id_partida/:id_carta/:pos/:id_cartas_juegan', middleGeneral.inicio, middlePartida.cargarDatosPartidaConRol,middlePartida.cargarDatosJugadores, middleTablero.cargarDatosTablero, middleTablero.cargarCartasJugador,middleTablero.cargarComentarios, middleGeneral.falloInterno, function(request, response) {
            request.session.id_cartas_juegan = request.params.id_cartas_juegan;

        response.render('game', {
            datosPartida:request.session.datosPartida,
            datosTablero:request.session.datosTablero,
            datosJugadores:request.session.datosJugadores,
            datosCartasJugador:request.session.datosCartasJugador,
            datosComentarios:request.session.comentarios,
            datosJuego: {cartaEnJuego: {carta: request.params.id_carta, pos: request.params.pos}, cartaEspecialEnJuego: {carta: null, pos: null, id: null}, casillasOcultas: { hay: false, casillasOcultas: null}},
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });

    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/tablero/procesar_carta_especial/:id_partida/:carta/:pos/:id_carta_especial', middleGeneral.inicio, middlePartida.cargarDatosPartidaConRol,middlePartida.cargarDatosJugadores, middleTablero.cargarDatosTablero, middleTablero.cargarCartasJugador,middleTablero.cargarComentarios, middleGeneral.falloInterno, function(request, response) {
        response.render('game', {
            datosPartida:request.session.datosPartida,
            datosTablero:request.session.datosTablero,
            datosJugadores:request.session.datosJugadores,
            datosCartasJugador:request.session.datosCartasJugador,
            datosComentarios:request.session.comentarios,
            datosJuego: {cartaEnJuego: {carta: null, pos: null}, cartaEspecialEnJuego: {carta: request.params.carta, pos: request.params.pos, id: request.params.id_carta_especial}},
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/tablero/ejecutar_movimiento/:id_partida/:fila/:columna/:carta', middleGeneral.inicio,middlePartida.comprobarTurno, middleTablero.ejecutarMovimiento, middlePartida.cargarDatosPartidaConRol,middlePartida.cargarDatosJugadores, middleTablero.cargarDatosTablero, middleTablero.cargarCartasJugador,middleTablero.cargarComentarios, middleGeneral.falloInterno, function(request, response) {

        response.render('game', {
            datosPartida:request.session.datosPartida,
            datosTablero:request.session.datosTablero,
            datosJugadores:request.session.datosJugadores,
            datosCartasJugador:request.session.datosCartasJugador,
            datosComentarios:request.session.comentarios,
            datosJuego: { cartaEnJuego: {carta: null, pos: null}, cartaEspecialEnJuego: {carta: null, pos: null, id: null}, casillasOcultas: request.session.casillasOcultas},
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
    app.post('/tablero/daoCrearComentario/:id_partida', middleGeneral.inicio, middleTablero.guardarComentario, middlePartida.cargarDatosPartidaConRol,middlePartida.cargarDatosJugadores, middleTablero.cargarDatosTablero, middleTablero.cargarCartasJugador,middleTablero.cargarComentarios, middleGeneral.falloInterno, function(request, response) {
        response.render('game', {
            datosPartida:request.session.datosPartida,
            datosTablero:request.session.datosTablero,
            datosJugadores:request.session.datosJugadores,
            datosCartasJugador:request.session.datosCartasJugador,
            datosComentarios:request.session.comentarios,
            datosJuego: {cartaEnJuego: {carta: null, pos: null },cartaEspecialEnJuego: {carta: null, pos: null, id: null}, casillasOcultas: { hay: false, casillasOcultas: null}},
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/tablero/bloquear_jugador/:id_partida/:id_juegan/:id_carta_especial', middleGeneral.inicio,middlePartida.comprobarTurno, middleJuegan.bloquearJugador, middlePartida.cargarDatosPartidaConRol,middlePartida.cargarDatosJugadores, middleTablero.cargarDatosTablero, middleTablero.cargarCartasJugador, middleTablero.cargarComentarios, middleGeneral.falloInterno,function(request, response) {
        console.log('AVISO: Bloquear jugador');
        console.log(request.params);
        response.render('game', {
            datosPartida:request.session.datosPartida,
            datosTablero:request.session.datosTablero,
            datosJugadores:request.session.datosJugadores,
            datosCartasJugador:request.session.datosCartasJugador,
            datosComentarios:request.session.comentarios,
            datosJuego: { cartaEnJuego: {carta: null, pos: null},cartaEspecialEnJuego: {carta: null, pos: null, id: null}, casillasOcultas: { hay: false, casillasOcultas: null}},
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/tablero/desbloquear_jugador/:id_partida/:id_juegan/:id_carta_especial', middleGeneral.inicio,middlePartida.comprobarTurno, middleJuegan.desbloquearJugador, middlePartida.cargarDatosPartidaConRol,middlePartida.cargarDatosJugadores, middleTablero.cargarDatosTablero, middleTablero.cargarCartasJugador, middleTablero.cargarComentarios, middleGeneral.falloInterno, function(request, response) {
        console.log('AVISO: Desbloquear jugador');
        console.log(request.params);
        response.render('game', {
            datosPartida:request.session.datosPartida,
            datosTablero:request.session.datosTablero,
            datosJugadores:request.session.datosJugadores,
            datosCartasJugador:request.session.datosCartasJugador,
            datosComentarios:request.session.comentarios,
            datosJuego: { cartaEnJuego: {carta: null, pos: null},cartaEspecialEnJuego: {carta: null, pos: null, id: null}, casillasOcultas: { hay: false, casillasOcultas: null}},
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/tablero/descartar/:id_partida/:carta', middleGeneral.inicio,middlePartida.comprobarTurno, middleTablero.descartarCarta, middlePartida.cargarDatosPartidaConRol,middlePartida.cargarDatosJugadores, middleTablero.cargarDatosTablero, middleTablero.cargarCartasJugador, middleTablero.cargarComentarios, middleGeneral.falloInterno, function(request, response) {
        console.log('AVISO: Carta descartada');
        response.render('game', {
            datosPartida:request.session.datosPartida,
            datosTablero:request.session.datosTablero,
            datosJugadores:request.session.datosJugadores,
            datosCartasJugador:request.session.datosCartasJugador,
            datosComentarios:request.session.comentarios,
            datosJuego: { cartaEnJuego: {carta: null, pos: null},cartaEspecialEnJuego: {carta: null, pos: null, id: null}, casillasOcultas: { hay: false, casillasOcultas: null}},
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/tablero/pasarTurno/:id_partida', middleGeneral.inicio, middleJuegan.pasarTurno, middlePartida.cargarDatosPartidaConRol,middlePartida.cargarDatosJugadores, middleTablero.cargarDatosTablero, middleTablero.cargarCartasJugador, middleTablero.cargarComentarios, middleGeneral.falloInterno, function(request, response) {
        console.log('AVISO: pasar turno');
        response.render('game', {
            datosPartida:request.session.datosPartida,
            datosTablero:request.session.datosTablero,
            datosJugadores:request.session.datosJugadores,
            datosCartasJugador:request.session.datosCartasJugador,
            datosComentarios:request.session.comentarios,
            datosJuego: { cartaEnJuego: {carta: null, pos: null},cartaEspecialEnJuego: {carta: null, pos: null, id: null}, casillasOcultas: { hay: false, casillasOcultas: null}},
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/tablero/lupa/:id_partida/:fila/:columna/:id_carta_especial', middleGeneral.inicio,middlePartida.comprobarTurno, middleTablero.lupa, middlePartida.cargarDatosPartidaConRol,middlePartida.cargarDatosJugadores, middleTablero.cargarDatosTablero, middleTablero.cargarCartasJugador,middleTablero.cargarComentarios, middleGeneral.falloInterno, function(request, response) {
        response.render('game', {
            datosPartida:request.session.datosPartida,
            datosTablero:request.session.datosTablero,
            datosJugadores:request.session.datosJugadores,
            datosCartasJugador:request.session.datosCartasJugador,
            datosComentarios:request.session.comentarios,
            datosJuego: { cartaEnJuego: {carta: null, pos: null}, cartaEspecialEnJuego: {carta: null, pos: null, id: null}, casillasOcultas: request.session.casillasOcultas},
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/tablero/bomba/:id_partida/:fila/:columna/:id_carta_especial', middleGeneral.inicio,middlePartida.comprobarTurno, middleTablero.bomba, middlePartida.cargarDatosPartidaConRol,middlePartida.cargarDatosJugadores, middleTablero.cargarDatosTablero, middleTablero.cargarCartasJugador,middleTablero.cargarComentarios, middleGeneral.falloInterno, function(request, response) {
        console.log(request.params);
        response.render('game', {
            datosPartida:request.session.datosPartida,
            datosTablero:request.session.datosTablero,
            datosJugadores:request.session.datosJugadores,
            datosCartasJugador:request.session.datosCartasJugador,
            datosComentarios:request.session.comentarios,
            datosJuego: { cartaEnJuego: {carta: null, pos: null}, cartaEspecialEnJuego: {carta: null, pos: null, id: null}, casillasOcultas: request.session.casillasOcultas},
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
};
