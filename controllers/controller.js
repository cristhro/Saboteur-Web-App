// Middlewares
var middleGeneral = require("../middlewares/generalMiddleware");
/**
 * Peticiones de tipo GET
 * @param {type} app
 * @returns {undefined}
 */
module.exports = function (app) {
    // -----------------------------------------------------------------------------------------------------
    app.get('/', middleGeneral.inicio, function (request, response, next) {
        request.render('index');
    });
    // -----------------------------------------------------------------------------------------------------
    app.get("/login", middleGeneral.inicio, function (request, response, next) {
        response.render('login', {error: { isError: false, msg: null },
        success: { isSuccess: false, msg: null }});
    });
    // -----------------------------------------------------------------------------------------------------
    app.get("/register", middleGeneral.inicio, function (request, response, next) {
        response.render('register',{
                error: request.session.error,
                success: request.session.success
            });
    });
    // -----------------------------------------------------------------------------------------------------
    app.get("/newgame", middleGeneral.inicio, function (request, response, next) {
        response.render('newgame', {
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: { isError: false, msg: null },
        success: { isSuccess: false, msg: null }});
    });
    // -----------------------------------------------------------------------------------------------------
}
