var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var favicon = require('serve-favicon');
var logger = require('morgan');
var parseurl = require('parseurl');

//Inicializa los modulos principales
var routes = require('./routes/home');
var CatalogoFerias = require('./routes/CatalogoFerias');
var CatalogoProductos = require('./routes/CatalogoProductos');
var ResumenPedido = require('./routes/ResumenPedido');

//Inicializa informacion de empresa.
var Nosotros = require('./routes/Nosotros');
var beneficioConsumidores = require('./routes/beneficio-consumidores');
var beneficioFeriante = require('./routes/beneficio-feriante');
var preguntas = require('./routes/Preguntas');
var politicas = require('./routes/politicas');
var Terminos = require('./routes/Terminos');


//Inicializa los modulos de Administracion
var admin = require('./routes/admin');
var adminClientes = require('./routes/adminClientes');
var adminDespacho = require('./routes/adminDespacho');
var adminFeriante = require('./routes/adminFeriante');
var adminFerias = require('./routes/adminFerias');

//Inicializa los modulos de Administracion
var resumenFeriante = require('./routes/resumenFeriante');

//Inicializa administracion de usuario
var direcUsers = require('./routes/direcUsers');
var datosUsers = require('./routes/datosUsers');
var pedidosHist = require('./routes/pedidosHist');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Seteo Icono favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Seteo Directorio Estatico 
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//Usa modulos principales inicializados anteriormente
app.use('/', routes);
app.use('/CatalogoFerias',CatalogoFerias);
app.use('/CatalogoProductos',CatalogoProductos);
app.use('/ResumenPedido',ResumenPedido);

//Usa modulos informacion de empresa.
app.use('/Nosotros',Nosotros);
app.use('/Nosotros/beneficio-consumidores',beneficioConsumidores);
app.use('/Nosotros/beneficio-feriante',beneficioFeriante);
app.use('/Nosotros/Preguntas',preguntas);
app.use('/Nosotros/politicas',politicas);
app.use('/Nosotros/Terminos',Terminos);


//Usa modulos administrativos
app.use('/admin', admin);
app.use('/adminClientes', adminClientes);
app.use('/adminDespacho', adminDespacho);
app.use('/adminFeriante', adminFeriante);
app.use('/adminFerias', adminFerias);

//Usa modulos administrativos feriante
app.use('/resumenFeriante', resumenFeriante);

//Usa modulos de usuarios
app.use('/direcUsers', direcUsers);
app.use('/datosUsers', datosUsers);
app.use('/pedidosHist', pedidosHist);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
