import '../styles.css'; // 引入全局样式
import { useState, useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
