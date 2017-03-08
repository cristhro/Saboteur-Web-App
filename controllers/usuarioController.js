// DAOs
var config = require("../config");
var DAOUsuarios = require("../integration/DAOUsuarios");
var daoUsuario = new DAOUsuarios(config.dbHost, config.dbUser, config.dbPassword, config.dbName);

// Middlewares
var middleUsuario = require("../middlewares/usuarioMiddleware");
var middleGeneral = require("../middlewares/generalMiddleware");

 var multer = require("multer");
 var upload = multer({
    storage: multer.memoryStorage()
});

module.exports = function(app){
    // -----------------------------------------------------------------------------------------------------
    app.post('/tablero/daoInsertar_Usuario',upload.single("imagen"), middleGeneral.inicio, middleUsuario.guardarUsuario, middleGeneral.falloInterno, function(request, response) {
        if(request.session.success.isSuccess){
            response.render('login', {
                error: null,
                success:request.session.success
            });
        }else{
            response.render('register', {
                error: request.session.error,
                success: request.session.success
            });
        }
    });
    // -----------------------------------------------------------------------------------------------------
    app.post('/usuario/daoVerificar_usuario', middleGeneral.inicio, middleUsuario.verificarUsuario, middleUsuario.cargarDatosPerfil, middleGeneral.falloInterno, function(request, response){
        if(request.session.success.isSuccess){
            response.render('profile', {
                datosPerfil: request.session.datosPerfil,
                usuario: request.session.usuario,
                id_usuario: request.session.id_usuario,
                error: request.session.error,
                success:request.session.success
            });
        }else{
            response.render('login', {
                error: request.session.error,
                success: request.session.success
            });
        }
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/usuario/profile', middleGeneral.inicio, middleUsuario.cargarDatosPerfil, middleGeneral.falloInterno, function(request, response){
        response.render('profile', {
            datosPerfil: request.session.datosPerfil,
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/usuario/joingame', middleGeneral.inicio, middleUsuario.cargarDatosPerfil, middleGeneral.falloInterno, function(request, response){
        response.render('joingame', {
            datosPerfil: request.session.datosPerfil,
            usuario: request.session.usuario,
            id_usuario: request.session.id_usuario,
            error: request.session.error,
            success: request.session.success
        });
    });
    // -----------------------------------------------------------------------------------------------------
    app.get('/usuario/close', middleGeneral.inicio, middleUsuario.cerrarSession, middleGeneral.falloInterno, function(request, response){
        response.render('close');
    });
    // -----------------------------------------------------------------------------------------------------
   app.get("/usuario/obtenerImagen/:id_usuario", function (req, res) {
    console.log('<--- GET: /obtenerImagen');
    var id_usuario = Number(req.params.id_usuario);
    
    if (!isNaN(id_usuario)) {
        daoUsuario.obtenerImagen(id_usuario, function (err, result) {
            if (err) {
                console.log(err);
                console.log("ERROR en DAO: no se ha podido leer la imagen");
                res.status(500);
                res.end;
            } else {
                var imagen = result[0].foto;
                res.status(200);
                console.log("AVISO: Imagen cargada con exito");
                res.end(imagen);
            }
        });
    } else {
        res.status(404);
        res.end();
    }
});
};
