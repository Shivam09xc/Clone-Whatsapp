import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

function LoadingScreen({ onLoadingComplete }) {
  const progressRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => {
    // Simple animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(screenRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: onLoadingComplete
        });
      }
    });

    tl.from('.loading-icon', {
      scale: 0,
      rotation: -180,
      duration: 1,
      ease: 'back.out'
    })
    .from('.loading-text', {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.2
    }, '-=0.5')
    .to(progressRef.current, {
      width: '100%',
      duration: 2,
      ease: 'none'
    });

  }, [onLoadingComplete]);

  return (
    <div ref={screenRef} className="fixed inset-0 bg-green-50 flex flex-col items-center justify-center z-50">
      <div className="loading-icon w-24 h-24 mb-8">
        <svg viewBox="0 0 24 24" className="w-full h-full text-green-600">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          />
          <path
            fill="currentColor"
            className="animate-spin origin-center"
            d="M12 2v4m0 12v4m-8-12H2m20 0h-4"
          />
        </svg>
      </div>
      <div className="loading-text text-2xl font-bold text-green-600 mb-4">
        Welcome to WhatsApp Clone
      </div>
      <div className="loading-text text-gray-600 mb-8">
        Loading your chats...
      </div>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div ref={progressRef} className="h-full bg-green-500 w-0"></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
