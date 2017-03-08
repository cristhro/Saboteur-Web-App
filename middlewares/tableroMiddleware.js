var _ = require("underscore"); // Librería para manejar los arrays
var config = require("../config");
var DAOTableros_Partidas = require("../integration/DAOTableros_Partidas");
var daoTablero = new DAOTableros_Partidas(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOCartas_Juegan = require("../integration/DAOCartas_Juegan");
var daoCartasJuegan = new DAOCartas_Juegan(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOPartidas = require("../integration/DAOPartidas");
var daoPartida = new DAOPartidas(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOComentarios = require("../integration/DAOComentarios");
var daoComentario = new DAOComentarios(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOJuegan = require("../integration/DAOJuegan");
var daoJuegan = new DAOJuegan(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var DAOCartas_Partidas = require("../integration/DAOCartas_Partidas");
var daoCartasEspeciales = new DAOCartas_Partidas(config.dbHost, config.dbUser, config.dbPassword, config.dbName);
var helpers = require("../helpers/toolHelpers.js");
var toolTablero = require("../helpers/toolTablero.js");

/**
 * Middleware que carga los datos de un tablero (por id de la partida)
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function cargarDatosTablero(request, response, next) {
    console.log('<--- cargarDatosTablero');
    daoTablero.leerTableroPorId_partida(request.params.id_partida, function (err, datos_tablero) {
        if (err) {
            next(err);
        } else {
         
            daoPartida.leerPartidaPorId(request.params.id_partida, function (err, datos_partida) {
                if (err) {
                    console.log(err);
                } else{
                    // 1. Transformamos el tablero a un array[columans:{filas}]
                    var casillasOcultas = request.session.casillasOcultas;
                    var tablero = toolTablero.transformarTablero(datos_tablero);

                    if(datos_partida[0].estado !== 'terminada'){
                        toolTablero.cambiarGoldNoGold_PorDNK(tablero, casillasOcultas);
                    }
                    console.log("AVISO: Tablero cargado con éxito");
                    request.session.datosTablero = tablero;
                    next();
                }

            });
        }
    });
}
/**
 * Ejecuta el movimiento de una carta
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function ejecutarMovimiento(request, response, next) {

    // Casilla del tablero que el usuario ha pulsado
    var casilla = {
        fila: Number(request.params.fila),
        columna: Number(request.params.columna),
        carta: request.params.carta
    };
    // 1. Obtenemos los datos de la partida
    daoPartida.leerPartidaPorId(request.params.id_partida, function (err, datos_partida) {
        if (err) {
            console.log(err);
        } else {
            
            // 1.1 Obtenemos los datos del tablero
            daoTablero.leerTableroPorId_partida(request.params.id_partida, function (err, datos_tablero) {
                if (err) {
                    console.log(err);
                } else {
                    var tablero = toolTablero.transformarTablero(datos_tablero);    // 1.1. Transformamos el tablero a un array[columans:{filas}]
                    var movsPosibles = toolTablero.getMovimientosPosibles(tablero, casilla.carta); // 1.2. Calculamos los movimientos posibles desde la posicion de comienzo hasta esa ficha
                    var candidato = _.where(movsPosibles, {// 1.3. Buscamos un candidato dentro de los movsPosibles
                        fila: casilla.fila,
                        columna: casilla.columna
                    });
                    // ### 1.3.1 Si no es un candidato
                    if (candidato.length === 0) {
                        console.log('AVISO: El movimiento no conecta con la casilla de comienzo');
                        next(new Error('El movimiento no conecta con la casilla de comienzo.'));
                    } else {//  1.3.2 Si sí es un candidato
                        // 2. Obtenemos l rol del usuario
                        daoJuegan.leerRolByUsuario(request.session.usuario, request.params.id_partida, function (err, rol) {
                            if (err) {
                                console.log(err);
                            } else {
                                // 2.1. Modificamos los  turno_restantes y asignamos el siguiente turno
                                datos_partida[0].turnos_restantes -= 1;
                                datos_partida[0].turno = helpers.getSiguienteTurno(datos_partida[0].nombre_jugadores, datos_partida[0].turno);
                                // 3. Obtenemos las casillasOcultas si estan en el siguiente movimiento
                                var casillasOcultas = toolTablero.getCasillasOcultas(tablero, casilla); 
                                var hayGanador = (_.where(casillasOcultas, {carta: 'Gold'}).length > 0 && rol === 'buscador');

                                if (casillasOcultas.length > 0) {
                                    request.session.casillasOcultas = {hay: true, casillasOcultas: casillasOcultas}; 
                                } else {
                                    request.session.casillasOcultas = {hay: false, casillasOcultas: null}; // ### terminar en el tablero
                                }

                                if (hayGanador) {
                                    // 3.1. Buscamos en la tabla 'Partida' con el 'turno' (nombre) el 'rol' al que pertenece (en la tabla 'juegan')
                                    // y buscamos todos los 'nombres' que tengan ese 'rol' en esa 'partida' -> nombreGanadores
                                    daoPartida.leerGanadoresPorRol(request.params.id_partida, rol, function (err, ganadores) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var nombreGanadores = _.pluck(ganadores, 'usuario').join(' ');
                                            datos_partida[0].ganador = nombreGanadores;
                                            datos_partida[0].estado = 'terminada';

                                            request.session.success = {
                                                isSuccess: true,
                                                msg: '¡Enhorabuena, has ganado la partida!'
                                            };
                                            console.log('AVISO: la partida ha terminado');
                                        }
                                    });
                                } else if (datos_partida[0].turnos_restantes === 0) { // 3.2. No quedan más turnos
                                    daoPartida.leerGanadoresPorRol(request.params.id_partida, 'saboteador', function (err, ganadores) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var nombreGanadores = _.pluck(ganadores, 'usuario').join(' ');
                                            datos_partida[0].ganador = nombreGanadores;
                                            datos_partida[0].estado = 'terminada';

                                            request.session.success = {
                                                isSuccess: true,
                                                msg: 'La partida ha terminado por falta de turnos. Ganan los Saboteadores.'
                                            };
                                            console.log('AVISO: la partida ha terminado, ganan los saboteadores');

                                        }
                                    });
                                } else {
                                    request.session.success = {
                                        isSuccess: true,
                                        msg: '¡Buen movimento!'
                                    };
                                }

                                daoTablero.modificarCarta_Coordenadas(request.params.id_partida, request.params.fila, request.params.columna, request.params.carta, function (err, result) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        daoPartida.modificarPartida(datos_partida[0], function (err, datos_partida) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                // 1. Generamos una nueva carta normal aleatoria
                                                var nuevaCarta = helpers.getCartaAleatoria();
                                                var cartas_juegan = {
                                                    nueva: nuevaCarta,
                                                    id_partida: request.params.id_partida,
                                                    id_usuario: request.session.id_usuario,
                                                    id_carta: request.params.carta
                                                }

                                                // 3. La insertamos en la posición donde estaba la otra carta (la que se quiere descartar)
                                                var id = request.session.id_cartas_juegan;
                                                daoCartasJuegan.modificarCartas_Juegan(id, cartas_juegan.nueva, function (err, callback) {
                                                    if (err)
                                                        console.log(err);
                                                    else {
                                                        console.log('AVISO: Partida guardada con éxito');
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
            
        }
    });
}
/**
 * Inicializa un tablero
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function inicializarTablero(request, response, next) {
    var dato = {
        id_partida: request.params.id_partida,
        fila: 0,
        columna: 0,
        carta: ''
    };
    // Insertamos todas las filas y columnas
    for (var i = 1; i < 8; i++) { // i = filas
        for (var j = 1; j < 8; j++) { // j = columnas
            dato.fila = i;
            dato.columna = j;
            daoTablero.insertarTableros_Partidas(dato.id_partida, dato.fila, dato.columna, dato.carta, function (err, result) {
                if (err)
                    console.log(err);
            });
        }
    }
    // Modificamos la casilla de inicio y las finales
    // Metemos la casilla 'start'
  
    daoTablero.modificarCarta_Coordenadas(dato.id_partida, 4, 1, 'Start', function (err, result) {
        if (err){
            console.log(err);
        }
        else{
            var destino = ['NoGold','Gold','NoGold'];
            var indiceAleatorio = _.random(0, 2);
            var elemento = destino[indiceAleatorio];
            destino.splice(indiceAleatorio,1);
                // Metemos la casilla ''
            daoTablero.modificarCarta_Coordenadas(dato.id_partida, 2, 7, elemento, function (err, result) {
                if (err){
                    console.log(err); 
                }else{
                    indiceAleatorio = _.random(0, 1);
                    var elemento = destino[indiceAleatorio];
                    destino.splice(indiceAleatorio,1);
                    // Metemos la casilla 'desconocido'
            daoTablero.modificarCarta_Coordenadas(dato.id_partida, 4, 7, elemento, function (err, result) {
                 if (err){
                        console.log(err); 
                    }else{

                    // Metemos la casilla 'desconocido'
                    daoTablero.modificarCarta_Coordenadas(dato.id_partida, 6, 7, destino[0], function (err, result) {
                        if (err){
                            console.log(err); 
                        }else{
                             console.log("AVISO: Tablero creado con éxito");
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
/**
 * Carga las cartas de un jugador (o sea, sus imágenes)
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function cargarCartasJugador(request, response, next) {
    daoCartasJuegan.leerCartas_Juegan(request.session.id_usuario, request.params.id_partida, function (err, datos_cartas_normales) {
        if (err) {
            next(err);
        } else {
            var datos = {
                id_partida: request.params.id_partida,
                id_usuario: request.session.id_usuario,
                activa: 1
            };
            daoCartasEspeciales.leerCartas_PartidasPorId(datos, function (err, datos_cartas_especiales) {
                if (err) {
                    console.log(err);
                } else {
                    var cartas_especiales = _.pluck(datos_cartas_especiales, "id_carta");
                    //var cartas_jugador = _.pluck(datosCartasJugador, "id_carta");

                    request.session.datosCartasJugador = {normales: datos_cartas_normales, especiales: datos_cartas_especiales};
                    next();
                }
            });
            //var cartas_especiales =['Bomba','Lupa','PicoRoto','PicoArreglado'];
            //request.session.datosCartasJugador = cartas;
        }
    });
}
/**
 * Carga los comentarios de una partida
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function cargarComentarios(request, response, next) {
    daoComentario.leerComentariosPorPartida(request.params.id_partida, function (err, resultado) {
        if (err)
            console.log(err);
        else {
            for (var i = 0; i < resultado.length; i++) {
                resultado[i].fecha = helpers.transformarFecha(resultado[i].fecha);
            }
            request.session.comentarios = resultado;
            console.log("AVISO: Comentarios cargados con éxito");
            next();
        }
    });
}
/**
 * Inserta un comentario en una partida
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function guardarComentario(request, response, next) {
    var comentario = {
        id_partida: request.params.id_partida,
        id_usuario: request.session.id_usuario,
        fecha: new Date(),
        comentario: request.body.comentario
    }
    console.log(comentario);
    daoComentario.insertarComentario(comentario, function (err, callback) {
        if (err)
            console.log(err);
        else {
            request.session.success = {
                isSuccess: true,
                msg: '¡Excelente comentario!'
            };
            console.log("AVISO: Comentario realizado con éxito");
            next();
        }
    });
}
/**
 * Descarta y sustituye una carta normal de forma aleatoria
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */

function descartarCarta(request, response, next) {
    // 1. Generamos una nueva carta normal aleatoria
    var nuevaCarta = helpers.getCartaAleatoria();
    var cartas_juegan = {
        nueva: nuevaCarta,
        id_partida: request.params.id_partida,
        id_usuario: request.session.id_usuario,
        id_carta: request.params.carta
    };
    // 2. Leemos el id de la tabla 'cartas_juegan'
    daoCartasJuegan.leerCartaPorIdTabla(cartas_juegan, function (err, resultado) {
        if (err)
            console.log(err);
        else {
            // 3. La insertamos en la posición donde estaba la otra carta (la que se quiere descartar)
            daoCartasJuegan.modificarCartas_Juegan(resultado[0].id_cartas_juegan, cartas_juegan.nueva, function (err, callback) {
                if (err)
                    console.log(err);
                else {
                    // 4. Obtenemos los datos de la partida (para modificar el turno)
                    daoPartida.leerPartidaPorId(request.params.id_partida, function (err, datos_partida) {
                        if (err) {
                            console.log(err);
                        } else {
                            // 5. Modificamos los  'turno_restantes' y asignamos el siguiente 'turno'
                            datos_partida[0].turnos_restantes -= 1;
                            datos_partida[0].turno = helpers.getSiguienteTurno(datos_partida[0].nombre_jugadores, datos_partida[0].turno);
                            daoPartida.modificarPartida(datos_partida[0], function (err, callback) {
                                if (err)
                                    console.log(err);
                                else {
                                    console.log("AVISO: Carta descartada con éxito");
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
function bomba(request, response, next) {
    console.log('<--- bomba');
    // 1.Modificamos las cordenadas
    daoTablero.modificarCarta_Coordenadas(request.params.id_partida, request.params.fila, request.params.columna, "", function (err, result) {
        if (err) {
            console.log(err);
        } else {
            // 2. Obtenemos los datos de la partida (para modificar el turno)
            daoPartida.leerPartidaPorId(request.params.id_partida, function (err, datos_partida) {
                if (err) {
                    console.log(err);
                } else {
                    // 3. Modificamos los  'turno_restantes' y asignamos el siguiente 'turno'
                    datos_partida[0].turnos_restantes -= 1;
                    datos_partida[0].turno = helpers.getSiguienteTurno(datos_partida[0].nombre_jugadores, datos_partida[0].turno);

                    daoPartida.modificarPartida(datos_partida[0], function (err, callback) {
                        if (err)
                            console.log(err);
                        else {
                            var datos = {activa: 0, id_carta_especial: Number(request.params.id_carta_especial)};
                            // 4. Desactivamos carta especial , poniendo activa: 0
                            daoCartasEspeciales.modificarCartas_Partidas(datos, function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("AVISO: Carta eliminada con la bomba con éxito");
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
function lupa(request, response, next) {
    console.log('<--- lupa');
    // 2. Obtenemos los datos de la partida (para modificar el turno)
    daoPartida.leerPartidaPorId(request.params.id_partida, function (err, datos_partida) {
        if (err) {
            console.log(err);
        } else {
            // 3. Modificamos los  'turno_restantes' y asignamos el siguiente 'turno'
            datos_partida[0].turnos_restantes -= 1;
            datos_partida[0].turno = helpers.getSiguienteTurno(datos_partida[0].nombre_jugadores, datos_partida[0].turno);
            daoPartida.modificarPartida(datos_partida[0], function (err, callback) {
                if (err)
                    console.log(err);
                else {
                    var datos = {activa: 0, id_carta_especial: Number(request.params.id_carta_especial)};
                    // 4. Desactivamos carta especial , poniendo activa: 0
                    daoCartasEspeciales.modificarCartas_Partidas(datos, function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("AVISO: lupa realizada con éxito");
                            request.session.casillasOcultas = {hay: true, casillasOcultas: [{fila: Number(request.params.fila), columna: Number(request.params.columna), carta: ''}]};
                            next();
                        }
                    });
                }
            });
        }
    });
}

// Exportanción de los middlewares
module.exports = {
    cargarDatosTablero: cargarDatosTablero,
    cargarCartasJugador: cargarCartasJugador,
    inicializarTablero: inicializarTablero,
    ejecutarMovimiento: ejecutarMovimiento,
    cargarComentarios: cargarComentarios,
    guardarComentario: guardarComentario,
    descartarCarta: descartarCarta,
    bomba: bomba,
    lupa: lupa
};
