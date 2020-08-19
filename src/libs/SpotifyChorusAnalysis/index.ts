import { toNormalisedChromagram } from './helpers'
import { computeSimilarityMatrixSlow } from './similarityMatrix'

export const analyseChoruses = (analysis: TrackAudioAnalysis): void => {
  const chromagram = toNormalisedChromagram(analysis)
  console.log('chromagram', chromagram)
  const similarity = computeSimilarityMatrixSlow(chromagram)
  console.log('similarity', similarity)
}
