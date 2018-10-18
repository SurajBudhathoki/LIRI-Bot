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
let chooseCommand = function(command){

    if(command  === "spotify-this-song"){
            spotifyCommand();
    }
    else if (command === "concert-this"){
        concertCommand();
    }
    else if (command === "movie-this"){
        movieCommand();
    }
    else if (command === "do-what-it-says"){
        doCommand();
}
}

//function for spotify-this-song command
let spotifyCommand = function() {
    
    if(userInput === undefined) {
        userInput = "What's my age again";
    }

    spotify.search({ type: 'track', query: `${userInput}`, limit: 1 }, function(error, data) {
                 
      
        if (!error){
       
        song = data.tracks.items;
     
        
        for(let i =0; i < song.length; i++) {
            console.log("----------------------------------------------------");
            console.log("Artist name: " + song[i].album.artists[i].name);   
            console.log("Song name: " + song[i].name); 
            console.log("Song Preview: " +song[i].external_urls.spotify);
            console.log("Album name: " + song[i].album.name); 
            console.log("----------------------------------------------------");

            //logging info to the log.txt file
            fs.appendFile('log.txt', `-----Artist name: ${song[i].album.artists[i].name}, Song name: ${song[i].name}, Song preview: ${song[i].external_urls.spotify}, Album name: ${song[i].album.name}-----`, (error) => {
                if(error) throw error;
            });
        }
     
       

    }
      })

}


//function for concert-this command
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

           //logging info to the log.txt file
           fs.appendFile('log.txt', `-----Venue Name: ${concert[i].venue.name}, ` + `Location: ${concert[i].venue.city}, ${concert[i].venue.region}`, (error) => {
               if(error) throw error;
           })
            } 
        } 
       
    });
}

//function for movie-this command
let movieCommand = function(){
    request(`http://www.omdbapi.com/?t=${movieName}&apikey=trilogy`,
    function(error,response,body){

        
        if(userInput === undefined){
            console.log("If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
        
        else if (!error && response.statusCode === 200) {

         body =  JSON.parse(body);  
            console.log("----------------------------------------------------");
            console.log(`Movie name: ${body.Title}`);
            console.log(`Year: ${body.Year}`);
            console.log(`IMDB rating: ${body.imdbRating}`);
            console.log(`Rotten Tomatoes rating: ${body.Ratings[1].Value}`);
            console.log(`Country: ${body.Country}`);
            console.log(`Language: ${body.Language}`);
            console.log(`Plot: ${body.Plot}`);
            console.log(`Actors: ${body.Actors}`);
            console.log("----------------------------------------------------");

            //logging info to the log.txt file
            fs.appendFile('log.txt', `-----Movie name: ${body.Title}, Year: ${body.Year}, Year: ${body.Year}, IMDB rating: ${body.imdbRating}, Rotten Tomatoes rating: ${body.Ratings[1].Value}, Country: ${body.Country}, Language: ${body.Language}, Plot: ${body.Plot}, Actors: ${body.Actors}-----`, (error) => {
                if(error) throw error;
            })
            }
    });
}

//function for do-what-it-says command
let doCommand = function(){

    fs.readFile('random.txt', 'utf8', function(error, data){

        if (error){ 
			return console.log(error);
        }
        
        let arr = data.split(',');

       spotify.search({ type: 'track', query: arr[1], limit: 1 }, function(error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
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

//Executing the function
chooseCommand(command);

