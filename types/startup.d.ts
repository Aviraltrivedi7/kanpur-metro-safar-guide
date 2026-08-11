declare global {
  interface Window {
    /** Signals that the startup splash may exit. Defined by the inline
     * startup script in the HTML shell; called by <SplashScreen/> after
     * the minimum duration + app-ready conditions are met. */
    __kmAppReady?: () => void;
  }
}

export {};
