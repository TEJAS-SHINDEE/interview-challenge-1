import React from 'react';
import { WindowWidthProvider } from '../components/hooks/WindowWidthContext';
import '../public/style/style.css';

function MyApp({ Component, pageProps }) {
  return (
    <WindowWidthProvider>
      <Component {...pageProps} />
    </WindowWidthProvider>
  );
}

export default MyApp;