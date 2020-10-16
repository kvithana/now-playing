import React, { useContext, useState, useEffect } from 'react'
import { PlayerContext } from '../../contexts/player'
import { AnimatePresence, motion } from 'framer-motion'
import Emoji from 'a11y-react-emoji'
import { AuthContext } from '../../contexts/auth'

const transition = {
  duration: 0.5,
  ease: [0.43, 0.13, 0.23, 0.96],
}

const Footer = ({ color }: { color: string }): JSX.Element => {
  const { currentFeatures } = useContext(PlayerContext)
  const { currentUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const featuresExist = !!currentFeatures

  const toGithub = () => {
    window.open('https://github.com/kvithana/now-playing', '_blank')
  }

  const toTwitter = () => {
    window.open('https://twitter.com/_kalpal', '_blank')
  }

  useEffect(() => {
    if (!featuresExist) {
      setLoading(true)
    }
    if (featuresExist && loading) {
      const handle = setTimeout(() => setLoading(false), 1000)
      return () => clearTimeout(handle)
    }
  }, [featuresExist])

  return (
    <div className="absolute flex items-center right-0 bottom-0 p-4 px-5 justify-center z-50" style={{ color: color }}>
      <AnimatePresence>
        {currentUser && loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition,
            }}
            exit={{ opacity: 0, transition }}
            className="text-lg"
          >
            {currentFeatures ? <Emoji symbol="👌" role="okay" /> : <i className="fas fa-spinner fa-pulse"></i>}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <img
        height="25"
        width="25"
        className="ml-2 cursor-pointer opacity-25 hover:opacity-100"
        src="https://unpkg.com/simple-icons@v3/icons/twitter.svg"
        onClick={toTwitter}
      />
      <img
        height="25"
        width="25"
        className="ml-2 cursor-pointer opacity-25 hover:opacity-100"
        src="https://unpkg.com/simple-icons@v3/icons/github.svg"
        onClick={toGithub}
      />
    </div>
  )
}

export default Footer
