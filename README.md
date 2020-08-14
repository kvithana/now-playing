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

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
