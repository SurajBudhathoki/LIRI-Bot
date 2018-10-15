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

//executing the function depending on user commands
function chooseCommand(command, userInput){

    if(command  === "spotify-this-song"){
        
        if(userInput === undefined) {
            userInput = "What's my age again";
        }
            spotifyCommand();
    }
    else if (command === "do-what-it-says"){
            doWhatItSays();
    }
}



//function to spotify-this-song command
let spotifyCommand = function(song) {
    
    spotify.search({ type: 'track', query: userInput }, function(err, data) {

        if (err) {
          return console.log('Error occurred: ' + err);
        };
       
        song = data.tracks.items;
    
        for(let i =0; i < song.length; i++) {
            console.log("----------------------------------------------------");
            console.log("Artist name: " + song[i].album.artists[i].name);   
            console.log("Song name: " + song[i].name); 
            console.log("Song Preview: " +song[i].external_urls.spotify);
            console.log("Album name: " + song[i].album.name); 
            console.log("----------------------------------------------------");
        }
     
      })

}

let doWhatItSays = function(){

    fs.readFile('random.txt', 'utf8', function(err, data){

        if (err){ 
			return console.log(err);
        }
        
        let arr = data.split(',');
        console.log(arr[0],arr[1]);
        //spotifyCommand(arr[1]);
        //chooseCommand(arr[0],arr[1]);
    });
}






//Executing the function
chooseCommand(command, userInput);

