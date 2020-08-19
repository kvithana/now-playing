const SAMPLES_PER_SECOND = 5

/**
 * Converts segments from Spotify's audio analysis for a track into normalised
 * segments of fixed length.
 * @param analysis Spotify Audio Analysis Object
 */
export const toNormalisedChromagram = (analysis: TrackAudioAnalysis): number[][] => {
  let seek = 0
  let currentSegment = 0
  const duration = analysis.track.duration
  const chromagram: number[][] = []

  while (seek <= duration && currentSegment < analysis.segments.length - 2) {
    // if seek within current segment
    if (_withinSegment(analysis.segments[currentSegment], seek)) {
      chromagram.push(analysis.segments[currentSegment].pitches)
    } else {
      // move to next segment
      currentSegment++
      chromagram.push(analysis.segments[currentSegment].pitches)
    }
    // increment seek
    seek += 1 / SAMPLES_PER_SECOND
  }
  return chromagram
}

const _withinSegment = (segment: AnalysisSegmentItem, seek: number) => {
  return seek >= segment.start && seek < segment.start + segment.duration
}
