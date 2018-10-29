// Code to read and set any environment variables with the dotenv package
require("dotenv").config();

// Importing files needed to run the funtions
var fs = require("fs");
var keys = require('./keys.js');
var request = require('request');
var twitter = require('node-concert-api');
var Spotify = require('node-spotify-api');

//Variables to target specific APIs in the keys.js file

var liricommand = process.argv[2];
var input = process.argv[3];

// Available commands for liri
//my tweets, spotify-this-song, do-what-it-says

// Available commands for liri 
//concert-this, spotify-this-song, movie-this, do-what-it-says

function commands (liriCommand, input){

    switch (liriCommand) {

        case "concert-this":
        getTweets(input);
        break; 
        
        case "spotify-this-song":
        getSong(input);
        break;

        case "movie-this":
        getMovie(input);
        break;

        case "do-what-it-says":
        getRandom();
        break;

    //If no command is entered, this is the default message to user
    default:
      console.log("Not working. Enter one of the following commands: 'concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says' followed by parameter.");
    }
}

//function for each liri command

// Function for spotify


//Function for Spotify
function getSong(songName) {
    var spotify = new Spotify(keys.spotify);

    //If no song is provided, use "The Sign" 
        if (!songName) {
            songName = "The Sign";
        };        

        console.log(songName);

        //Callback to spotify to search for song name
        spotify.search({ type: 'track', query: songName}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } 
            console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
            "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url); 
            
            //Creates a variable to save text into log.txt file
            var logSong = "Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
            "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url + "\n";
            
            //Appends text to log.txt file
            fs.appendFile('log.txt', logSong, function (err) {
                if (err) throw err;
              });
            
            logResults(data);
        });
};




//Function for movies

function getMovie(movieName) {
    //If no movie name is provided, use Mr.Nobody as default
        if (!movieName) {
            movieName = "mr nobody";
        }
            
    // Runs a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy";

    // Helps debugging
    console.log(queryUrl);

    //Callback to OMDB API to get movie info
    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            var movieObject = JSON.parse(body);

            //console.log(movieObject); // Show the text in the terminal
            var movieResults = 
            "------------------------------ begin ------------------------------" + "\r\n" +
            "Title: " + movieObject.Title+"\r\n"+
            "Year: " + movieObject.Year+"\r\n"+
            "Imdb Rating: " + movieObject.imdbRating+"\r\n"+
            "Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
            "Country: " + movieObject.Country+"\r\n"+
            "Language: " + movieObject.Language+"\r\n"+
            "Plot: " + movieObject.Plot+"\r\n"+
            "Actors: " + movieObject.Actors+"\r\n"+
            "------------------------------ end ------------------------------" + "\r\n";
            console.log(movieResults);

            //Appends movie results to log.txt file
            fs.appendFile('log.txt', movieResults, function (err) {
                if (err) throw err;
              });
              console.log("Saved!");
              logResults(response);
        } 
        else {
			console.log("Error :"+ error);
			return;
		}
    });
};
