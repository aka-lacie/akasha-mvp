'use client';

import React, { useEffect } from 'react'
import DarkModeToggle from './DarkModeToggle'
import HelpModal from './HelpModal'

export default function Sidebar() {
  const [showHelpModal, setShowHelpModal] = React.useState(false);

  const toggleModalVisibility = () => {
    setShowHelpModal(!showHelpModal);
  };

  useEffect(() => {
    if (localStorage.getItem('seenHelpModal')) {
      return;
    }

    setTimeout(() => {
      toggleModalVisibility();
      localStorage.setItem('seenHelpModal', 'true');
    }, 1000);
  }, [] );

  return ( <>
    <div className="z-40 fixed top-[5%] left-[5%] flex flex-col justify-center content-center gap-7 lg:gap-10">
      <DarkModeToggle />
      <i className="fas fa-cog fa-2xl ml-1 mb-4 text-gray-600 dark:text-gray-400 drop-shadow" />
      <i 
        className="far fa-circle-question fa-2xl ml-1 text-gray-500 dark:text-gray-400 drop-shadow" 
        onClick={toggleModalVisibility}
      />
    </div>

    {showHelpModal && (
      <HelpModal toggleModal={toggleModalVisibility}/>
    )}
  </> )
}
