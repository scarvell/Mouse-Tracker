(function() {
  var app, express, i, io, m_players;

  express = require('express');

  io = require('socket.io');

  app = module.exports = express.createServer();

  io = io.listen(app);

  io.set('log level', 1);

  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  });

  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    return app.use(express.errorHandler());
  });

  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'Node.JS Sockets'
    });
  });

  app.listen(3000);

  m_players = [];

  i = 0;

  io.sockets.on('connection', function(socket) {
    console.log("New connection: " + socket);
    socket.on('client_connected', function(data) {
      data.id = socket.id;
      m_players[i] = data;
      i++;
      return io.sockets.emit("send_data", m_players);
    });
    socket.on('update_coords', function(pos) {
      var x, _ref;
      try {
        for (x = 0, _ref = m_players.length; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
          if (m_players[x].id === socket.id) {
            m_players[x].x = pos.x;
            m_players[x].y = pos.y;
            console.log("Client: " + socket.id);
            console.log("X: " + pos.x + ",  Y: " + pos.y);
            break;
          }
        }
      } catch (err) {
        console.log(err);
      }
      return io.sockets.emit("send_data", m_players);
    });
    return socket.on('disconnect', function() {
      var j, n, tmp;
      j = 0;
      n = 0;
      tmp = [];
      while (n < m_players.length) {
        if (m_players[j].id === socket.id) {
          n++;
          break;
        }
        if (n < m_players.length) {
          tmp[j] = m_players[n];
          j++;
          n++;
          break;
        }
      }
      m_players = tmp;
      i = j;
      return io.sockets.emit('send_data', m_players);
    });
  });

}).call(this);
