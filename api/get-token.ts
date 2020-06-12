/**
 * Refresh or mint an
 */

import { NowRequest, NowResponse } from '@vercel/node';
import SpotifyWebApi from 'spotify-web-api-node';
import { invalidParameters, internalServerError } from './_consts/errors';

// Initialise Spotify client
const spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `${process.env.VERCEL_URL || 'http://localhost:3000'}/login`,
});

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  if (req.query?.authCode) {
    spotify
      .authorizationCodeGrant(req.query.authCode as string)
      .then((data) =>
        res.json({
          ...data.body,
        }),
      )
      .catch((err) => {
        res.statusCode = 500;
        res.json({ message: internalServerError, info: err.toString() });
      });
    return;
  }
  res.statusCode = 400;
  res.json({ message: invalidParameters });
};
