       
/**
 * Funcion  que devuelve el atributo de nombre 'fieldName' de cada
 * uno de los objetos contenidos en el array 'objects' de entrada. Se devolverá un array con los valores
 * correspondientes.
 * @param  {[type]} objects
 * @param  {[type]} fieldName
 * @return {[type]}  resultado : contiene todos los valores
 */
/*
    var personas = [
    {nombre: "Ricardo", edad: 63},
    {nombre: "Paco", edad: 55},
    {nombre: "Enrique", edad: 32},
    {nombre: "Adrián", edad: 34}
    ];
    pluck(personas, "nombre") // Devuelve: ["Ricardo", "Paco", "Enrique", "Adrián"]
    pluck(personas, "edad") // Devuelve: [63, 55, 32, 34]

 */
 function pluck(objects, fieldName) {
     var resultado = new Array();
     objects.forEach(function(objects) {
         resultado.push(objects[fieldName]);
     })
     return resultado;
 }

/**
 * función que que devuelve un array 'resultado' con dos arrays. El primero contendrá
 * los elementos x de array tales que p(x) devuelve true. Los restantes elementos se añadirán al segundo array
 *
 * @param  {[type]} array
 * @param  {[type]} p
 * @return {[type]} resultado
 */
/*
    partition(personas, function(pers) { return pers.edad >= 60; })
    Devuelve:
    [
    [ {nombre: "Ricardo", edad: 63} ],
    [ {nombre: "Paco", edad: 55}, {nombre: "Enrique", edad: 32},
    {nombre: "Adrián", edad: 34} ]
    ]
 */
 function partition(array, p) {
     var elemsCumplenP = new Array();
     var elemsNoCumplenP = new Array();
     var resultado = new Array();

     array.forEach(function(elem) {
         if (p(elem)) {
             elemsCumplenP.push(elem);
         } else {
             elemsNoCumplenP.push(elem);
         }
     });
     resultado.push(elemsCumplenP);
     resultado.push(elemsNoCumplenP);
     return resultado;
 }
 /**
  * función  que recibe un array, una función clasificadora f, y reparta los
  * elementos del array de entrada en distintos arrays, de modo que dos elementos pertenecerán al mismo
  * array si la función clasificadora devuelve el mismo valor para ellos. Al final se obtendrá un objeto cuyos
  * atributos son los distintos valores que ha devuelto la función clasificadora, cada uno de ellos asociado a su
  * array correspondiente.
  *
  * @param  {[type]} array
  * @param  {[type]} f
  * @return {[type]} resultado
  */
 /*
    groupBy(["Mario", "Elvira", "María", "Estela", "Fernando"],
    function(str) { return str[0]; }) // Agrupamos por el primer carácter

    Devuelve el objeto:
     { "M" : ["Mario", "María"], "E" : ["Elvira", "Estela"], "F" : ["Fernando"] }

  */
 function groupBy(array, f) {
     var elemInicial = {};
     var resultado;

     resultado = array.reduce(function funcionClasificadora(acumulador, elem) {
         var primerCaracter = f(elem);

         if (!(`${primerCaracter}` in acumulador)) { // comprueba si el 'primerCaracter' es uno de los atributos del objeto 'acumulador'
             acumulador[primerCaracter] = [elem];
         } else {
             acumulador[primerCaracter].push(elem);
         }
         return acumulador;
     }, elemInicial);
     return resultado;
 }
 /*
 * función  que recibe un array de objetos y un objeto modelo. La función
 * ha de devolver aquellos objetos del array que contengan todos los atributos contenidos en modelo con los
 * mismos valores.

 * @param  {[type]} array
 * @param  {[type]} modelo
 * @return {[type]}        [description]
 */
/*
    where(personas, { edad: 55 })
     devuelve [ { nombre: 'Paco', edad: 55 } ]
    where(personas, { nombre: "Adrián" })
     devuelve [ { nombre: 'Adrián', edad: 34 } ]
    where(personas, { nombre: "Adrián", edad: 21 })
     devuelve []
 */
 function where(array, modelo) {
     var objetos;
     objetos = array.filter(function(elemArray) {
         var test = true;
         var keys = Object.keys(modelo);
         keys.forEach(function(elemKeys){
             if(!(elemArray.hasOwnProperty(elemKeys) &&
             (modelo[elemKeys] === elemArray[elemKeys])))
                 test = false;
         });
         return test;

     });
     return objetos;
 }

// Exportanción de las funciones de ayuda con arrays
 module.exports = {
     pluck : pluck,
     partition : partition,
     groupBy : groupBy,
     where : where
 }
