import React, { useEffect, useState } from 'react';

interface ReconstructingTextProps {
  targetString: string;
}

const ReconstructingText: React.FC<ReconstructingTextProps> = ({ targetString }) => {
  const [currentString, setCurrentString] = useState<string>(generateRandomString(targetString.length));
  const [booleanMask, setBooleanMask] = useState<boolean[]>(Array(targetString.length).fill(false));

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (booleanMask.every(val => val === true)) {
        clearInterval(intervalId);
        return;
      }
      const newMask = updateMask(booleanMask);
      const newString = constructNextString(newMask, targetString);
      setBooleanMask(newMask);
      setCurrentString(newString);
    }, 100); // milliseconds per step
    
    return () => clearInterval(intervalId);
  }, [booleanMask]);

  return <span className="font-mono">{currentString}</span>;
};

const generateRandomString = (l: number) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: l }).map(() => characters[Math.floor(Math.random() * characters.length)]).join('');
};
  
const updateMask = (mask: boolean[]) => {
  const max_num = Math.floor(mask.length / 10);
  const numIndicesToUpdate = Math.floor(Math.random() * max_num) + 1;
  for (let i = 0; i < numIndicesToUpdate; ++i) {
    const randomIndex = Math.floor(Math.random() * mask.length);
    if (!mask[randomIndex]) {
      mask[randomIndex] = true;
    } else {
      // Find leftmost false index and set it to true
      const leftmostFalseIndex = mask.findIndex((isTrue) => !isTrue);
      if (leftmostFalseIndex === -1) {
        // If there are no false indices, then all indices are true and the mask is complete
        break;
      }
      mask[leftmostFalseIndex] = true;
    }
  }
  return mask;
};
  
const constructNextString = (mask: boolean[], correctString: string) => {
  return mask.map((isTrue, index) => (
    isTrue ?
      correctString[index] :
      generateRandomString(1)
    )).join('');
};

const isComplete = (mask: boolean[]) => mask.every(Boolean);

export default ReconstructingText;
