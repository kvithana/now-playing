# Now Playing

Just a fun little project to show some pretty colours and the currently playing track using the [Spotify API](https://developer.spotify.com/documentation/web-api/). A nice screen saver to have up at a party or while studying.

> ⚠: The codebase is a little gross!
 
## How It Works

The app polls the Spotify user's `player` state using [this](https://developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/) endpoint to get the currently playing track. We then get the relevant album art for the track, and extract the main colours from it using [node-vibrant](https://github.com/Vibrant-Colors/node-vibrant). These are the colours that you see in the visualisation.

To differentiate between sections of the song, we call the `audio-analysis` endpoint on the Spotify API ([here](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/)). We are currently just using deltas of the `sections` to calculate the mean loudness of the track and toggling background colour states. 

There is scope to further enhance this feature by doing your own analysis of the `beats` or `tatums` to extract the choruses from the data. Might be a fun weekend project I'll get to doing eventually.

## Running Locally

The project has been designed to be hosted on [Vercel](https://vercel.com). To run locally, install the Vercel CLI and run `vercel dev`.

You'll need to create a Spotify developer project and copy the following parameters into your `.env`.

- SPOTIFY_CLIENT_SECRET="xxxxx"
- SPOTIFY_CLIENT_ID="xxxxxx"
- HOST_URL="YOUR HOST BASE URL eg. now-playing.kal.im"


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).