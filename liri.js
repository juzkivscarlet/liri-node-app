require('dotenv').config();
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var axios = require('axios');
var fs = require('fs');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var commandArg = "";

for(var i=3; i<process.argv.length; i++) {
    commandArg += process.argv[i];
    if(i!=process.argv.length) commandArg += " ";
}

if(command=='concert-this') {
    concertThis(commandArg);
} else if(command=='spotify-this-song') {
    spotifyThisSong(commandArg);
} else if(command=='movie-this') {
    movieThis(commandArg);
} else if(command=='do-what-it-says') {
    doWhatItSays('./random.txt');
}

function concertThis(artist) {
    var concerts = [];
    var searchLink = "https://rest.bandsintown.com/artists/"+artist.trim()+"/events?app_id="+keys.bandsintown.key;
    axios.get(searchLink).then(function(data) {
        for(var i=0; i<10; i++) {
            var location = data.data[i].venue.city+", ";
            if(data.data[i].venue.region) location += data.data[i].venue.region+" ";
            location += data.data[i].venue.country;

            var lineup = data.data[i].lineup;
            lineup.shift();

            if(lineup.length==0) lineup[0] = "[solo]";
            
            var show = {
                headliner: data.data[i].lineup[0],
                lineup: lineup,
                date: formatDateTime(data.data[i].datetime),
                location: location
            };
            concerts.push(show);
        }
        console.log("SHOWS FOR: "+artist.toUpperCase()+"\n\n");
        for(var i=0; i<concerts.length; i++) {
            console.log(concerts[i].location+" (w/ "+concerts[i].lineup.join(", ")+")"+" -- "+concerts[i].date);
        }
    });
}

function spotifyThisSong(song) {
    spotify.search({type: 'track', query: song}, function(err,data) {
        if(err) return console.log(err);

        var songFound = data.tracks.items[0];

        var albumReleaseYear = songFound.album.release_date.slice(0,4);
        var songDuration = parseInt(songFound.duration_ms/1000);
        var songMinutes = Math.floor(songDuration/60);
        if(songMinutes==0) songMinutes="0";

        var songSeconds = songDuration - (songMinutes*60);
        if(songSeconds<10 && songSeconds>0) songSeconds = "0"+songSeconds;
        else if(songSeconds==0) songSeconds="00";

        var songLength = songMinutes+":"+songSeconds;

        var returnSong = {
            title: songFound.name,
            artist: songFound.artists[0].name,
            duration: songLength,
            album: {
                title: songFound.album.name,
                release_year: albumReleaseYear,
                total_songs: songFound.album.total_tracks
            },
            track_num: songFound.track_number,
            preview: songFound.external_urls.spotify
        };

        console.log("'"+returnSong.title+"' is a track by "+returnSong.artist+". It appears as track #"+returnSong.track_num+" out of "+returnSong.album.total_songs+
            " on their "+returnSong.album.release_year+" album, "+returnSong.album.title+".");
        console.log("Listen to it here: "+returnSong.preview);
    });
}

function movieThis(movie) {
    var searchLink = "http://www.omdbapi.com/?apikey="+keys.omdb.key+"&t="+movie.trim();
    axios.get(searchLink).then(function(data) {
        var refMovie = data.data;
        var year = refMovie.Released.slice(7);
        for(var i=0; i<refMovie.Ratings.length; i++) {
            if(refMovie.Ratings[i].Source=="Rotten Tomatoes") var rotTomRating = refMovie.Ratings[i].Value;
        }
        var returnMovie = {
            title: refMovie.Title,
            release_year: year,
            ratings: {
                imdb: refMovie.imdbRating,
                rotten_tomatoes: rotTomRating
            },
            mpaa_rating: refMovie.Rated,
            plot: refMovie.Plot,
            language: refMovie.Language,
            country: refMovie.Country,
            actors: refMovie.Actors.split(", ")
        };

        console.log("");
        var actorsString = "";
        for(var i=0; i<returnMovie.actors.length; i++) {
            actorsString += returnMovie.actors[i];
            if(i<returnMovie.actors.length-1) actorsString += ", ";
            if(i==returnMovie.actors.length-2) actorsString += "and ";
        }

        console.log(returnMovie.title.toUpperCase() + " (" + returnMovie.release_year+")\n");
        console.log("The "+returnMovie.release_year+" film, rated "+returnMovie.mpaa_rating+", features "+actorsString+".");
        console.log("The movie was made in "+returnMovie.country+" and is in "+returnMovie.language+".");
        console.log("Plot: "+returnMovie.plot);
        console.log(returnMovie.title+" has been rated "+returnMovie.ratings.rotten_tomatoes+" by Rotten Tomatoes, and "
            +returnMovie.ratings.imdb+" (out of 10) by IMDb.");
    });
}

function doWhatItSays(file) {
    fs.readFile(file,'utf8',function(err,data) {
        if(err) return console.log(err);

        var args = data.split(",");
        console.log("");
        
        if(args[0]=="spotify-this-song") spotifyThisSong(args[1]);
        else if(args[0]=="concert-this") concertThis(arg[1]);
        else if(args[0]=="movie-this") movieThis(args[1]);
    });
}

function formatDateTime(data) {
    var date = data.slice(0,data.indexOf('T'));
    var time = data.slice(data.indexOf('T')+1, data.length-3);
    
    var year = date.slice(0,4);
    var monthNum = parseInt(data.slice(5,7));
    var monthsArr = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var month = monthsArr[monthNum-1];
    var day = parseInt(data.slice(8,10));

    var formatTime = month+" "+day+", "+year+" @ ";
    var hour = parseInt(time.slice(0,2));
    var amOrPm = "AM";
    if(hour>12) {
        hour -= 12;
        amOrPm = "PM";
    } else if(hour>11) amOrPm="PM";
    formatTime += hour;
    var minutes = parseInt(time.slice(3,5));
    if(minutes>=10) formatTime += ":"+minutes;
    formatTime += " "+amOrPm;
    return formatTime;
}