// hooks/useWarmUpBrowser.ts
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
export default function useWarmUpBrowser() {
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
    WebBrowser.warmUpAsync();
    return () => { WebBrowser.coolDownAsync(); };
  }, []);
}
