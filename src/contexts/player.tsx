import React, { useEffect, useState, useContext, useRef } from 'react';
import Spotify from 'spotify-web-api-js';
import { createLogger } from '../util/loggers';
import { AuthContext } from './auth';

export const PlayerContext = React.createContext<{
  currentTrack: SpotifyApi.TrackObjectFull | null;
  currentFeatures: TrackAudioAnalysis | null;
  meanLoudness: number | null;
  currentSeek: number | null;
}>({
  currentTrack: null,
  currentFeatures: null,
  meanLoudness: null,
  currentSeek: null,
});

const spotify = new Spotify();

export const PlayerProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { accessToken, loggedIn } = useContext(AuthContext);
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.TrackObjectFull | null>(null);
  const [currentSeek, setCurrentSeek] = useState<null | number>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trackAnalysis, setTrackAnalysis] = useState<TrackAudioAnalysis | null>(null);
  const [currentFeatures, setCurrentFeatures] = useState<TrackAudioAnalysis | null>(null);
  const [meanLoudness, setMeanLoudness] = useState<number | null>(null);
  const [_currentSeek, _setCurrentSeek] = useState<null | number>(null);

  const currentSeekRef = useRef(_currentSeek);
  currentSeekRef.current = _currentSeek;

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
            _setCurrentSeek(s.progress_ms ? s.progress_ms / 1000 : null);
            setIsPlaying(s.is_playing);
          })
          .catch((err) => console.error(err));
      }, 1e3);
      return () => clearInterval(ref);
    }
  }, [loggedIn]);

  useEffect(() => {
    const getAnalysis = async () => {
      setTrackAnalysis(null);
      let gotData = false;
      do {
        await spotify.getAudioAnalysisForTrack(currentTrack?.id || '').then((analysis) => {
          console.log(analysis);
          gotData = true;
          setTrackAnalysis(analysis as TrackAudioAnalysis);
          const loudness = (analysis as TrackAudioAnalysis).sections.map((v) => v.loudness);
          loudness.sort((a, b) => a - b);
          setMeanLoudness(loudness[Math.floor(loudness.length / 2) + 1]);
        });
      } while (!gotData);
    };
    if (currentTrack?.id) {
      getAnalysis();
    }
  }, [currentTrack?.id]);

  useEffect(() => {
    if (isPlaying && trackAnalysis && _currentSeek) {
      //   console.log(_currentSeek);
      const currentFeatures: TrackAudioAnalysis = {
        bars: trackAnalysis.bars.filter((b) => b.start <= _currentSeek && _currentSeek <= b.start + b.duration),
        beats: trackAnalysis.beats.filter((b) => b.start <= _currentSeek && _currentSeek <= b.start + b.duration),
        sections: trackAnalysis.sections.filter((b) => b.start <= _currentSeek && _currentSeek <= b.start + b.duration),
        segments: trackAnalysis.segments.filter((b) => b.start <= _currentSeek && _currentSeek <= b.start + b.duration),
        tatums: [], // remove for optimisation
      };
      setCurrentFeatures(currentFeatures);
      //   console.log(currentFeatures);
    }
  }, [_currentSeek, isPlaying, trackAnalysis]);

  useEffect(() => {
    const ref = setInterval(() => {
      if (currentSeekRef.current) {
        _setCurrentSeek(currentSeekRef.current + 0.125);
      }
    }, 125);
    return () => clearInterval(ref);
  }, [currentSeek]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        currentFeatures,
        meanLoudness,
        currentSeek,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
