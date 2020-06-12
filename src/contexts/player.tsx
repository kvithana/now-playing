import React, { useEffect, useState, useContext } from 'react';
import Spotify from 'spotify-web-api-js';
import { createLogger } from '../util/loggers';
import { AuthContext } from './auth';
import { isPlainObject } from 'lodash';

export const PlayerContext = React.createContext<{
  currentTrack: SpotifyApi.TrackObjectFull | null;
  currentFeatures: TrackAudioAnalysis | null;
}>({
  currentTrack: null,
  currentFeatures: null,
});

const spotify = new Spotify();

export const PlayerProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { accessToken, loggedIn } = useContext(AuthContext);
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.TrackObjectFull | null>(null);
  const [currentSeek, setCurrentSeek] = useState<null | number>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trackAnalysis, setTrackAnalysis] = useState<TrackAudioAnalysis | null>(null);
  const [currentFeatures, setCurrentFeatures] = useState<TrackAudioAnalysis | null>(null);

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
            setCurrentSeek(s.progress_ms ? s.progress_ms / 1000 : null);
            setIsPlaying(s.is_playing);
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
        setTrackAnalysis(analysis);
      });
    }
  }, [currentTrack?.id]);

  useEffect(() => {
    if (isPlaying && trackAnalysis && currentSeek) {
      console.log(currentSeek);
      const currentFeatures: TrackAudioAnalysis = {
        bars: trackAnalysis.bars.filter((b) => b.start <= currentSeek && currentSeek <= b.start + b.duration),
        beats: trackAnalysis.beats.filter((b) => b.start <= currentSeek && currentSeek <= b.start + b.duration),
        sections: trackAnalysis.sections.filter((b) => b.start <= currentSeek && currentSeek <= b.start + b.duration),
        segments: trackAnalysis.segments.filter((b) => b.start <= currentSeek && currentSeek <= b.start + b.duration),
        tatums: trackAnalysis.tatums.filter((b) => b.start <= currentSeek && currentSeek <= b.start + b.duration),
      };
      setCurrentFeatures(currentFeatures);
      console.log(currentFeatures);
    }
  }, [currentSeek, isPlaying, trackAnalysis]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        currentFeatures,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
