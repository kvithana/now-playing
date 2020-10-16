import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import './styles.css'

const transition = {
  duration: 5,
  ease: [0.43, 0.13, 0.23, 0.96],
}

const FloatingAlbum = ({ image }: { image: string }): React.ReactElement => {
  console.log('render')
  return (
    <AnimatePresence exitBeforeEnter={true}>
      <motion.div
        key={image}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25, transition }}
        exit={{ opacity: 0, transition }}
        className="absolute flex items-center justify-center w-screen h-screen floating-album select-none"
      >
        <div className="absolute w-screen h-screen" />
        <img src={image} />
      </motion.div>
    </AnimatePresence>
  )
}

export default React.memo(FloatingAlbum)
