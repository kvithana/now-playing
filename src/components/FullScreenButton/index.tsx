import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

const transition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96],
}

const FSButton = ({
  swap,
  altBackgroundColor,
  textColor,
}: {
  swap: boolean
  altBackgroundColor: string
  textColor: string
}): JSX.Element | null => {
  const [isFS, setIsFS] = useState(false)
  const [FSPossible, setFSpossible] = useState(false)

  const toggleFS = () => {
    if (!isFS) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
  useEffect(() => {
    if (document.fullscreenEnabled) {
      setFSpossible(true)
      if (document.fullscreenElement) {
        setIsFS(true)
      }
      const listener = (event: Event) => {
        if (document.fullscreenElement) {
          setIsFS(true)
        } else {
          setIsFS(false)
        }
      }
      document.addEventListener('fullscreenchange', listener)

      return () => {
        document.removeEventListener('fullscreenchange', listener)
      }
    } else {
      setFSpossible(false)
    }
  }, [])

  if (FSPossible) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { ...transition, delay: 1 } }}
        exit={{ opacity: 0, transition }}
        className="absolute z-50 top-0 right-0 p-5 px-5"
      >
        <button
          onClick={toggleFS}
          className="opacity-50 hover:opacity-100 transform hover:scale-110 transition-all duration-100"
        >
          {!isFS ? (
            <div>
              <div className="flex">
                <div
                  style={{
                    borderColor: swap ? altBackgroundColor : textColor,
                  }}
                  className="h-4 w-4 border-t-4 border-l-4 mr-4"
                />
                <div
                  style={{
                    borderColor: swap ? altBackgroundColor : textColor,
                  }}
                  className="h-4 w-4 border-t-4 border-r-4"
                />
              </div>
              <div className="my-3" />
              <div className="flex">
                <div
                  style={{
                    borderColor: swap ? altBackgroundColor : textColor,
                  }}
                  className="h-4 w-4 border-white border-b-4 border-l-4 mr-4"
                />
                <div
                  style={{
                    borderColor: swap ? altBackgroundColor : textColor,
                  }}
                  className="h-4 w-4 border-white border-b-4 border-r-4"
                />
              </div>
              <div className="flex"></div>
            </div>
          ) : null}
        </button>
      </motion.div>
    )
  }
  return null
}

export default FSButton
