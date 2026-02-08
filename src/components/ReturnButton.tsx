import { useState, useEffect } from 'react'

// Detects if the app is running as an installed PWA (standalone)
function useIsStandalone() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      // @ts-ignore
      window.navigator.standalone === true;

    setIsStandalone(checkStandalone());

    const mq = window.matchMedia('(display-mode: standalone)');
    const handler = () => setIsStandalone(checkStandalone());
    
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    }
    
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler);
      }
    };
  }, []);

  return isStandalone;
}

export function ReturnButton() {
  const [expanded, setExpanded] = useState(false);
  const isStandalone = useIsStandalone();

  const handleTouchEnd = (e: React.TouchEvent<HTMLAnchorElement>) => {
    if (!expanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  // Hide button in PWA/standalone mode
  if (isStandalone) {
    return null;
  }

  return (
    <a
      href="https://tools.tuhsrpg.com/"
      className={`return-btn${expanded ? ' expanded' : ''}`}
      onTouchEnd={handleTouchEnd}
    >
      <span className="dots"></span>
      <span className="arrow"></span>
      <span className="return-text">Return</span>
    </a>
  );
}
