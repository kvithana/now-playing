import { subtract, norm, zeros, sqrt, matrix, Matrix, divide } from 'mathjs'

export const computeSimilarityMatrixSlow = (chroma: number[][]): number[][] => {
  const number_of_samples = chroma.length
  const time_similarity = zeros([number_of_samples, number_of_samples]) as number[][]
  for (let i = 0; i < number_of_samples; i++) {
    for (let j = 0; j < number_of_samples; j++) {
      const difference = subtract(matrix(chroma[i]), matrix(chroma[j])) as Matrix
      const normal = norm(difference)
      const similarity = divide(normal, sqrt(12))
      time_similarity[i][j] = subtract(1, similarity) as number
    }
  }
  return time_similarity
}
