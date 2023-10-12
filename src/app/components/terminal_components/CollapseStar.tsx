import React from 'react';
import './CollapseStar.css';

interface StarComponentProps {
  startCollapse: boolean;
}

const StarComponent: React.FC<StarComponentProps> = ({ startCollapse }) => {
  return (
    <div className={`star-container ${startCollapse ? 'scale-100 opacity-100 start-collapse' : 'scale-[0.3] opacity-30'} transition-all duration-[2s]`}>
        <div className="star-core"></div>
    </div>
  );
};

export default StarComponent;
