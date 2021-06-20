 
var net = require('net');
var dgram = require('dgram');
var moment = require('moment');


const PORT_UDP = 9907;
// Multicast address
const ADDRESS_MULTICAST = '239.255.22.5';

const PORT_TCP = 2205;

const musicians = new Map()


const instruments = {
   'ti-ta-ti': 'piano',
   'pouet': 'trumpet',
   'trulu': 'flute',
   'gzi-gzi': 'violin',
   'boum-boum': 'drum'
};

var socket = dgram.createSocket('udp4');
socket.bind(PORT_UDP, function() {
    socket.addMembership(ADDRESS_MULTICAST);
});

socket.on('message', function(message, src) {
    console.log("Received: " + message);
    const payload = JSON.parse(message);

    var musician = {
        uuid: payload.uuid,
        instrument: instruments[payload.sound],
        activeSince: moment().format()
    }

    musicians.set(musician.uuid, musician);
})

// Create TCP server
var serverTcp = net.createServer();

serverTcp.listen(PORT_TCP, console.log("TCP server started"));

serverTcp.on('connection', function( client ) {

    console.log("new client connected");

    // Test that there are no "dead" musicians (activeSince < 5)
    musicians.forEach((value, key) => {
        if(moment().diff(value.activeSince, 'seconds') >= 5) {
            musicians.delete(key);        
        }
    });

    // Send a list of musicians to the client
    client.write(JSON.stringify(Array.from(musicians.values())));

    client.end();
    
});

