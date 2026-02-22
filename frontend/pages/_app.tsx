import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  // simple system theme class on <html>
  useEffect(() => {
    const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  }, []);

  return <Component {...pageProps} />;
}
