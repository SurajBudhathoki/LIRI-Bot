require('dotenv').config();

const keys = require("./keys");

const Spotify = require('node-spotify-api');

const fs = require('fs');

const request = require('request');

const spotify = new Spotify ({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

let command = process.argv[2];
let userInput = process.argv[3];


for(let i = 4; i < process.argv.length; i++) {
    userInput +=  process.argv[i];
}

let spotifyCommand = function(song) {
    
    spotify.search({ type: 'track', query: userInput }, function(err, data) {

        if (err) {
          return console.log('Error occurred: ' + err);
        };
       
        let info = data.tracks.items;
    
        for(let i =0; i < info.length; i++) {
            console.log("----------------------------------------------------");
            console.log("Artist name: " + info[i].album.artists[i].name);   
            console.log("Song name: " + info[i].name); 
            console.log("Song Preview: " +info[i].external_urls.spotify);
            console.log("Album name: " + info[i].album.name); 
            console.log("----------------------------------------------------");
        }
     
      })

}

function chooseCommand(command){

    if(command  === "spotify-this-song"){
        
        if(userInput === undefined) {
            userInput = "What's my age again";
        }
            spotifyCommand();
        }
}

chooseCommand(command);

