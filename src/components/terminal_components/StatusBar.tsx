import React, { useState, useEffect } from 'react';

const statusMessages = {
  'receivedQuery': 'Received query.',
  'searchingDatabase': 'Searching database...',
  'receivedData': 'Received data.',
  'thinking': 'Thinking...',
  'constructingAnswer': 'Constructing answer...',
  'done': 'Done.',
  'error': 'An ERROR has occurred. Please try a new query.',
  '' : '',
}

const StatusBar: React.FC<StatusBarProps> = ({ status, errorMsg }) => {
  const [displayString, setDisplayString] = useState('');
  const [statusQueue, setStatusQueue] = useState<statusCode[]>([]);
  const [currentStatus, setCurrentStatus] = useState<statusCode>('');
  const [typing, setTyping] = useState(false);

  // When new status arrives, enqueue it
  useEffect(() => {
    if (status) {
      setStatusQueue(prevQueue => [...prevQueue, status]);
    }
  }, [status]);

  // Dequeue next status when the current one is done typing
  useEffect(() => {
    if (!typing && statusQueue.length > 0) {
      const [nextStatus, ...remainingQueue] = statusQueue;
      setCurrentStatus(nextStatus);
      setStatusQueue(remainingQueue);
    }
  }, [typing, statusQueue]);

  // Typewriter effect
  useEffect(() => {
    setDisplayString(''); // Clear the previous string
    
    let index = 0;
    if (currentStatus && statusMessages[currentStatus]) {
      const message = errorMsg ? 
                      `ERROR: ${errorMsg}` :
                      statusMessages[currentStatus];
      setTyping(true);
      const timer = setInterval(() => {
        if (index < message.length) {
          setDisplayString(message.substring(0, index + 1));
          index++;
        } else {
          setTimeout(() => {
            setTyping(false);
          }, 500); // Pause a bit after typing is done
          clearInterval(timer);
        }
      }, 70); // Speed of typewriter, in milliseconds per character

      return () => {
        clearInterval(timer); // Clean-up interval on unmount
      };
    }
  }, [currentStatus]);

  return (
    <div className="font-mono text-green-600 dark:text-green-400">
      {displayString}
      <span className="inline-block bg-green-600 dark:bg-green-400 w-2 h-[1em] relative top-[2px] cursor-blink"></span>
    </div>
  );
};

export default StatusBar;

