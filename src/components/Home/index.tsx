import React, { useContext, useState, useEffect } from 'react';
import Color from 'color';
import Vibrant from 'node-vibrant';
import { motion, AnimatePresence } from 'framer-motion';

import { PlayerContext } from '../../contexts/player';
import { AuthContext } from '../../contexts/auth';
import { useHistory } from 'react-router-dom';

const Home = (): JSX.Element => {
  const { currentTrack, meanLoudness, currentFeatures, currentSeek, meanLoudnessDelta } = useContext(PlayerContext);

  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const [swatchImageURL, setSwatchImageURL] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [textColor, setTextColor] = useState('black');
  const [altTextColor, setAltTextColor] = useState('black');
  const [altBackgroundColor, setAltBackgroundColor] = useState('white');

  const [swap, setSwap] = useState(false);

  const transition = {
    duration: 1,
    ease: [0.43, 0.13, 0.23, 0.96],
  };

  const onLoginClick = () => {
    history.push('/login');
  };

  useEffect(() => {
    const setColors = async (image: string) => {
      await Vibrant.from(image)
        .getPalette()
        .then((palette) => {
          if (palette.LightVibrant && palette.DarkMuted && palette.Vibrant && palette.LightMuted) {
            let c = Color(palette.LightVibrant.hex);
            const t = Color(palette.DarkMuted.hex);
            let d = Color(palette.LightMuted.hex);
            const u = Color(palette.Vibrant.hex);
            if (c.contrast(t) < 4) {
              c = c.lighten(0.4);
            } else if (c.contrast(t) < 7) {
              c = c.lighten(0.2);
            }
            if (d.contrast(u) < 4) {
              d = d.lighten(0.4);
            } else if (d.contrast(u) < 7) {
              d = d.lighten(0.2);
            }
            setTextColor(t.hex());
            setAltTextColor(u.hex());
            setAltBackgroundColor(d.hex());
            setBackgroundColor(c.hex());
          }
        });
    };
    if (swatchImageURL !== '') {
      setColors(swatchImageURL);
    }
  }, [swatchImageURL]);

  useEffect(() => {
    if (currentTrack) {
      if (currentTrack.album.images[0].url !== swatchImageURL) {
        setSwatchImageURL(currentTrack.album.images[0].url);
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (currentFeatures) {
      console.log('Change in sections');
      console.log('delta', currentFeatures.sections[0]?.analysisItemDelta);
    }

    if (meanLoudness && currentFeatures) {
      if (currentFeatures.sections[0]?.loudness > meanLoudness) {
        if (!swap) {
          setSwap(true);
        }
        //   console.log('peaking!');
      } else {
        if (swap) {
          setSwap(false);
        }
      }
    }
  }, [meanLoudness, currentFeatures?.sections[0]]);

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
          className="w-full h-full flex flex-column justify-center items-center"
        >
          <motion.div
            key="null"
            initial={{ opacity: 0, y: 50 }}
            animate={{
              y: '0%',
              opacity: 1,
              transition,
            }}
            exit={{ y: '10%', opacity: 0, transition }}
            style={{ height: '50px' }}
          >
            <button onClick={onLoginClick} className="spotify-button">
              Log In To Start Visualising
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: swap ? textColor : backgroundColor }} className="w-screen h-screen">
      <div
        style={{ backgroundColor: swap ? altTextColor : backgroundColor, transition: '5s' }}
        className="w-full h-full flex flex-column justify-center items-center"
      >
        {currentTrack ? (
          <AnimatePresence exitBeforeEnter={true}>
            <motion.div
              key={currentTrack?.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                y: '0%',
                opacity: 1,
                transition,
              }}
              exit={{ y: '10%', opacity: 0, transition }}
              style={{ height: '50px' }}
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
          </AnimatePresence>
        ) : (
          <motion.div
            key="null"
            initial={{ opacity: 0, y: 50 }}
            animate={{
              y: '0%',
              opacity: 1,
              transition,
            }}
            exit={{ y: '10%', opacity: 0, transition }}
            style={{ height: '50px' }}
          >
            <p
              style={{
                fontSize: '1em',
                color: swap ? backgroundColor : textColor,
                transition: '5s',
                transform: swap ? 'scale(1.5)' : 'scale(1)',
                textAlign: 'center',
              }}
            >
              Connected to Spotify 🎵
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
