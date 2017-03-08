var config = require("../config");
var DAOUsuarios = require("../integration/DAOUsuarios");
var daoUsuario = new DAOUsuarios(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOPartidas = require("../integration/DAOPartidas");
var daoPartida = new DAOPartidas(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOJuegan = require("../integration/DAOJuegan");
var daoJuegan = new DAOJuegan(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var helpers = require("../helpers/toolHelpers.js");
var DAOCartas_Partidas = require("../integration/DAOCartas_Partidas");
var daoCartasEspeciales = new DAOCartas_Partidas(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
/**
 * Permite unirnos a una partida ya creada
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function unirsePartida (request, response, next) {
    daoPartida.leerPartidaPorId(request.params.id_partida, function (err, datos_partida) {
        if (err) {
            console.log(err);
        }else {
            var jugador = {
                id_partida: request.params.id_partida,
                id_usuario: request.session.id_usuario,
                rol: '',
                numero_turno: 0,
                bloqueo: 0
            };
            // 1. Antes de unirse a la partida comprobamos si ya estaba participando
            daoJuegan.comprobarSiParticipa(jugador, function(err, existe) {
                if (err){
                    console.log(err);
                }else{
                    if(existe){
                        next(new Error('Ya estás participando en la partida ' + datos_partida[0].nombre) + '.');
                    }else{
                        daoJuegan.insertarJuegan(jugador, function(err, resultado) {
                            if (err) {
                                console.log(err.message);
                            }else{
                                // 2. Modificamos los datos de la partida
                                datos_partida[0].nombre_jugadores += " " + request.session.usuario;
                                datos_partida[0].num_jugadores += 1;
                                // Y hacemos un UPDATE
                                daoPartida.modificarPartida(datos_partida[0], function(err, result){
                                    if (err) {
                                        console.log(err.message);
                                    }else{
                                        request.session.success = {isSuccess: true, msg: 'Te has unido a la partida '+ datos_partida[0].nombre +' con éxito.'};
                                        console.log("AVISO: El jugador se ha unido con éxito");
                                        next();
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
}
function bloquearJugador (request, response, next) {
    var datos_juegan ={bloqueo:1, id_juegan:request.params.id_juegan};
    daoJuegan.modificaBloqueo(datos_juegan, function(err, existe) {
        if (err){
            console.log(err);
        }else{
            // 2. Obtenemos los datos de la partida (para modificar el turno)
            daoPartida.leerPartidaPorId(request.params.id_partida, function(err, datos_partida) {
                if (err) {
                    console.log(err);
                } else {
                    // 3. Modificamos los  'turno_restantes' y asignamos el siguiente 'turno'
                    datos_partida[0].turnos_restantes -= 1;
                    datos_partida[0].turno = helpers.getSiguienteTurno(datos_partida[0].nombre_jugadores, datos_partida[0].turno);

                    daoPartida.modificarPartida(datos_partida[0], function(err, callback){
                        if(err)
                            console.log(err);
                        else{
                            var datos= {activa: 0, id_carta_especial: Number(request.params.id_carta_especial)};
                            // 4. Desactivamos carta especial , poniendo activa: 0
                            daoCartasEspeciales.modificarCartas_Partidas(datos, function (err,result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    request.session.success = {isSuccess: true, msg: 'Bloqueo realizado con exito'};
                                    console.log('AVISO: jugador bloqueado con exito');
                                    next();
                                }
                            });

                        }
                    });
                }
            });

        }
    });
}
function desbloquearJugador (request, response, next) {
    console.log('<--- desbloquearJugador');
    var datos_juegan ={bloqueo:0, id_juegan:request.params.id_juegan};
    // 1. modifica el estado de bloquedo del jugador (por id_juegan)
    daoJuegan.modificaBloqueo(datos_juegan, function(err, existe) {
        if (err){
            console.log(err);
        }else{

            // 2. Obtenemos los datos de la partida (para modificar el turno)
            daoPartida.leerPartidaPorId(request.params.id_partida, function(err, datos_partida) {
                if (err) {
                    console.log(err);
                } else {
                    // 3. Modificamos los  'turno_restantes' y asignamos el siguiente 'turno'
                    datos_partida[0].turnos_restantes -= 1;
                    datos_partida[0].turno = helpers.getSiguienteTurno(datos_partida[0].nombre_jugadores, datos_partida[0].turno);

                    daoPartida.modificarPartida(datos_partida[0], function(err, callback){
                        if(err)
                            console.log(err);
                        else{
                            var datos= {activa: 0, id_carta_especial: Number(request.params.id_carta_especial)};
                            // 4. Desactivamos carta especial , poniendo activa: 0
                            daoCartasEspeciales.modificarCartas_Partidas(datos, function (err,result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    request.session.success = {isSuccess: true, msg: 'desBloqueo realizado con exito'};
                                    console.log('AVISO: jugador desbloqueado con exito');
                                    next();
                                }
                            });
                        }
                    });
                }
            });

        }
    });
}
function pasarTurno (request, response, next) {
    console.log('<--- pasarTurno');
        // 2. Obtenemos los datos de la partida (para modificar el turno)
        daoPartida.leerPartidaPorId(request.params.id_partida, function(err, datos_partida) {
            if (err) {
                console.log(err);
            } else {
                // 3. Modificamos los  'turno_restantes' y asignamos el siguiente 'turno'
                datos_partida[0].turnos_restantes -= 1;
                datos_partida[0].turno = helpers.getSiguienteTurno(datos_partida[0].nombre_jugadores, datos_partida[0].turno);

                daoPartida.modificarPartida(datos_partida[0], function(err, callback){
                    if(err)
                        console.log(err);
                    else{
                        request.session.success = {isSuccess: true, msg: 'Turno cambiado con exito'};
                        console.log('AVISO: Turno cambiado con exito');
                        next();
                    }
                });
            }
        });
}


// Exportanción de los middlewares
module.exports = {
    unirsePartida: unirsePartida,
    bloquearJugador:bloquearJugador,
    desbloquearJugador:desbloquearJugador,
    pasarTurno:pasarTurno
};
