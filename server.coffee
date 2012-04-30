express = require 'express'
io = require 'socket.io'
app = module.exports = express.createServer();

io = io.listen app

## Configuration
io.set 'log level', 1 # Turn off annoying poll notice

app.configure () ->
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(__dirname + '/public')

app.configure 'development', () ->
  app.use express.errorHandler({ dumpExceptions: true, showStack: true })

app.configure 'production', () ->
  app.use express.errorHandler() 

app.get '/', (req, res) ->
  res.render 'index', { title: 'Node.JS Sockets'}

app.listen 3000

##Player information 
m_players = [];
i = 0 # Used for how many people are connected

io.sockets.on 'connection', (socket) ->
  console.log "New connection: #{socket}"
  
  socket.on 'client_connected', (data) ->
    data.id = socket.id
    m_players[i] = data
    i++
    io.sockets.emit "send_data", m_players 
   
   socket.on 'update_coords', (pos) ->
     try
       for x in [0..m_players.length]
         if m_players[x].id == socket.id
           m_players[x].x = pos.x;
           m_players[x].y = pos.y;
         
           console.log "Client: #{socket.id}"
           console.log "X: #{pos.x},  Y: #{pos.y}"
           break
     catch err
        console.log err
     io.sockets.emit("send_data", m_players);
   
   socket.on 'disconnect', () ->
     j = 0
     n = 0
     tmp = []

     while n < m_players.length
       if m_players[j].id == socket.id
     	   n++
     	   break
     	 
     	 if n < m_players.length
     	   tmp[j] = m_players[n]
     	   j++
     	   n++
     	   break
     	
     	m_players = tmp;
     	i = j;
      io.sockets.emit 'send_data', m_players