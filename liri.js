// Code to read and set any environment variables with the dotenv package
require("dotenv").config();

// Importing files needed to run the funtions
var fs = require("fs");
var keys = require('./keys.js');
var request = require('request');
var concert = require('node-bandsintown-api');
var Spotify = require('node-spotify-api');

//Variables to target specific APIs in the keys.js file

var liricommand = process.argv[2];
var input = process.argv[3];

// Available commands for liri
//concert-this, spotify-this-song, do-what-it-says

// Available commands for liri 
//concert-this, spotify-this-song, movie-this, do-what-it-says

function commands (liriCommand, input){

    switch (liriCommand) {
        
        case "spotify-this-song":
        getSong(input);
        break;

        case "movie-this":
        getMovie(input);
        break;

        case "concert-this":
        getConcert(input);
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
			console.log("it's on netflicks :"+ "http://www.imdb.com/title/tt0485947/");
			return;
		}
    });
};

//Function for concerts

function getConcert(concertName) {
    //If no concert is provided, use try another band as default
        if (!concertName) {
            concertName = "Try another band";
        }
            
    // Runs a request to the OMDB API with the movie specified
    var queryUrl = "https://rest.bandsintown.com/artists" + artist + "/events?app id=codeingbootcamp";

    // Helps debugging
    console.log(queryUrl);

    //Callback to bands in town API to get movie info
    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 100) {
            var concertObject = JSON.parse(body);

            //console.log(concertObject); // Show the text in the terminal
            var concertResults = 
            "------------------------------ begin ------------------------------" + "\r\n" +
            "Name of the venue: " + concertObject.Name+"\r\n"+
            "Location: " + concertObject.Location+"\r\n"+
            "Date of event: " + concertObject.Date+"\r\n"+
            "------------------------------ end ------------------------------" + "\r\n";
            console.log(concertResults);

            //Appends movie results to log.txt file
            fs.appendFile('log.txt', concertResults, function (err) {
                if (err) throw err;
              });
              console.log("Saved!");
              logResults(response);
        };

    });  
    
};




//Function for Random
function getRandom(){
    //Reads text in random.txt file
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        else {
        console.log(data);

        //creates a variable for data in random.txt
        var randomData = data.split(",");
        //passes data into getSong function
        commands(randomData[0], randomData[1]);
        }
        console.log("test" + randomData[0] + randomData[1]);
    });
};

//Function to log results from the other functions
function logResults(data){
    fs.appendFile("log.txt", data, function(err) {
      if (err)
          throw err;
    });
  };

  commands(liriCommand,input);
