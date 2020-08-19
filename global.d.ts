interface LoginStatus {
  accessToken: string
  authCode: string
  loggedInAt: string
  accessTokenRefreshedAt: string
  refreshToken: string
}

interface AnalysisGenericItem {
  confidence: number
  duration: number
  start: number
}

interface AnalysisSectionItem {
  confidence: number
  duration: number
  key: number
  key_confidence: number
  loudness: number
  mode: number
  mode_confidence: number
  start: number
  tempo: number
  tempo_confidence: number
  time_signature: number
  time_signature_confidence: number
  analysisItemDelta: AnalysisSectionItemDelta
}

interface AnalysisSectionItemDelta {
  loudness: number
  tempo: number
  time_signature: number
}

interface AnalysisSegmentItem {
  confidence: number
  duration: number
  loudness_end: number
  loudness_max: number
  loudness_max_time: number
  loudness_start: number
  pitches: number[]
  start: number
  timbre: number[]
}

interface AnalysisTrackItem {
  duration: number
  end_of_fade_in: number
  key: number
  key_confidence: number
  loudness: number
  mode: number
  mode_confidence: number
  start_of_fade_out: number
  tempo: number
  tempo_confidence: number
  time_signature: number
  time_signature_confidence: number
}

interface TrackAudioAnalysis {
  bars: AnalysisGenericItem[]
  beats: AnalysisGenericItem[]
  sections: AnalysisSectionItem[]
  segments: AnalysisSegmentItem[]
  tatums: AnalysisGenericItem[]
  track: AnalysisTrackItem
}
