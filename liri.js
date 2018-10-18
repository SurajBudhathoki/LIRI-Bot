// the require functions
require('dotenv').config();
const keys = require("./keys");
const Spotify = require('node-spotify-api');
const fs = require('fs');
const request = require('request');

//getting info from keys.js file
const spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});


//getting the input from the user to execute the commands
let command = process.argv[2];
let userInput = process.argv[3];


//executing the function depending on user commands
let chooseCommand = function (command) {

    if (command === "spotify-this-song") {
        spotifyCommand();
    }
    else if (command === "concert-this") {
        concertCommand();
    }
    else if (command === "movie-this") {
        movieCommand();
    }
    else if (command === "do-what-it-says") {
        doCommand();
    }
}

//function for spotify-this-song command
let spotifyCommand = function () {

    //defaults to this song when no userInput is given
    if (userInput === undefined) {
        userInput = "What's my age again";
    }

    spotify.search({ type: 'track', query: `${userInput}`, limit: 1 }, function (error, data) {


        if (!error) {

            let song = data.tracks.items;


            for (let i = 0; i < song.length; i++) {
                console.log("-------------------------------------Song Information-----------------------------------\n");
                console.log("Artist name: " + song[i].album.artists[i].name);
                console.log("Song name: " + song[i].name);
                console.log("Song Preview: " + song[i].external_urls.spotify);
                console.log("Album name: " + song[i].album.name);
                console.log("-----------------------------------------------------------------------------------------\n");

                //logging info to the log.txt file
                fs.appendFile('log.txt', `\nArtist name: ${song[i].album.artists[i].name},\n Song name: ${song[i].name},\n Song preview: ${song[i].external_urls.spotify},\n Album name: ${song[i].album.name}\n------------------------------------------------------------------------\n`, (error) => {
                    if (error) throw error;
                });
            }



        }
    })

}


//function for concert-this command
let concertCommand = function () {
    request(`https://rest.bandsintown.com/artists/${userInput}/events?app_id=codingbootcamp`,
        function (error, response, body) {

            if (!error && response.statusCode === 200) {

                console.log("-------------------Upcoming Events---------------------------\n");

                let concert = JSON.parse(body);

                for (let i = 0; i < concert.length; i++) {


                    console.log(`Venue Name: ${concert[i].venue.name}`);
                    console.log(`Location: ${concert[i].venue.city} ${concert[i].venue.region}`);
                    console.log("----------------------------------------------------");

                    //logging info to the log.txt file
                    fs.appendFile('log.txt', `\nVenue Name: ${concert[i].venue.name}\n Location: ${concert[i].venue.city} ${concert[i].venue.region}\n------------------------------------------------------------------------`, (error) => {
                        if (error) throw error;
                    })
                }
            }

        });
}

//function for movie-this command
let movieCommand = function () {
    request(`http://www.omdbapi.com/?t=${userInput}&apikey=trilogy`,
        function (error, response, body) {

            //defaults to this when no movie name is provided
            if (userInput === undefined) {
                console.log("\nIf you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }

            else if (!error && response.statusCode === 200) {

                body = JSON.parse(body);

                console.log("--------------------------------------Movie Information-----------------------------------------------\n");
                console.log(`Movie name: ${body.Title}`);
                console.log(`Year: ${body.Year}`);
                console.log(`IMDB rating: ${body.imdbRating}`);
                console.log(`Rotten Tomatoes rating: ${body.Ratings[1].Value}`);
                console.log(`Country: ${body.Country}`);
                console.log(`Language: ${body.Language}`);
                console.log(`Plot: ${body.Plot}`);
                console.log(`Actors: ${body.Actors}`);
                console.log("------------------------------------------------------------------------------------------------------");

                //logging info to the log.txt file
                fs.appendFile('log.txt', `\nMovie name: ${body.Title} \nYear: ${body.Year} \nIMDB rating: ${body.imdbRating} \nRotten Tomatoes rating: ${body.Ratings[1].Value} \nCountry: ${body.Country} \nLanguage: ${body.Language} \nPlot: ${body.Plot}\nActors: ${body.Actors}\n------------------------------------------------------------------------\n`, (error) => {
                    if (error) throw error;
                })
            }
        });
}

//function for do-what-it-says command
let doCommand = function () {

    //reads the data from the random.txt file
    fs.readFile('random.txt', 'utf8', function (error, data) {

        if (error) {
            return console.log(error);
        }

        //spliting to get the required data to put on the function
        let arr = data.split(',');

        spotify.search({ type: 'track', query: arr[1], limit: 1 }, function (error, data) {
            if (error) {
                return console.log('Error occurred: ' + error);
            }
            song = data.tracks.items;

            for (let i = 0; i < song.length; i++) {
                console.log("-------------------------------------Song Information-----------------------------------\n"); console.log("Artist name: " + song[i].album.artists[i].name);
                console.log("Song name: " + song[i].name);
                console.log("Song Preview: " + song[i].external_urls.spotify);
                console.log("Album name: " + song[i].album.name);
                console.log("-----------------------------------------------------------------------------------------\n");

                //logging info to the log.txt file
                fs.appendFile('log.txt', `\nArtist name: ${song[i].album.artists[i].name},\n Song name: ${song[i].name},\n Song preview: ${song[i].external_urls.spotify},\n Album name: ${song[i].album.name}\n------------------------------------------------------------------------\n`, (error) => {
                    if (error) throw error;
                });
            }
        })
    })
}

//Executing the function
chooseCommand(command);

