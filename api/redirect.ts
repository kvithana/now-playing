/**
 * Request redirect URI for Spotify OAuth.
 */

import { NowRequest, NowResponse } from '@vercel/node';
import SpotifyWebApi from 'spotify-web-api-node';
import crypto from 'crypto';
import { internalServerError } from './_consts/errors';

// Scopes to request
const OAUTH_SCOPES = ['user-read-email', 'user-read-playback-state', 'user-read-currently-playing'];

// Initialise Spotify client
const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.HOST_URL ? `https://${process.env.HOST_URL}/login` : 'http://localhost:3000/login',
});

export default (req: NowRequest, res: NowResponse): void => {
  let redirectURL: string;
  try {
    redirectURL = spotify.createAuthorizeURL(
      OAUTH_SCOPES,
      (req.query?.state as string) || crypto.randomBytes(20).toString('hex'),
    );
    res.status(302).json({ url: redirectURL });
  } catch (err) {
    res.status(500).json({ success: false, message: internalServerError });
  }
};
