var express = require('express'),
    stylus  = require('stylus'),
    nib  = require('nib');

module.exports = function(app, config) {
  app.configure(function () {
    app.use(express.compress());
    app.use(express.static(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.engine('html', require('jade').__express);
    app.set('view engine', 'html');
    app.use(express.favicon(config.root + '/public/img/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(stylus.middleware({
      src: config.root + 'app/views/style',
      dest: config.root + 'public/css',
      compile: function (str, path) {
        stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib());
      }
    }));
    app.use(function(req, res) {
      res.status(404).render('404', { title: '404' });
    });
  });
};
