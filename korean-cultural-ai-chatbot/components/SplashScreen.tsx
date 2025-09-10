import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 1.5초 후 페이드아웃 시작
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // 2초 후 완전히 숨김 및 메인페이지로 이동
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'url(/main.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 어두운 오버레이와 블러 효과 */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center text-white px-8">
        {/* 메인 로고/타이틀 */}
        <div className="mb-7 animate-fade-in-up">
          <h1 className="font-app-title font-bold text-4xl md:text-7xl mb-4 tracking-wide drop-shadow-2xl">
            K-Docent
          </h1>
          
          <p className="text-xl md:text-1xl font-light tracking-widest opacity-90 drop-shadow-lg">
            한국 문화 AI 가이드
          </p>
        </div>
        
        
        {/* 로딩 애니메이션 */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-md"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-md" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-md" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
      
      {/* 장식적인 요소들 */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse drop-shadow-md"></div>
      <div className="absolute top-20 right-16 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse drop-shadow-md" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-white rounded-full opacity-50 animate-pulse drop-shadow-md" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 right-12 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse drop-shadow-md" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
};

export default SplashScreen;