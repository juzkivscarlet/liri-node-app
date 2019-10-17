# Liri (Node.js app)

This simple command-line node app allows users to search a band's upcoming concerts via Bandsintown, a song's information via Spotify, and movie info via OMDb. 

## Configuration

In order to run the app, users must first have keys for the three API's: Bandsintown, Spotify (Client ID & Client Secret), and OMDb. Then, create a file in the master directory called ".env" and type in the aforementioned credentials as such: 

![Image screenshow of .env file](https://raw.githubusercontent.com/mattjuskiw/liri-node-app/master/img/env.jpg)

After saving this file, a few Node.js modules must be installed to the master directory: axios, fs, node-spotify-api, and dotenv. They can be installed by running the following commands in the master directory via a bash terminal:

```
npm install axios
npm install node-spotify-api
npm install dotenv
npm install fs
```

All commands must be ran in the master directory in the bash terminal. All commands are prefixed by `node liri [command]` or `node liri.js [command]`. For example, `node liri concert-this green day`

## Concerts

Concerts can be searched by running the command `concert-this [artist-name]`. For example, users can run *Green Day* through. Here is a screenshot of a sample result:

![Image of concert-this result](https://raw.githubusercontent.com/mattjuskiw/liri-node-app/master/img/liri-concert.PNG)

Results are formatted as such: 
```
SHOWS FOR: [BAND-NAME]

City, Country (w/ [lineup]) -- [Month] [Date], [Year] @ [time][PM/AM].
...

```

The lineup will say `[solo]` if Bandsintown has no opening acts listed. If opening acts are listed, the headliner will be excluded. 

## Songs

Songs can be searched by running the command `spotify-this-song [song-title]`. For example, users can run *American Idiot* through, and here is the result:

![Image of spotify-this-song result](https://raw.githubusercontent.com/mattjuskiw/liri-node-app/master/img/liri-spotify.PNG)

Results are formatted as such:
```
'[Song title]' is a song by [artist name]. It appears as track #[track number] out of [total songs], and runs for a time of [timestamp]. It appears on their [album release year] album, [album title].
Listen to it here: [Spotify link]
```

## Movies

Movies can be searched by running the command `movie-this [movie-name]`. For example, running `movie-this forrest gump` returns the following:

![Image of movie-this result](https://raw.githubusercontent.com/mattjuskiw/liri-node-app/master/img/liri-movie.PNG)

Results are formatted as such:
```

[MOVIE TITLE] ([year])
The [year] film, rated [MPAA rating], features [list of featured actors & actresses].
The movie was made in [country] and is in [language].
Plot: [plot summary].
[Movie Title] has been rated [rating] by Rotten Tomatoes, and [rating] (out of 10) by IMDb.

```

## do-what-it-says

Running the command `do-what-it-says` reads a local text file in the master directory called 'random.txt', which contains a command to run. The default text in the file is `spotify-this-song,"I Want it That Way"`, so running `do-what-it-says` actually runs the command `spotify-this-song I Want it That Way`. 

![Image of do-what-it-says result](https://raw.githubusercontent.com/mattjuskiw/liri-node-app/master/img/liri-command.PNG)

Using the formatting `[command],"[arguments]"`, the text of 'random.txt' can be replaced to run any compatible command. 
