import Color from 'color'
import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
const transition = {
  duration: 1,
  ease: [0.43, 0.13, 0.23, 0.96],
}

const Paused = ({ altBackgroundColor, textColor }: { altBackgroundColor: string; textColor: string }): JSX.Element => {
  const { endSession } = useContext(AuthContext)
  const handleEndSession = () => {
    endSession()
  }

  return (
    <motion.div
      className="w-screen h-screen flex justify-center items-center absolute"
      style={{
        backgroundBlendMode: 'overlay',
        zIndex: 40,
        backgroundColor: Color(textColor).darken(0.4).hex(),
        color: altBackgroundColor,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.9, transition }}
      exit={{ opacity: 0, transition }}
    >
      <div className="flex">
        <div className="w-10 h-40" style={{ backgroundColor: altBackgroundColor }} />
        <div className="w-10 h-40 ml-12" style={{ backgroundColor: altBackgroundColor }} />
      </div>
      <div className="absolute top-0 right-0 p-5 px-5">
        <button
          onClick={handleEndSession}
          className="text-xl bg-white text-black p-1 px-2 rounded-md hover:opacity-100 opacity-50"
        >
          End Session
        </button>
      </div>
    </motion.div>
  )
}

export default Paused
