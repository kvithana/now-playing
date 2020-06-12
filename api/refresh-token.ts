/**
 * Refresh a new Spotify access token given a refresh token.
 */

import { NowRequest, NowResponse } from '@vercel/node';
import SpotifyWebApi from 'spotify-web-api-node';
import { invalidParameters, internalServerError } from './_consts/errors';

// Initialise Spotify client
const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/login` : 'http://localhost:3000/login',
});

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  if (req.query?.refreshToken) {
    spotify.setRefreshToken(req.query.refreshToken as string);
    spotify
      .refreshAccessToken()
      .then((data) =>
        res.json({
          ...data.body,
        }),
      )
      .catch((err) => {
        res.status(500).json({ message: internalServerError, info: err.toString() });
      });
    return;
  }
  res.status(400).json({ message: invalidParameters });
};
