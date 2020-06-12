import React, { useContext, useState, useEffect } from 'react';
import Color from 'color';
import Vibrant from 'node-vibrant';
import { motion, AnimatePresence } from 'framer-motion';

import { PlayerContext } from '../../contexts/player';

const Home = (): JSX.Element => {
  const { currentTrack, meanLoudness, currentFeatures, currentSeek } = useContext(PlayerContext);

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

  useEffect(() => {
    const setColors = async (image: string) => {
      await Vibrant.from(image)
        .getPalette()
        .then((palette) => {
          if (palette.LightVibrant && palette.DarkMuted && palette.Vibrant && palette.LightMuted) {
            const c = Color(palette.LightVibrant.hex);
            const t = Color(palette.DarkMuted.hex);
            const d = Color(palette.LightMuted.hex);
            const u = Color(palette.Vibrant.hex);
            if (c.contrast(t) < 4) {
              //   c = c.lighten(0.4);
            } else if (c.contrast(t) < 7) {
              //   c = c.lighten(0.2);
            }
            if (d.contrast(u) < 4) {
              //   d = d.lighten(0.4);
            } else if (d.contrast(u) < 7) {
              //   d = d.lighten(0.2);
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
      if (currentTrack.album.images[0].url != swatchImageURL) {
        setSwatchImageURL(currentTrack.album.images[0].url);
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (meanLoudness && currentFeatures) {
      if (currentFeatures.sections[0]?.loudness > meanLoudness) {
        setSwap(true);
        //   console.log('peaking!');
      } else {
        setSwap(false);
      }
    }
  }, [meanLoudness, currentFeatures]);

  useEffect(() => {
    if (currentFeatures?.bars[0] && currentSeek) {
      setTimeout(
        () => console.log('BOP!'),
        currentFeatures.bars[0].start + currentFeatures.bars[0].duration - currentSeek * 1000,
      );
    }
  }, [currentFeatures?.bars[0]]);

  useEffect(() => {
    if (currentFeatures?.bars[0] && currentSeek) {
      setTimeout(
        () => console.log('BAP!'),
        currentFeatures.beats[0].start + currentFeatures.beats[0].duration - currentSeek * 1000,
      );
    }
  }, [currentFeatures?.beats[0]]);

  return (
    <div style={{ backgroundColor: swap ? textColor : backgroundColor }} className="w-screen h-screen">
      <div
        style={{ backgroundColor: swap ? textColor : backgroundColor, transition: '5s' }}
        className="w-full h-full flex"
      >
        <AnimatePresence exitBeforeEnter={true}>
          <motion.p
            key={currentTrack?.id}
            initial={{ opacity: 0, y: 100 }}
            animate={{
              y: '0%',
              opacity: 1,
              transition,
            }}
            exit={{ y: '50%', opacity: 0, transition }}
            style={{ position: 'absolute', fontSize: '4em', color: swap ? backgroundColor : textColor }}
          >
            {currentTrack ? currentTrack.name : null}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
