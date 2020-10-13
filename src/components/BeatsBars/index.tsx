import React, { useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PlayerContext } from '../../contexts/player'

const transition = {
  duration: 1,
  ease: [0.43, 0.13, 0.23, 0.96],
}

const BeatsBars = (): JSX.Element => {
  const { currentFeatures, currentSeek } = useContext(PlayerContext)
  const [showBar, setShowBar] = useState<AnalysisGenericItem | null>(null)
  const [showBeat, setShowBeat] = useState<AnalysisGenericItem[]>([])

  useEffect(() => {
    setShowBeat([])
  }, [showBar])

  useEffect(() => {
    if (currentFeatures?.bars[0] && currentSeek) {
      setTimeout(
        () => setShowBar(currentFeatures.bars[0]),
        currentFeatures.bars[0].start + currentFeatures.bars[0].duration - currentSeek * 1000,
      )
    }
  }, [currentFeatures?.bars[0]])

  useEffect(() => {
    if (currentFeatures?.bars[0] && currentSeek) {
      setTimeout(
        () => setShowBeat(showBeat.concat(currentFeatures.beats[0])),
        currentFeatures.beats[0].start + currentFeatures.beats[0].duration - currentSeek * 1000,
      )
    }
  }, [currentFeatures?.beats[0]])
  return showBar ? (
    <div className="absolute flex-row" style={{ right: '15px', top: '15px' }}>
      <div className="flex flex-row">
        <AnimatePresence>
          {showBeat.map((b) => (
            <motion.div
              key={b.start}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0, transition: { duration: b.duration - 0.05 } }}
              exit={{ opacity: 0 }}
            >
              Beat
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            key={showBar.start}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, transition: { duration: showBar.duration - 0.05 } }}
            exit={{ opacity: 0 }}
          >
            Bar
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default BeatsBars
