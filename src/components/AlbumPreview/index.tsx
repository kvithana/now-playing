import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const transition = {
  duration: 1.5,
  ease: [0.43, 0.13, 0.23, 0.96],
}

const AlbumPreview = ({
  currentTrack,
  swap,
  altBackgroundColor,
  textColor,
}: {
  currentTrack: SpotifyApi.TrackObjectFull
  swap: boolean
  altBackgroundColor: string
  textColor: string
}): JSX.Element => {
  const [display, setDisplay] = useState(false)
  const imageURL = currentTrack.album.images[0].url

  useEffect(() => {
    if (display) {
      const handle = setTimeout(() => setDisplay(false), 10e3)
      return () => clearTimeout(handle)
    }
  }, [display, imageURL])

  useEffect(() => {
    if (!display && swap) {
      const displayHandle = setTimeout(() => setDisplay(true), 10e3)
      return () => {
        clearTimeout(displayHandle)
      }
    }
  }, [swap])

  useEffect(() => {
    setDisplay(true)
  }, [imageURL])

  return (
    <div className="absolute flex-row z-30 cursor-default select-none">
      <AnimatePresence exitBeforeEnter={true}>
        {display ? (
          <motion.div
            key={imageURL}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              y: '0%',
              opacity: 1,
              scale: 1,
              transition,
            }}
            exit={{ y: '10%', opacity: 0, transition }}
            className="rounded-md"
            style={{ width: '300px', height: '300px', backgroundImage: `url(${imageURL})`, backgroundSize: 'cover' }}
          />
        ) : (
          <motion.div
            key={currentTrack?.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{
              y: '0%',
              opacity: 1,
              transition,
            }}
            exit={{ y: '10%', opacity: 0, transition }}
          >
            <p
              style={{
                fontSize: '3em',
                maxWidth: 'max(20ch, 60vw)',
                color: swap ? altBackgroundColor : textColor,
                transition: '5s',
                transform: swap ? 'scale(1.5)' : 'scale(1)',
                textAlign: 'center',
              }}
            >
              {currentTrack ? currentTrack.name : null}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AlbumPreview
