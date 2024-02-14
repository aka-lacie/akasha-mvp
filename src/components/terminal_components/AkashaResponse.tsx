import { useState, useEffect, useRef } from 'react';
import ReconstructingText from './ReconstructingText';

const AkashaResponse: React.FC<AkashaResponseProps> = ({ answer }) => {
  const [showScrollDown, setShowScrollDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      setShowScrollDown(element.scrollHeight > element.clientHeight);
    }
  }, [answer]);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (element) {
      const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
      setShowScrollDown(!atBottom);
    }
  };

  const handleScrollDown = () => {
    const element = scrollRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
      setShowScrollDown(false);
    }
  };

  return (
    <div className="answerBubbleOpen responsiveWidth flex flex-col items-center">
      <div
        className="text-sm text-center textClip max-h-[30vh] overflow-y-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <ReconstructingText targetString={answer} />
      </div>
      {showScrollDown && (
        <div className="absolute -bottom-10 animate-bounce bg-white dark:bg-slate-800 p-2 w-10 h-10 ring-1 ring-slate-900/5 dark:ring-slate-200/20 shadow-lg rounded-full flex self-center items-center justify-center">
          <button
            onClick={handleScrollDown}
          >
            <svg className="w-6 h-6 text-green-500" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AkashaResponse;