import React, { useContext, useState, useEffect } from 'react'
import Color from 'color'
import Vibrant from 'node-vibrant'
import { motion, AnimatePresence } from 'framer-motion'

import { PlayerContext } from '../../contexts/player'
import { AuthContext } from '../../contexts/auth'
import { useHistory } from 'react-router-dom'
import AlbumPreview from '../AlbumPreview'
import TrackInfo from '../TrackInfo'
import Footer from '../RightFooter'
import Seek from '../Seek'
import FloatingAlbum from '../FloatingAlbum'
import Paused from '../Paused'
import FSButton from '../FullScreenButton'
import useWindowSize from '../../hooks/useWindowSize'

const Home = (): JSX.Element => {
  const { currentTrack, meanLoudness, currentFeatures, currentSeek, isPlaying } = useContext(PlayerContext)

  const { currentUser } = useContext(AuthContext)
  const history = useHistory()
  const [swatchImageURL, setSwatchImageURL] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('white')
  const [textColor, setTextColor] = useState('black')
  const [altTextColor, setAltTextColor] = useState('black')
  const [altBackgroundColor, setAltBackgroundColor] = useState('white')
  const { width } = useWindowSize()

  const [swap, setSwap] = useState(false)

  const transition = {
    duration: 1,
    ease: [0.43, 0.13, 0.23, 0.96],
  }

  const onLoginClick = () => {
    history.push('/login')
  }

  useEffect(() => {
    const setColors = async (image: string) => {
      await Vibrant.from(image)
        .getPalette()
        .then((palette) => {
          if (palette.LightVibrant && palette.DarkMuted && palette.Vibrant && palette.LightMuted) {
            let c = Color(palette.LightVibrant.hex)
            const t = Color(palette.DarkMuted.hex)
            let d = Color(palette.LightMuted.hex)
            const u = Color(palette.Vibrant.hex)
            if (c.contrast(t) < 4) {
              c = c.lighten(2)
            } else if (c.contrast(t) < 7) {
              c = c.lighten(1)
            }
            if (d.contrast(u) < 4) {
              d = d.lighten(3)
            } else if (d.contrast(u) < 7) {
              d = d.lighten(1)
            }
            console.log(d.contrast(u))
            setTextColor(t.hex())
            setAltTextColor(u.hex())
            setAltBackgroundColor(d.hex())
            setBackgroundColor(c.hex())
          }
        })
    }
    if (swatchImageURL !== '') {
      setColors(swatchImageURL)
    }
  }, [swatchImageURL])

  useEffect(() => {
    if (currentTrack) {
      if (currentTrack.album.images[0].url !== swatchImageURL) {
        setSwap(false)
        setSwatchImageURL(currentTrack.album.images[0].url)
      }
    } else {
      setSwap(false)
      setTextColor(Color('black').hex())
      setAltTextColor(Color('black').hex())
      setAltBackgroundColor(Color('white').hex())
      setBackgroundColor(Color('white').hex())
    }
  }, [currentTrack])

  useEffect(() => {
    if (currentFeatures) {
      console.log('Change in sections')
      console.log('delta', currentFeatures.sections[0]?.analysisItemDelta)
    }

    if (meanLoudness && currentFeatures) {
      if (currentFeatures.sections[0]?.loudness > meanLoudness) {
        if (!swap) {
          setSwap(true)
        }
        //   console.log('peaking!');
      } else {
        if (swap) {
          setSwap(false)
        }
      }
    }
  }, [meanLoudness, currentFeatures?.sections[0]])

  //useEffect(() => {
  //  if (currentFeatures?.bars[0] && currentSeek) {
  //    setTimeout(
  //      () => console.log('BOP!'),
  //      currentFeatures.bars[0].start + currentFeatures.bars[0].duration - currentSeek * 1000,
  //    );
  //  }
  //}, [currentFeatures?.bars[0]]);

  //useEffect(() => {
  //  if (currentFeatures?.bars[0] && currentSeek) {
  //    setTimeout(
  //      () => console.log('BAP!'),
  //      currentFeatures.beats[0].start + currentFeatures.beats[0].duration - currentSeek * 1000,
  //    );
  //  }
  //}, [currentFeatures?.beats[0]]);

  //useEffect(() => {
  //  if (currentFeatures) {
  //    console.log('Section change at ', currentFeatures.sections[0]);
  //    setHardSwap(true)
  //    setTimeout(() => {
  //      setHardSwap(false)
  //    }, 100);
  //  }
  //}, [currentFeatures?.sections[0]]);

  if (!currentUser) {
    return (
      <div style={{ backgroundColor: swap ? textColor : backgroundColor }} className="w-screen h-screen">
        <div
          style={{ backgroundColor: swap ? textColor : backgroundColor, transition: '5s' }}
          className="w-full h-full flex flex-col justify-center items-center"
        >
          <motion.div
            key="null"
            className="flex flex-col justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{
              y: '0%',
              opacity: 1,
              transition,
            }}
            exit={{ y: '10%', opacity: 0, transition }}
            style={{ height: '50px' }}
          >
            <div className="text-center p-5" style={{ maxWidth: '500px' }}>
              <p className="mb-5">
                Now Playing is a simple web-app to visualise your currently playing track on Spotify with pretty colours
                based off the album images.
              </p>
              <p className="mb-5">It&apos;s a nice screensaver to have up at a party or while studying 🤓.</p>
              <p className="">Designed for Tablet or Desktop 💻.</p>
            </div>
            {width && width > 700 ? (
              <button onClick={onLoginClick} className="spotify-button">
                Connect Spotify
              </button>
            ) : (
              <button className="bg-gray-500 px-8 py-4 rounded-full my-8 cursor-not-allowed font-semibold text-white text-lg uppercase tracking-wide">
                Desktop Device Required
              </button>
            )}

            <div className="text-center text-gray-500">
              <p className="mb-2">
                Powered by the{' '}
                <a
                  className="border-b text-gray-500"
                  href="https://developer.spotify.com/documentation/web-api/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Spotify API
                </a>
                .
              </p>
              <a
                className="text-gray-500 border-b m-2"
                href="https://github.com/kvithana/now-playing"
                target="_blank"
                rel="noreferrer"
              >
                Github
              </a>{' '}
              |{' '}
              <a
                className="text-gray-500 border-b m-2"
                href="https://twitter.com/_kalpal"
                target="_blank"
                rel="noreferrer"
              >
                Twitter
              </a>
            </div>
          </motion.div>
        </div>
        <Footer color={swap ? backgroundColor : textColor} />
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: swap ? textColor : backgroundColor }} className="w-screen h-screen">
      <div
        style={{ backgroundColor: swap ? altTextColor : backgroundColor, transition: '5s' }}
        className="w-full h-full flex flex-column justify-center items-center"
      >
        <AnimatePresence exitBeforeEnter={true}>
          {currentTrack && currentSeek ? (
            <Seek
              currentSeek={currentSeek}
              endSeek={currentTrack.duration_ms / 1e3}
              swap={swap || !isPlaying}
              altBackgroundColor={altBackgroundColor}
              textColor={textColor}
            />
          ) : null}
        </AnimatePresence>
        <AnimatePresence exitBeforeEnter={true}>
          {currentTrack ? (
            <AlbumPreview
              currentTrack={currentTrack}
              swap={swap}
              altBackgroundColor={altBackgroundColor}
              textColor={textColor}
            />
          ) : null}
        </AnimatePresence>
        <AnimatePresence exitBeforeEnter={true}>
          {!isPlaying ? <Paused altBackgroundColor={altBackgroundColor} textColor={textColor} /> : null}
        </AnimatePresence>
        <AnimatePresence exitBeforeEnter={true}>
          {swatchImageURL ? <FloatingAlbum image={swatchImageURL} /> : null}
        </AnimatePresence>
        <AnimatePresence exitBeforeEnter={true}>
          {currentTrack ? (
            <TrackInfo
              currentTrack={currentTrack}
              swap={swap || !isPlaying}
              altBackgroundColor={altBackgroundColor}
              textColor={textColor}
            />
          ) : null}
        </AnimatePresence>
        <AnimatePresence exitBeforeEnter={true}>
          {isPlaying ? (
            <FSButton swap={swap || !isPlaying} altBackgroundColor={altBackgroundColor} textColor={textColor} />
          ) : null}
        </AnimatePresence>

        <Footer color={swap ? backgroundColor : textColor} />
      </div>
    </div>
  )
}

export default Home
