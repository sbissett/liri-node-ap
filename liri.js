// Code to read and set any environment variables with the dotenv package
require("dotenv").config();

// Importing files needed to run the funtions
var fs = require("fs");
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');

//Variables to target specific APIs in the keys.js file

var liricommand = process.argv[2];
var input = process.argv[3];

// Available commands for liri
//my tweets, spotify-this-song, do-what-it-says

// Available commands for liri 
//my-tweets, spotify-this-song, movie-this, do-what-it-says

function commands (liriCommand, input){

    switch (liriCommand) {
        case "my-tweets":
        getTweets(input);
        break; case "spotify-this-song":
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
      console.log("Not working. Enter one of the following commands: 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says' followed by parameter.");
    }
}