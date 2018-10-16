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

let movieName = '';
let artistname = '';

for(let i = 3; i < process.argv.length; i++) {
    movieName +=  process.argv[i];
}

for(let i = 3; i < process.argv.length; i++) {
    artistname +=  process.argv[i];
}

//executing the function depending on user commands
function chooseCommand(command, userInput){

    if(command  === "spotify-this-song"){
            spotifyCommand();
    }
    else if (command === "do-what-it-says"){
            doCommand();
    }
    else if (command === "concert-this"){
        concertCommand();
    }
    else if (command === "movie-this"){
        movieCommand();
    }
}



//function to spotify-this-song command
let spotifyCommand = function(song) {
    
    if(userInput === undefined) {
        userInput = "What's my age again";
    }

    spotify.search({ type: 'track', query: userInput, limit: 1 }, function(err, data) {
                 
      
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

let doCommand = function(){

    fs.readFile('random.txt', 'utf8', function(err, data){

        if (err){ 
			return console.log(err);
        }
        
        let arr = data.split(',');
        console.log(arr[0],arr[1]);
        //spotifyCommand(arr[1]);
       // chooseCommand(arr[0],arr[1]);

       spotify.search({ type: 'track', query: arr[1], limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
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
    })
}

let concertCommand = function(){
    request(`https://rest.bandsintown.com/artists/${artistname}/events?app_id=codingbootcamp`,
    function(error,response,body){
        
        if (!error && response.statusCode === 200) {
  
        console.log("-------------------Upcoming Events---------------------------\n");  

        concert =  JSON.parse(body);

            for(let i=0; i < concert.length; i++){
    
               
            console.log(`Venue Name: ${concert[i].venue.name}`);
         console.log(`Location: ${concert[i].venue.city}, ${concert[i].venue.region}`);
           console.log("----------------------------------------------------");
            } 
        } 
       
    });
}

let movieCommand = function(){
    request(`http://www.omdbapi.com/?t=${movieName}&apikey=trilogy`,
    function(error,response,body){

        
        if(userInput === undefined){
            console.log("If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
        
        if (!error && response.statusCode === 200) {

            console.log("----------------------------------------------------");
            console.log(`Movie name: ${JSON.parse(body).Title}`);
            console.log(`Year: ${JSON.parse(body).Year}`);
            console.log(`IMDB rating: ${JSON.parse(body).imdbRating}`);
            console.log(`Rotten Tomatoes rating: ${JSON.parse(body).Ratings[1].Value}`);
            console.log(`Country: ${JSON.parse(body).Country}`);
            console.log(`Language: ${JSON.parse(body).Language}`);
            console.log(`Plot: ${JSON.parse(body).Plot}`);
            console.log(`Actors: ${JSON.parse(body).Actors}`);
            console.log("----------------------------------------------------");
            }
    });
}

//Executing the function
chooseCommand(command, userInput);

