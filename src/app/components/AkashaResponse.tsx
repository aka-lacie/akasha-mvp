import {useState, useEffect} from 'react';

interface AkashaResponseProps {
  answer: string;
}

const AkashaResponse: React.FC<AkashaResponseProps> = ({ answer }) => {
  return (
    <div>
      <p>{answer || 'Response goes here.'}</p>
    </div>
  );
};

export default AkashaResponse;