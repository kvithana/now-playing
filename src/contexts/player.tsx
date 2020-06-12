import React, { useEffect, useState, useContext } from 'react';
import Spotify from 'spotify-web-api-js';
import { createLogger } from '../util/loggers';
import { AuthContext } from './auth';

export const PlayerContext = React.createContext<{
  currentTrack: SpotifyApi.TrackObjectFull | null;
}>({
  currentTrack: null,
});

const spotify = new Spotify();

export const PlayerProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { accessToken, loggedIn } = useContext(AuthContext);
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.TrackObjectFull | null>(null);
  useEffect(() => {
    if (loggedIn) {
      spotify.setAccessToken(accessToken);
    }
  }, [accessToken, loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      const ref = setInterval(() => {
        spotify
          .getMyCurrentPlaybackState()
          .then((s) => {
            setCurrentTrack(s.item);
            console.log(s);
          })
          .catch((err) => console.error(err));
      }, 1e3);
      return () => clearInterval(ref);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (currentTrack?.id) {
      spotify.getAudioAnalysisForTrack(currentTrack.id).then((analysis) => {
        console.log(analysis);
      });
    }
  }, [currentTrack?.id]);
  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
