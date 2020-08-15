import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const transition = {
  duration: 1,
  ease: [0.43, 0.13, 0.23, 0.96],
}

const Bars = ({ data }: { data: TrackAudioAnalysis }): JSX.Element => {
  return (
    <div className="flex flex-row">
      Hi.
      <div
        className="bg-red-900"
        style={{
          width: '30px',
          height: `${10 * ((data.segments[0]?.loudness_max || 10) + 40)}px`,
          transition: '0.02s',
        }}
      ></div>
      {/* <AnimatePresence>
        {data.beats.map((b, i) => (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{
              y: '0%',
              opacity: 1,
              transition,
            }}
            exit={{ y: '10%', opacity: 0, transition }}
            key={i}
            className="bg-red-900"
            style={{ width: '30px', height: `${10 * (data.segments[0].loudness_max + 20)}px` }}
          >
            {b.start}
          </motion.div>
        ))}
      </AnimatePresence> */}
    </div>
  )
}

export default Bars
