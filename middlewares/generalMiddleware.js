var _ = require("underscore"); // Librería para manejar los arrays
/**
 * Middleware por si la URL no ha sido encontrada
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function urlDesconocida(request, response, next) {
    response.status(404);
    response.render("error_urlDesconocida", { url: request.url });
    response.end();
}
/**
 * Middleware de error interno en el servidor
 * @param {type} error
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function falloInterno(error, request, response, next) {
    request.session.error = {isError: true, msg: error};
    request.session.success = {isSuccess: false, msg: ''};
    next();
}
/**
 * Muestra las petición recibida del cliente
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
function inicio(request, response, next){

    request.session._= _;
    request.session.casillasOcultas = {casillasOcultas: { hay: false, casillasOcultas: null}};
    request.session.success = {isSuccess : false, msg:''};
    request.session.error = {isError : false, msg:''};
    console.log(`Recibida petición ${request.method} ` +
                `en ${request.url} de ${request.ip}`);
    next();
}
/**
 * Bloquea el acceso a determinadas IPs
 * @param {type} request
 * @param {type} response
 * @param {type} next
 * @returns {undefined}
 */
var ipsCensuradas = [ "147.96.81.244", "145.2.34.23" ];
function idBloqueada(request, response, next) {
    // Comprobamos si la IP que nos llega de la petición está en el array 'ipsCensuradas'
    if (ipsCensuradas.indexOf(request.ip) >= 0) {
        response.status(550);
        response.render("error_ipBloqueada");
        response.end();
    } else
        next();
}
// Exportanción de los middlewares
module.exports = {
    urlDesconocida: urlDesconocida,
    falloInterno: falloInterno,
    inicio: inicio,
    idBloqueada: idBloqueada
};
