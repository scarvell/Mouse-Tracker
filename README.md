## Mouse Tracker
   A nodejs socket mouse tracking application
   
   Demo: https://www.youtube.com/watch?v=U_1Svs4c3i4
   
##Installation

Make sure you have the latest node, coffee-script and npm installed. To run:

    $ coffee app.coffee

For those coffee haters, I have compiled it to native javascript. To run:

    $ node app.js

You can install any missing dependencies with:

    $ npm install -d

Modify line 25 in views/layout.jade to point to the correct IP of the server:

    var socket = io.connect('http://10.0.1.11:3000');
