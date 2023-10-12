import React, { useEffect, useState } from 'react';
import ReconstructingText from './ReconstructingText';
import CloudBlob from './CloudBlob';
import CollapseStar from './CollapseStar';

const DataWordCloud: React.FC<DataWordCloudProps> = ({ data, setAnswerIsReady }) => {
  const [snippets, setSnippets] = useState<string[]>([]);
  const [activeSnippetsIndices, setActiveSnippetsIndices] = useState<number[]>([]);
  const [shuffledSnippetsIndices, setShuffledSnippetsIndices] = useState<number[]>([]);
  const [snippetsPositions, setSnippetsPositions] = useState<Position[]>([]);
  
  const [brainstorm, setBrainstorm] = useState<string[]>([]);
  const [activeBrainstormIndices, setActiveBrainstormIndices] = useState<number[]>([]);
  const [brainstormPositions, setBrainstormPositions] = useState<Position[]>([]);
  const [startBrainstormCollapse, setStartBrainstormCollapse] = useState<boolean>(false);

  useEffect(() => {
    // Ignore data if it's already been set
    if (data.type === 'snippets' && snippets.length === 0) {
      setSnippets(data.info);
    } else if (data.type === 'brainstorm' && brainstorm.length === 0) {
      setBrainstorm(data.info);
    }
  }, [data]);

  useEffect(() => {
    // init snippet positions to (0, 0)
    const initialPositions = snippets.map(() => ({ x: 0, y: 0 }));
    setSnippetsPositions(initialPositions);

    // shuffle snippet indices
    const shuffled = Array.from({ length: snippets.length }, (_, i) => i);
    shuffled.sort(() => Math.random() - 0.5);
    setShuffledSnippetsIndices(shuffled);

    const timeouts = snippets.map((_, index) => 
      setTimeout(() => {
        setActiveSnippetsIndices(prevIndices => [...prevIndices, index]);
      }, index * 300)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [snippets]);

  useEffect(() => {
    if (activeSnippetsIndices.length === 0) return;
    
    // get latest active snippet index
    const newIndex = activeSnippetsIndices[activeSnippetsIndices.length - 1];

    // Schedule this function to run before the next repaint.
    requestAnimationFrame(() => {
      const mappedIndex = shuffledSnippetsIndices[newIndex];
      const angle = (360 / snippets.length) * mappedIndex;
      const xPos = 250 * Math.cos(angle * (Math.PI / 180));
      const yPos = 200 * Math.sin(angle * (Math.PI / 180));
      const newPosition = { x: xPos, y: yPos };

      // Set snippet position at snippetsPositions[newIndex] to newPosition
      setSnippetsPositions(prevPositions => {
        const newPositions = [...prevPositions];
        newPositions[newIndex] = newPosition;
        return newPositions;
      });
    });
  }, [activeSnippetsIndices]);

  useEffect(() => {
    // init brainstorm positions to (0, 0)
    const initialPositions = brainstorm.map(() => ({ x: 0, y: 0 }));
    setBrainstormPositions(initialPositions);

    const timeouts = brainstorm.map((_, index) => 
      setTimeout(() => {
        setActiveBrainstormIndices(prevIndices => [...prevIndices, index]);
      }, index * 200)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [brainstorm]);

  useEffect(() => {
    if (activeBrainstormIndices.length === 0) return;
  
    const newIndex = activeBrainstormIndices[activeBrainstormIndices.length - 1];

    requestAnimationFrame(() => {
      const angle = (360 / brainstorm.length) * newIndex + 15;
      const xPos = 250 * Math.cos(angle * (Math.PI / 180));
      const yPos = 200 * Math.sin(angle * (Math.PI / 180));
      const newPosition = { x: xPos, y: yPos };
  
      setBrainstormPositions(prevPositions => {
        const newPositions = [...prevPositions];
        newPositions[newIndex] = newPosition;
        return newPositions;
      });
    });

    if (newIndex === brainstorm.length - 1) {
      setTimeout(() => {
        setStartBrainstormCollapse(true);
      }, 5000);
    }
  }, [activeBrainstormIndices]);

  useEffect(() => {
    if (!startBrainstormCollapse) return;

    setBrainstormPositions(brainstormPositions.map(() => ({ x: 0, y: 0 })));

    setTimeout(() => {
      setAnswerIsReady(true);
    }, 2500);
  }, [startBrainstormCollapse]);

  return (
    <div className={`relative h-full w-full text-white`}>

      {/* <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 w-4 h-4 rounded-full"></div> */}

      <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${startBrainstormCollapse && "opacity-0"}`}>
        <CloudBlob />
      </div>

      {activeSnippetsIndices.map(index => (
        <div
          key={index}
          className={`absolute left-1/2 top-1/2 transform text-xs`}
          style={{
            '--animation-duration': '3s',
            transition: `all var(--animation-duration) ease-in`,
            transform: `translate(-50%, -50%) translate(${snippetsPositions[index].x}px, ${snippetsPositions[index].y}px)`
          } as React.CSSProperties}
        >
          <div className="relative growDisappear">
            <ReconstructingText targetString={snippets[index]} />
          </div>
        </div>
      ))}
      {activeBrainstormIndices.map(index => (
        <div
          key={index}
          className={`absolute left-1/2 top-1/2 transform text-xs ${startBrainstormCollapse ? 'opacity-0' : 'opacity-100'}`}
          style={{
            '--animation-duration': startBrainstormCollapse ? '1s' : '3s',
            transition: `all var(--animation-duration) ease-in`,
            transform: `translate(-50%, -50%) translate(${brainstormPositions[index].x}px, ${brainstormPositions[index].y}px)`
          } as React.CSSProperties}
        >
          <div className="relative growAndTurnGreen">
            <ReconstructingText targetString={brainstorm[index]} />
          </div>
        </div>
      ))}

      <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
        <CollapseStar startCollapse={startBrainstormCollapse}/>
      </div>
    </div>
  );
};

export default DataWordCloud;