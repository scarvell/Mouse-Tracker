## Mouse Tracker
   A nodejs socket mouse tracking application

##Installation

Make sure you have the latest node, coffee-script and npm installed. To run:
    coffee app.coffee

You can install any missing dependencies with:
    npm install -d

Modify line 25 in views/layout.jade to point to the correct IP if you're testing with multiple computers:
    var socket = io.connect('http://10.0.1.11:3000');
