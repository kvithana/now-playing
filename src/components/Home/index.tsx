import React, { useContext, useState, useEffect } from 'react';
import Spotify from 'spotify-web-api-js';
import { PlayerContext } from '../../contexts/player';

const Home = (): JSX.Element => {
  const { currentTrack } = useContext(PlayerContext);

  return (
    <div>
      Hello World!
      <p style={{ fontSize: '4em' }}>{currentTrack ? currentTrack.name : null}</p>
    </div>
  );
};

export default Home;
