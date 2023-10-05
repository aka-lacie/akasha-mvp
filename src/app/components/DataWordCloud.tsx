import React, { useEffect, useState } from 'react';
import ReconstructingText from './ReconstructingText';

interface DataWordCloudProps {
  data: { 
    type: 'snippets' | 'brainstorm' | '',
    info: string[]
  };
}

const DataWordCloud: React.FC<DataWordCloudProps> = ({ data }) => {
  const [snippets, setSnippets] = useState<string[]>([]);
  const [brainstorm, setBrainstorm] = useState<string[]>([]);
  const [activeSnippetsIndices, setActiveSnippetsIndices] = useState<number[]>([]);
  const [activeBrainstormIndices, setActiveBrainstormIndices] = useState<number[]>([]);

  useEffect(() => {
    if (data.type === 'snippets') {
      setSnippets(data.info);
    } else if (data.type === 'brainstorm') {
      setBrainstorm(data.info);
    }
  }, [data]);

  useEffect(() => {
    const timeouts = snippets.map((_, index) => 
      setTimeout(() => {
        setActiveSnippetsIndices(prevIndices => [...prevIndices, index]);
      }, index * 200)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [snippets]);

  useEffect(() => {
    const timeouts = brainstorm.map((_, index) => 
      setTimeout(() => {
        setActiveBrainstormIndices(prevIndices => [...prevIndices, index]);
      }, index * 100)
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [brainstorm]);

  return (
    <div>
      {activeSnippetsIndices.map(index => (
        <div key={index}>
          <ReconstructingText targetString={snippets[index]} />
        </div>
      ))}
      {activeBrainstormIndices.map(index => (
        <div key={index}>
          <ReconstructingText targetString={brainstorm[index]} />
        </div>
      ))}
    </div>
  );
};

export default DataWordCloud;