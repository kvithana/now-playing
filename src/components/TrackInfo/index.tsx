import React, { useState, useEffect, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PlayerContext } from '../../contexts/player'

const transition = {
  duration: 1.5,
  delay: 0,
  ease: [0.43, 0.13, 0.23, 0.96],
}

const TrackInfo = ({
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
  const [hide, setHide] = useState(false)
  const imageURL = currentTrack.album.images[0].url

  const { currentSeek } = useContext(PlayerContext)

  useEffect(() => {
    if (display) {
      const handle = setTimeout(() => setDisplay(false), 10e3)

      return () => clearTimeout(handle)
    }
  }, [display, imageURL])

  useEffect(() => {
    if (currentSeek && currentSeek > (currentTrack.duration_ms - 10e3) / 1e3) {
      setHide(true)
    }
  }, [currentSeek])

  useEffect(() => {
    if (!hide && swap) {
      setHide(true)
      const clearHide = setTimeout(() => setHide(false), 10e3)
      return () => {
        setHide(false)
        clearTimeout(clearHide)
      }
    }
    if (!display && swap) {
      const displayHandle = setTimeout(() => setDisplay(true), 10e3)
      return () => {
        clearTimeout(displayHandle)
      }
    }
  }, [swap])

  useEffect(() => {
    setDisplay(true)
    setHide(true)
    const clearHide = setTimeout(() => setHide(false), 10e3)
    return () => {
      clearTimeout(clearHide)
    }
  }, [imageURL])

  return (
    <div className="absolute flex-row opacity-75 z-50 cursor-default select-none px-5 p-3 bottom-0 left-0">
      <AnimatePresence exitBeforeEnter={true}>
        {hide ? null : display ? (
          <motion.div
            key={currentTrack.album.id}
            initial={{ opacity: 0, x: '-100%' }}
            animate={{
              x: '0%',
              opacity: [0, 1],
              transition,
            }}
            exit={{ x: '-100%', opacity: 0, transition }}
            className="rounded-md text-3xl"
            style={{
              color: swap ? altBackgroundColor : textColor,
            }}
          >
            <span className="font-semibold" style={{ transition: '1s' }}>
              {currentTrack.album.name}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, x: '-100%' }}
            animate={{
              x: '0%',
              opacity: [0, 1],
              transition,
            }}
            exit={{ x: '-100%', opacity: 0, transition }}
            className="text-3xl"
            style={{
              color: swap ? altBackgroundColor : textColor,
            }}
          >
            <span className="italic" style={{ transition: '1s' }}>
              {currentTrack.artists.map((a) => a.name).join(', ')}
            </span>{' '}
            <span style={{ transition: '1s' }}>- {currentTrack.name}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TrackInfo
