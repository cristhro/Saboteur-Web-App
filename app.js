var express = require('express');   // Definimos el módulo Express
var path = require("path");         // Exportamos su única función 'app'
var app = express();                // Motor de plantillas a utilizar
var session = require("express-session");
var config = require("./config");
//var validate = require('express-validation');
//var logger = require('morgan');

var mysqlSession = require("express-mysql-session");
var MySQLStore = mysqlSession(session);
var sessionStore = new MySQLStore({host: config.dbHost,user: config.dbUser, password: config.dbPassword, database: config.dbName});
var middlewareSession = session({saveUninitialized: false,secret: "foobar34",resave: false,store: sessionStore});
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({extended: true});

app.use(urlencodeParser);
app.use(middlewareSession);
//app.use(logger('dev'));
//app.use(validate);

app.set('view engine', 'ejs');      // Directorio de las plantillas
app.set("views", path.join(__dirname, "views")); // Directorio para ficheros dinámicos
app.use(express.static(__dirname + '/public')); // Directorio para ficheros estáticos

// Middlewares
var middleGeneral = require("./middlewares/generalMiddleware");

// Controladores
var controller = require("./controllers/controller");
var usuarioController = require("./controllers/usuarioController");
var partidaController = require("./controllers/partidaController");
var jueganController = require("./controllers/jueganController");
var tableroController = require("./controllers/tableroController");


controller(app);
usuarioController(app);
partidaController(app);
jueganController(app);
tableroController(app);

// No existe la url, el último middleware que se ejecuta
app.use(middleGeneral.urlDesconocida);

// ------------------- Pone a la escucha el puerto indicado -------------------
app.listen(config.port, function(err) {
    if(err)
        console.log("Error: " + err.message);
    else
        console.log("Servidor escuchando en el puerto 3000");
});
