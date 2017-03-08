var _= require("underscore");
/**
 * [transformarTablero description]
 * @param  [{filas, columnas, cartas}]        datos_tablero
 * @return {columnas:[ filas : [ ]]}      tablero
 */
function transformarTablero(datos_tablero) {
    // 1 Transformamos el tablero a un array[columans:{filas}]
    var tablero = {
        columnas: []
    };
    // para el numero de columnas
    for (var i = 0; i < 7; i++) {
        // agrupo todos los elementos del 'tablero' en los que la 'fila' sea la misma
        var fila = _.where(datos_tablero, {
            fila: i + 1
        });
        // ordeno los elementos agrupados de menor a mayor
        fila.sort(function(a, b) {
            return a.columna - b.columna;
        });
        // guardamos en la fila i toda la lista de
        tablero.columnas[i] = {
            fila: fila
        };
    }
    return tablero;
}
/**
 *  Funcion que modifica un tablero segun un array que contiene las casilla ocultas que se tienen que mostrar , ya que un jugador a alcanzado esa casilla
 * @param  {[type]} tablero
 * @param  {[type]} casillasOcultas
 * @return {[type]}                 [description]
 */
function cambiarGoldNoGold_PorDNK(tablero, casillasOcultas){
    tablero.columnas.forEach(function (filas,f) {
        var fila ='';
        filas.fila.forEach(function (columna,c) {

            if (columna.carta === 'Gold' || columna.carta === 'NoGold' ){
                if (casillasOcultas.hay === false) { /* Si es true, recorremos todas las que estan en la lista u vemos que coinciden en fila y columna*/
                    columna.carta = 'DNK';
                }else{

                    ocultas = _.where(casillasOcultas.casillasOcultas,{fila:f+1, columna:c+1}); // si hay cartas a destapar  que han sido alcanzadas por un jugador
                    if (ocultas.length === 0) { // si no hay ninguna se muestra DNK
                        columna.carta = 'DNK';
                    }
                }
             }
        });
    });
    return tablero;
}
/**
 * Funcion que muestra el tablero por consola
 * @param  {columnas: [fila : []]} tablero
 */
function mostrarTablero(tablero){
    tablero.columnas.forEach(function (filas,i) {
        var fila ='';
        filas.fila.forEach(function (columna,j) {
               if(columna.carta === ''){
                   fila +=  ' - ';
               }else if(columna.carta === 'Start'){
                   fila += ' S ';
               }else if (columna.carta === 'DNK'){
                   fila += ' D ';
               }else if (columna.carta === 'Gold'){
                   fila += ' G ';
               }else if (columna.carta === 'NoGold'){
                   fila += ' N ';
               }else{
                   fila +=  ' '+ columna.carta + ' ';
               }
        });
        console.log(fila);
    });
}
/**
 * Funcion que devuelve el contenido de un tablero a partir de la fila y columna
 * @param  {[type]} tablero
 * @param  {[type]} f
 * @param  {[type]} c
 * @return {[type]} carta
 */
function getCasilla(tablero,f, c){

    return tablero.columnas[f-1].fila[c-1];
}
function rangoValido(n,tam){
    return (n>=1 && n <= tam);
}
function getTamFilas(tablero){
    return tablero.columnas.length;
}
function getTamColumnas(tablero){
    return tablero.columnas[0].fila.length;
}
function calcMovsPosiblesRec(tablero, casilla, visitados, movPosibles, cartaAPoner){

    if(visitados.filas[casilla.fila].columnas[casilla.columna].value === false){
        // Conecto Sur con Norte
        if(casilla.carta.includes('1')){
            var filaSig = casilla.fila + 1;
            var columnaSig = casilla.columna;

            if(rangoValido(filaSig, getTamFilas(tablero)) && rangoValido(columnaSig, getTamColumnas(tablero))){
                var casillaSig = getCasilla(tablero,filaSig,columnaSig);
                if(casillaSig.carta === 'NoGold') casillaSig.carta = '1234'; // Con esto hacemos que se pueda usar como camino la carta NoGold
                if(casillaSig.carta === ''){
                    if(getDireccionValida('1',cartaAPoner)){
                        movPosibles.push(casillaSig);
                    }
                    //calcMovsPosiblesRec(tablero, ultimoVisitado, visitados, movPosibles);
                } else if (casillaSig.carta.includes('3')) {
                    visitados.filas[casilla.fila].columnas[casilla.columna]={value:true};
                    calcMovsPosiblesRec(tablero, casillaSig, visitados, movPosibles,cartaAPoner);
                }
            }
        }
        if(casilla.carta.includes('2')){
            var filaSig = casilla.fila ;
            var columnaSig = casilla.columna + 1;

            if(rangoValido(filaSig, getTamFilas(tablero)) && rangoValido(columnaSig, getTamColumnas(tablero))){
                var casillaSig = getCasilla(tablero,filaSig,columnaSig);
                if(casillaSig.carta === 'NoGold') casillaSig.carta = '1234'; // Con esto hacemos que se pueda usar como camino la carta NoGold
                if(casillaSig.carta ===''){
                    if(getDireccionValida('2',cartaAPoner)){
                        movPosibles.push(casillaSig);
                    }
                } else if (casillaSig.carta.includes('4')) {
                    visitados.filas[casilla.fila].columnas[casilla.columna]={value:true};
                    calcMovsPosiblesRec(tablero, casillaSig, visitados, movPosibles,cartaAPoner);
                }
            }
        }
        // Conecto Norte con Sur
        if(casilla.carta.includes('3')){
            var filaSig = casilla.fila - 1;
            var columnaSig = casilla.columna;

            if(rangoValido(filaSig, getTamFilas(tablero)) && rangoValido(columnaSig, getTamColumnas(tablero))){
                var casillaSig = getCasilla(tablero,filaSig,columnaSig);
                if(casillaSig.carta === 'NoGold') casillaSig.carta = '1234'; // Con esto hacemos que se pueda usar como camino la carta NoGold
                if(casillaSig.carta ===''){
                    if(getDireccionValida('3',cartaAPoner)){
                        movPosibles.push(casillaSig);
                    }
                } else if (casillaSig.carta.includes('1')) {
                    visitados.filas[casilla.fila].columnas[casilla.columna]={value:true};
                    calcMovsPosiblesRec(tablero, casillaSig, visitados, movPosibles,cartaAPoner);
                }
            }

        }
        if(casilla.carta.includes('4')){
            var filaSig = casilla.fila ;
            var columnaSig = casilla.columna -1;

            if(rangoValido(filaSig, getTamFilas(tablero)) && rangoValido(columnaSig, getTamColumnas(tablero))){
                var casillaSig = getCasilla(tablero,filaSig,columnaSig);
                if(casillaSig.carta === 'NoGold') casillaSig.carta = '1234'; // Con esto hacemos que se pueda usar como camino la carta NoGold
                if(casillaSig.carta ===''){
                    
                    if(getDireccionValida('4',cartaAPoner)){
                        movPosibles.push(casillaSig);
                    }
                } else if (casillaSig.carta.includes('2')) {
                    visitados.filas[casilla.fila].columnas[casilla.columna]={value:true};
                    calcMovsPosiblesRec(tablero, casillaSig, visitados, movPosibles,cartaAPoner);
                }
            }
        }
    }
}
function getMovimientosPosibles(tablero, cartaAPoner){
    var visitados = {filas:[]};
    var movPosibles = [];
    var casillaInicial = {carta:'123', fila: 4, columna: 1};

        for (var i = 1; i <= 7; i++) {
            var fila = {columnas:[]}
            for (var j = 1; j <= 7; j++) {
                fila.columnas[j]={value:false};
            }
            visitados.filas[i]= fila;
        }
	calcMovsPosiblesRec(tablero, casillaInicial, visitados, movPosibles, cartaAPoner);
        
    return movPosibles;
}
function getDireccionValida(cartaOrigen, cartaDestino) {
    var valida = false;
        if(cartaOrigen.includes('1') && cartaDestino.includes('3')){
            valida = true;
        }else if(cartaOrigen.includes('2') && cartaDestino.includes('4')){
            valida = true;
        }else if(cartaOrigen.includes('3') && cartaDestino.includes('1')){
            valida = true;
        }else if(cartaOrigen.includes('4') && cartaDestino.includes('2')){
            valida = true;
        }
    return valida;
}
function getCasillasOcultas(tablero, casilla){
    var casillasOcultas = [];

    if(casilla.carta.includes('1')){
        var filaSig = casilla.fila + 1;
        var columnaSig = casilla.columna;

        if(rangoValido(filaSig, getTamFilas(tablero)) && rangoValido(columnaSig, getTamColumnas(tablero))){
            var casillaSig = getCasilla(tablero,filaSig,columnaSig);
                if(casillaSig.carta==='Gold' || casillaSig.carta==='NoGold')
                    casillasOcultas.push(casillaSig);
        }
    }
    if(casilla.carta.includes('2')){
        var filaSig = casilla.fila ;
        var columnaSig = casilla.columna + 1;

        if(rangoValido(filaSig, getTamFilas(tablero)) && rangoValido(columnaSig, getTamColumnas(tablero))){
            var casillaSig = getCasilla(tablero,filaSig,columnaSig);
            if(casillaSig.carta==='Gold' || casillaSig.carta==='NoGold')
                casillasOcultas.push(casillaSig);
        }
    }
    // Conecto Norte con Sur
    if(casilla.carta.includes('3')){
        var filaSig = casilla.fila - 1;
        var columnaSig = casilla.columna;

        if(rangoValido(filaSig, getTamFilas(tablero)) && rangoValido(columnaSig, getTamColumnas(tablero))){
            var casillaSig = getCasilla(tablero,filaSig,columnaSig);
            if(casillaSig.carta==='Gold' || casillaSig.carta==='NoGold')
                casillasOcultas.push(casillaSig);
        }

    }
    if(casilla.carta.includes('4')){
        var filaSig = casilla.fila ;
        var columnaSig = casilla.columna - 1;

        if(rangoValido(filaSig, getTamFilas(tablero)) && rangoValido(columnaSig, getTamColumnas(tablero))){
            var casillaSig = getCasilla(tablero,filaSig,columnaSig);
            if(casillaSig.carta==='Gold' || casillaSig.carta==='NoGold')
                casillasOcultas.push(casillaSig);
        }
    }
    return casillasOcultas;
}

// Exportanción de las funciones de ayuda con arrays
 module.exports = {
     getDireccionValida :getDireccionValida,
     transformarTablero : transformarTablero,
     mostrarTablero : mostrarTablero,
     getCasilla : getCasilla,
     getMovimientosPosibles : getMovimientosPosibles,
     getCasillasOcultas:getCasillasOcultas,
     cambiarGoldNoGold_PorDNK:cambiarGoldNoGold_PorDNK
 }
