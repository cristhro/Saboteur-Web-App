var moment = require("moment"); // Librería para las fechas
moment.locale('es');
/**
 * Genera un número aleatorio en el intervalo [a, b]
 * @param {type} a
 * @param {type} b
 * @returns {Number}
 */
function aleatorio(a,b) {
    return Math.round(Math.random()*(b-a)+a);
}
/**
 * Funcion que devuele el siguiente turno
 * @param  String jugadores concatenados por un espacio ' '
 * @param  string turno
 * @return string siguiente_turno          [description]
 */
 function getSiguienteTurno(jugadores, turno){
     var array =jugadores.split(" "); // convertimos el string en un array
     var siguiente_turno = turno;

     // buscamos el indice del jugador que tiene el turno
     array.forEach(function (jugador, i) {
         // encontrado
         if(jugador === turno){
             //si el indice es menor al tamaño - 1 , entonces sig turno i + 1
            if(i < array.length - 1 ){
                siguiente_turno = array[i+1]
            }else{ // si no, el siguiente turno es el primer jugador
                siguiente_turno =  array[0];
            }
         }
     });
     return siguiente_turno;
 }
 function getTurnoAleatorio(jugadores){
     console.log(jugadores);
     var array = jugadores.split(" "); // convertimos el string en un array
     var posAleatorio = aleatorio(0,array.length-1);
     return array[posAleatorio];
 }
 /**
  * Devuelve el número de turnos que tendrá la partida en función de 'num_jugadores'
  * @param {type} num_jugadores
  * @returns {undefined}
  */
 function getTurnosTotales(num_jugadores){
     switch(num_jugadores){
        case 3:
            return 50;
            break;
        case 4:
            return 45;
            break;
        case 5:
            return 40;
            break;
        case 6:
            return 40;
            break;
        case 7:
            return 35;
            break;
        default:
            return 0;
            break;
     }
 }
 /**
  * Devuelve el número de saboteadores y buscadores que habrá en la partida
  * @param {type} num_jugadores
  * @returns {nm$_generalHelpers.getRoles.numRoles}
  */
 function getNumRoles(num_jugadores){
     var numRoles = {
        saboteadores: 0,
        buscadores: 0
     }
     if(num_jugadores === 3){
         numRoles.saboteadores = 1;
         numRoles.buscadores = 2;
     }else if(num_jugadores === 4){
         numRoles.saboteadores = 1;
         numRoles.buscadores = 3;
     }else if(num_jugadores === 5){
         numRoles.saboteadores = 2;
         numRoles.buscadores = 3;
     }else if(num_jugadores === 6){
         numRoles.saboteadores = 2;
         numRoles.buscadores = 4;
     }else if(num_jugadores === 7){
         numRoles.saboteadores = 2;
         numRoles.buscadores = 5;
     }
     return numRoles;
 }
 /**
  * Recibe el nombre de dos cartas y devuelve si es posible avanzar desde la 'cartaOrigen' a la 'cartaDestino'
  * @param {type} nombre
  * @param {type} x
  * @param {type} y
  * @returns {undefined}
  */
 function getDireccionValida(cartaOrigen, cartaDestino){
     var esValida = false;
     for(var i = 0; i < cartaOrigen.length; i++){
         switch(cartaOrigen[i]){
             case '1':
                 for(var j = 0; i < cartaDestino.length; j++){
                     if(cartaDestino[j] === '3')
                         esValida = true;
                 }
                 break;
             case '2':
                 for(var j = 0; i < cartaDestino.length; j++){
                     if(cartaDestino[j] === '4')
                         esValida = true;
                 }
                 break;
             case '3':
                 for(var j = 0; i < cartaDestino.length; j++){
                     if(cartaDestino[j] === '1')
                         esValida = true;
                 }
                 break;
             case '4':
                 for(var j = 0; i < cartaDestino.length; j++){
                     if(cartaDestino[j] === '2')
                         esValida = true;
                 }
                 break;
             default:
                 break;
         }
     }
 }
 /**
  * Devuelve 3 arrays (aunque sólo nos interesan 2): un array con los id_usuario, otro con sus roles
  * @param {type} ArrayUsuarios
  * @returns {nm$_toolHelpers.getRepartoRoles.arrayReparto}
  */
 function getRepartoRoles(ArrayUsuarios){
    var numRoles = getNumRoles(ArrayUsuarios.length);
    var arrayReparto = {
        ids: new Array(),
        roles: new Array(),
        asignados: new Array()
    }
    // Inicialización
    for(var i = 0; i < ArrayUsuarios.length; i++){
        arrayReparto.ids[i] = ArrayUsuarios[i].id_usuario;
        arrayReparto.asignados[i] = false;
    }
    // Reparto de saboteadores
    while(numRoles.saboteadores > 0){
        var numero = aleatorio(0, ArrayUsuarios.length - 1);
        if(arrayReparto.asignados[numero] === false){
            arrayReparto.roles[numero] = 'saboteador';
            arrayReparto.asignados[numero] = true;
            numRoles.saboteadores--;
        }
    }
    // Reparto de buscadores
    while(numRoles.buscadores > 0){
        var numero = aleatorio(0, ArrayUsuarios.length - 1);
        if(arrayReparto.asignados[numero] === false){
            arrayReparto.roles[numero] = 'buscador';
            arrayReparto.asignados[numero] = true;
            numRoles.buscadores--;
        }
    }
    return arrayReparto;
 }
 // Array de cartas (son caminos de la 0-14 posiciones)
 var cartas = ["1","2","12","3","13","23","123","4","14","24","124","34","134","234","1234",
                "Start","DNK","Gold","NoGold","Lupa","Bomba","PicoArreglado","PicoRoto"];
 /**
  * Devuelve un array con las cartas para el usuario 'id_usuario'
  * @param {type} ArrayUsuarios
  * @returns {undefined}
  */
 function getRepartoCartas(cartasJugador){
    // Metemos las cartas normales
    for(var i = 0; i < 7; i++){
        var numero = aleatorio(0, 14);
        cartasJugador.carta[i] = cartas[numero];
    }
    // Metemos las cartas especiales
    cartasJugador.carta_especial[0] = "Lupa";
    cartasJugador.carta_especial[1] = "Bomba";
    cartasJugador.carta_especial[2] = "PicoArreglado";
    cartasJugador.carta_especial[3] = "PicoRoto";
    return cartasJugador;
 }
 /**
  * Devuelve una catra normal aleatoria
  * @returns {String}
  */
 function getCartaAleatoria(){
    var numero = aleatorio(0, 14);  
    return cartas[numero];
 }
/**
 * Transforma el formato de una fecha al tipo: hace X tiempo
 * @param {type} fecha
 * @returns {undefined}
 */
function transformarFecha(fecha){
    return moment(fecha, "YYYY-DD-MM").fromNow();
}

 // Exportanción de las funciones generales de ayuda
 module.exports = {
     getTurnosTotales: getTurnosTotales,
     getNumRoles: getNumRoles,
     getDireccionValida: getDireccionValida,
     getRepartoRoles: getRepartoRoles,
     getRepartoCartas: getRepartoCartas,
     getSiguienteTurno: getSiguienteTurno,
     getTurnoAleatorio: getTurnoAleatorio,
     transformarFecha: transformarFecha,
     getCartaAleatoria: getCartaAleatoria
 }
