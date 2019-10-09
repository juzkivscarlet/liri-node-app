// console.log("this is loaded");
exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_CLIENT
};

exports.bandsintown = {
    key: process.env.BANDSINTOWN_ID
};

exports.omdb = {
    key: process.env.OMDB_API_KEY
};