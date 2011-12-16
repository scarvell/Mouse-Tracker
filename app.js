
/**
 * Module dependencies.
 */

var express = require('express');
var io = require('socket.io');
var app = module.exports = express.createServer();

var io = io.listen(app);

// Configuration
io.set('log level', 1); // Turn off annoying poll notice

app.configure(function(){
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index.html', {
    title: 'Node.JS Sockets',
  });
});

app.listen(3000);

// Player information 
var m_players = [];
var i = 0; // Used for how many players are connected

io.sockets.on('connection', function(socket) {
  console.log("New connection: " + socket);
  
  socket.on('client_connected', function(data){
    data.id = socket.id;
    m_players[i] = data;
    i++;
    io.sockets.emit("send_data", m_players)
   });
   
   socket.on('update_coords', function(pos){
     
     for(var x=0; x < m_players.length; x++)
     {
       if (m_players[x].id == socket.id)
       { 
         m_players[x].x = pos.x;
         m_players[x].y = pos.y;
         
         console.log("Client: " + socket.id);
         console.log("X: " + pos.x + ",  Y: " + pos.y );
         break;
       }
     }
     
     io.sockets.emit("send_data", m_players);
   });
   
   socket.on('disconnect', function()
   {
     var j = 0;
     var n = 0;
     var tmp = [];

     while (n < m_players.length)
     {
       if (m_players[j].id == socket.id)
     	   n++;
     	 
     	 if (n < m_players.length)
     	 {
     	   tmp[j] = m_players[n];
     	   j++;
     	   n++;
     	  }
     	}
     	
     	m_players = tmp;
     	i = j;
       io.sockets.emit('send_data', m_players);
   });
});