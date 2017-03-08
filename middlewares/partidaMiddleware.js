var config = require("../config");
var _ = require("../helpers/toolArray.js");
var DAOUsuarios = require("../integration/DAOUsuarios");
var daoUsuario = new DAOUsuarios(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOPartidas = require("../integration/DAOPartidas");
var daoPartida = new DAOPartidas(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOJuegan = require("../integration/DAOJuegan");
var daoJuegan = new DAOJuegan(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOCartas_Juegan = require("../integration/DAOCartas_Juegan");
var daoCartas_Juegan = new DAOCartas_Juegan(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOCartas_Partidas = require("../integration/DAOCartas_Partidas");
var daoCartas_Partidas = new DAOCartas_Partidas(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var helpers = require("../helpers/toolHelpers.js");

/**
 * Middleware que crea y almacena una partida en la BBDD
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function guardarPartida(request, response, next) {
    if(request.body.nombre===''){
       next(Error('Nombre de partida invalido'));
    }else if (isNaN(request.body.numMax_jugadores)){
       next(Error('Numero maximo de jugadores debe ser numerico')); 
    }else{
        // 1. Creamos la partida que vamos a insertar
        daoPartida.leerPartidas(function (err, resultado) {
            var partida = {
                nombre: request.body.nombre,
                estado: 'abierta',
                creador: request.session.usuario,
                fecha: new Date(),
                numMax_jugadores: request.body.numMax_jugadores,
                num_jugadores: 1,
                turno: '',
                ganador: '',
                turnos_restantes: 0,
                nombre_jugadores: request.session.usuario,

            }
            // 2. Comprobamos que no existe una partida con el mismo nombre
            daoPartida.comprobarSiExistePartida(partida.nombre, function (err, existe) {
                if (err)
                    console.log(err);
                else {
                    if (existe) {
                        console.log("AVISO: ya existe una partida con ese nombre.")
                        next(new Error('Ya existe una partida con el nombre ' + partida.nombre + '. Por favor, elija otro distinto.'));
                    } else {
                        daoPartida.crearPartida(partida, function (err, resultado) {
                            if (err) {
                                console.log(err.message);
                            } else {
                                // 3. Para insertar en la tabla 'juegan' necesitamos dos cosas que no tenemos: id_usuario e id_partida
                                // 3.1. Obtener id_usuario
                                daoUsuario.leerUsuarioPorNombre(partida.creador, function (err, datos_usuario) {
                                    if (err)
                                        console.log(err);
                                    else {
                                        // 3.2. Obtener id_partida
                                        daoPartida.leerPartidaPorNombre(partida.nombre, function (err, datos_partida) {
                                            if (err)
                                                console.log(err);
                                            else {
                                                var jugador = {
                                                    id_partida: datos_partida[0].id_partida,
                                                    id_usuario: datos_usuario[0].id_usuario,
                                                    rol: '',
                                                    numero_turno: 0,
                                                    bloqueo: 0
                                                }
                                                daoJuegan.insertarJuegan(jugador, function (err, resultado) {
                                                    if (err) {
                                                        console.log(err.message);
                                                    } else {
                                                        request.session.success = {
                                                            isSuccess: true,
                                                            msg: 'La partida con nombre ' + partida.nombre + ' ha sido creada con éxito.'
                                                        }
                                                        console.log("AVISO: Partida creada con éxito");
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
                }
            });
        });
    }
}
/**
 * Middleware que carga los datos de una partida (por su id)
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function cargarDatosPartida(request, response, next) {
    daoPartida.leerPartidaPorId(request.params.id_partida, function (err, result) {
        if (err) {
            next(err);
            console.log("ERROR: no se ha podido cargar los datos de la partida");
        } else {
            request.session.datosPartida = result;
            console.log("AVISO: Datos de la partida cargados con exito");
            next();
        }
    });
}
function cargarDatosJugadores(request, response, next) {
    console.log("<--- cargarDatosJugadores");
    daoPartida.leerJugadoresPorId_partida(request.params.id_partida, function (err, result) {
        if (err) {
            next(err);
            console.log("ERROR: no se ha podido cargar los datos de los jugadores");
        } else {
            request.session.datosJugadores = result;
            console.log("AVISO: Datos de los jugadores cargados con exito");
            next();
        }
    });
}
function cargarDatosPartidaConRol(request, response, next) {
    daoPartida.leerPartidaJueganPorId(request.params.id_partida, function (err, result) {
        if (err) {
            next(err);
        } else {
            var datos_partida_usuario = _.where(result, {id_usuario: request.session.id_usuario});
            request.session.datosPartida = datos_partida_usuario[0];
            console.log('AVISO: datos partida con rol cargado con exito');
            next();
        }
    });
}
/**
 * Middleware que cierra una partida (por su id) y actualiza todo lo necesario, es decir,
 * reparto de roles, cartas, estado de la partida, etc
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function cerrarPartida(request, response, next) {
    daoPartida.leerPartidaPorId(request.params.id_partida, function (err, datos_partida) {
        if (err) {
            console.log(err);
        } else {
            // 1. Cambiamos 'estado' y 'turnos_restantes' de la partida leída
            datos_partida[0].estado = 'activa';
            datos_partida[0].turnos_restantes = helpers.getTurnosTotales(datos_partida[0].num_jugadores);
            datos_partida[0].turno = helpers.getTurnoAleatorio(datos_partida[0].nombre_jugadores);
            // 2. Modificamos la partida haciendo un UPDATE
            daoPartida.modificarPartida(datos_partida[0], function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("AVISO: Partida modificada con éxito");
                    // 3. Se prepara el Array para repartir los roles y las cartas
                    daoJuegan.leerUsuariosPorIdPartida(datos_partida[0].id_partida, function (err, ArrayUsuarios) {
                        if (err)
                            console.log(err);
                        else {
                            // 3.1 Hacemos el reparto de roles
                            var arrayRepartoRoles = helpers.getRepartoRoles(ArrayUsuarios);
                            for (var i = 0; i < ArrayUsuarios.length; i++) { // Se recorren todos los usuarios
                                var juegan = {
                                    id_usuario: arrayRepartoRoles.ids[i],
                                    rol: arrayRepartoRoles.roles[i],
                                    id_partida: datos_partida[0].id_partida
                                }
                                daoJuegan.modificarJuegan(juegan, function (err, result) { // Y se modifican sus roles
                                    if (err)
                                        console.log(err);
                                });
                            }
                            console.log("AVISO: Roles repartidos con éxito");
                            // 3.2 Hacemos el reparto de cartas
                            for (var i = 0; i < ArrayUsuarios.length; i++) { // Se recorren todos los usuarios
                                var cartasJugador = {
                                    id_usuario: ArrayUsuarios[i].id_usuario,
                                    id_partida: datos_partida[0].id_partida,
                                    carta: new Array(),
                                    carta_especial: new Array(),
                                    activo: 1
                                }
                                cartasJugador = helpers.getRepartoCartas(cartasJugador);
                                // 3.2.1. Metemos las cartas normales
                                for (var j = 0; j < cartasJugador.carta.length; j++) { // Se recorren todas las cartas normales
                                    daoCartas_Juegan.insertarCartas_Juegan(cartasJugador.id_partida, cartasJugador.id_usuario, cartasJugador.carta[j], function (err, result) {
                                        if (err)
                                            console.log(err);
                                    });
                                }
                                for (var k = 0; k < cartasJugador.carta_especial.length; k++) { // Se recorren todas las cartas especiales
                                    // 3.2.2. Metemos las cartas especiales
                                    daoCartas_Partidas.insertarCartas_Partidas(cartasJugador.id_partida, cartasJugador.id_usuario, cartasJugador.carta_especial[k], cartasJugador.activo, function (err, callback) {
                                        if (err)
                                            console.log(err);
                                    });
                                }
                            }
                            console.log("AVISO: Cartas repartidas con éxito");
                            next();
                        }
                    });
                }
            });
        }
    });
}
function comprobarTurno(request, response, next){
    daoPartida.leerPartidaPorId(request.params.id_partida, function(err, datos_partida) {
        if (err) {
            console.log(err);
        } else {
            if (datos_partida[0].turno !== request.session.usuario){
                next(Error("Espera tu turno para realizar el movimiento"));
            } else{
                next();
            }
        }
    });
}
// Exportanción de los middlewares
module.exports = {
guardarPartida: guardarPartida,
cargarDatosPartida: cargarDatosPartida,
cerrarPartida: cerrarPartida,
cargarDatosPartidaConRol:cargarDatosPartidaConRol,
cargarDatosJugadores:cargarDatosJugadores,
comprobarTurno:comprobarTurno
};
