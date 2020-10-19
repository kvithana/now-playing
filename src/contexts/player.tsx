import React, { useEffect, useState, useContext, useRef } from 'react'
import Spotify from 'spotify-web-api-js'
import { AuthContext } from './auth'
import { analyseChoruses } from '../libs/SpotifyChorusAnalysis'
import ReactGA from 'react-ga'

export const PlayerContext = React.createContext<{
  currentTrack: SpotifyApi.TrackObjectFull | null
  currentFeatures: TrackAudioAnalysis | null
  meanLoudness: number | null
  currentSeek: number | null
  meanLoudnessDelta: number | null
  isPlaying: boolean
}>({
  currentTrack: null,
  currentFeatures: null,
  meanLoudness: null,
  currentSeek: null,
  meanLoudnessDelta: null,
  isPlaying: false,
})

const spotify = new Spotify()

export const PlayerProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { accessToken, loggedIn } = useContext(AuthContext)
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.TrackObjectFull | null>(null)
  const [currentSeek, setCurrentSeek] = useState<null | number>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [trackAnalysis, setTrackAnalysis] = useState<TrackAudioAnalysis | null>(null)
  const [currentFeatures, setCurrentFeatures] = useState<TrackAudioAnalysis | null>(null)
  const [meanLoudness, setMeanLoudness] = useState<number | null>(null)
  const [_currentSeek, _setCurrentSeek] = useState<number | null>(null)
  const [meanLoudnessDelta, setMeanLoudnessDelta] = useState<number | null>(null)

  const currentSeekRef = useRef(_currentSeek)
  currentSeekRef.current = _currentSeek

  useEffect(() => {
    if (loggedIn) {
      spotify.setAccessToken(accessToken)
    } else {
      setCurrentTrack(null)
      setIsPlaying(false)
    }
  }, [accessToken, loggedIn])

  useEffect(() => {
    if (isPlaying) {
      const ref = setInterval(() => {
        ReactGA.event({
          category: 'Listen',
          action: 'Currently listening',
        })
      }, 30e3)

      return () => clearInterval(ref)
    }
  }, [isPlaying])

  useEffect(() => {
    if (loggedIn) {
      const ref = setInterval(() => {
        spotify
          .getMyCurrentPlaybackState()
          .then((s) => {
            setCurrentTrack(s.item)
            setCurrentSeek(s.progress_ms ? s.progress_ms / 1000 : null)
            _setCurrentSeek(s.progress_ms ? s.progress_ms / 1000 : null)
            setIsPlaying(s.is_playing)
          })
          .catch((err) => console.error(err))
      }, 1e3)
      return () => clearInterval(ref)
    }
  }, [loggedIn])

  useEffect(() => {
    const getAnalysis = async () => {
      setTrackAnalysis(null)
      setCurrentFeatures(null)
      let gotData = false
      do {
        await spotify
          .getAudioAnalysisForTrack(currentTrack?.id || '')
          .then((analysis) => {
            console.log(analysis)
            gotData = true
            ;(analysis as TrackAudioAnalysis).sections.reduce(
              (acc: AnalysisSectionItemDelta, v: AnalysisSectionItem) => {
                v.analysisItemDelta = {
                  loudness: v.loudness - acc.loudness,
                  tempo: v.tempo - acc.tempo,
                  time_signature: v.time_signature - acc.time_signature,
                }

                return { loudness: v.loudness, tempo: v.tempo, time_signature: v.time_signature }
              },
              { loudness: 999, tempo: 0, time_signature: 0 },
            )
            setTrackAnalysis(analysis as TrackAudioAnalysis)

            const loudnessDelta = (analysis as TrackAudioAnalysis).sections.map((v) => v.analysisItemDelta.loudness)
            loudnessDelta.sort((a, b) => a - b)
            setMeanLoudnessDelta(loudnessDelta[Math.floor(loudnessDelta.length / 2) + 1])

            const loudness = (analysis as TrackAudioAnalysis).sections.map((v) => v.loudness)
            loudness.sort((a, b) => a - b)
            setMeanLoudness(loudness[Math.floor(loudness.length / 2) + 1])
          })
          .catch(() => false)
      } while (!gotData)
    }
    if (currentTrack?.id) {
      getAnalysis()
    }
  }, [currentTrack?.id])

  useEffect(() => {
    if (isPlaying && trackAnalysis && _currentSeek) {
      //   console.log(_currentSeek);
      // const currentFeatures: TrackAudioAnalysis = {
      //   bars: trackAnalysis.bars.filter((b) => b.start <= _currentSeek && _currentSeek <= b.start + b.duration),
      //   beats: trackAnalysis.beats.filter((b) => b.start <= _currentSeek && _currentSeek <= b.start + b.duration),
      //   sections: trackAnalysis.sections.filter((b) => b.start <= _currentSeek && _currentSeek <= b.start + b.duration),
      //   segments: trackAnalysis.segments.filter((b) => b.start <= _currentSeek && _currentSeek <= b.start + b.duration),
      //   tatums: [], // remove for optimisation
      //   track: trackAnalysis.track as AnalysisTrackItem,
      // }
      const currentFeatures: TrackAudioAnalysis = {
        bars: [],
        beats: [],
        sections: trackAnalysis.sections.filter((b) => b.start <= _currentSeek && _currentSeek <= b.start + b.duration),
        segments: [],
        tatums: [], // remove for optimisation
        track: trackAnalysis.track as AnalysisTrackItem,
      }

      setCurrentFeatures(currentFeatures)
      //   console.log(currentFeatures);
    }
  }, [_currentSeek, isPlaying, trackAnalysis])

  // useEffect(() => {
  //   if (trackAnalysis) {
  //     analyseChoruses(trackAnalysis)
  //   }
  // }, [trackAnalysis])

  useEffect(() => {
    const ref = setInterval(() => {
      if (currentSeekRef.current) {
        _setCurrentSeek(currentSeekRef.current + 0.125)
      }
    }, 125)
    return () => clearInterval(ref)
  }, [currentSeek])

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        currentFeatures,
        meanLoudness,
        currentSeek,
        meanLoudnessDelta,
        isPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
