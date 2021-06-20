var dgram = require('dgram');
var socket = dgram.createSocket('udp4'); 

const {v4 : uuidv4} = require('uuid');

// delay between each sound
const DELAY = 1000;
const PORT = 9907;
// Multicast address
const ADDRESS = '239.255.22.5';

const sounds = {
    piano: 'ti-ta-ti',
    trumpet: 'pouet',
    flute: 'trulu',
    violin: 'gzi-gzi',
    drum: 'boum-boum'
 };
 
console.log(process.argv.length);
if(process.argv.length != 3) {
    console.log("Missing or too many arguments.");
    process.exit(1);
}

const sound = sounds[process.argv[2]];

if(sound == null) {
console.log("Invalid instrument. Must be: piano, trumpet, flute, violin, drum");
process.exit(1);
}

// Get id
const id = uuidv4();


setInterval(() => playSound(id, sound), DELAY);

function playSound (id, sound) {
    const payload = {
        uuid: id,
        sound: sound,
        activeSince: new Date().toISOString()
    }

    const message = JSON.stringify(payload);
    socket.send(message, 0, message.length, PORT, ADDRESS, console.log("Sending: " + message));
}

