import { motion } from 'framer-motion'
import React from 'react'

const transition = {
  duration: 1.5,
  delay: 0,
  ease: [0.43, 0.13, 0.23, 0.96],
}

const Seek = ({
  currentSeek,
  endSeek,
  swap,
  altBackgroundColor,
  textColor,
}: {
  currentSeek: number
  endSeek: number
  swap: boolean
  altBackgroundColor: string
  textColor: string
}): JSX.Element => {
  const mins = Math.floor(currentSeek / 60)
  const secs = Math.floor(currentSeek % 60)

  const endMins = Math.floor(endSeek / 60)
  const endSecs = Math.floor(endSeek % 60)

  return (
    <motion.div
      className="absolute top-0 left-0 p-3 px-5 text-3xl z-50 cursor-default select-none"
      initial={{ opacity: 0, x: '-150%' }}
      animate={{
        x: '0%',
        opacity: 1,
        transition,
      }}
      exit={{ x: '-150%', opacity: 0, transition }}
    >
      <span
        className="transition-colors duration-1000"
        style={{
          color: swap ? altBackgroundColor : textColor,
        }}
      >
        {mins}:{secs < 10 ? `0${secs}` : secs}{' '}
        <span className="opacity-50">
          / {endMins}:{endSecs < 10 ? `0${endSecs}` : endSecs}
        </span>
      </span>
    </motion.div>
  )
}

export default React.memo(Seek)
