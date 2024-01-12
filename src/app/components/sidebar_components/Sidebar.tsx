'use client';

import React, { useEffect } from 'react'
import DarkModeToggle from './DarkModeToggle'
import HelpModal from './HelpModal'
import SettingsModal from './SettingsModal'

export default function Sidebar() {
  const [showHelpModal, setShowHelpModal] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  const toggleHelpModalVisibility = () => {
    setShowHelpModal(!showHelpModal);
  };

  useEffect(() => {
    if (localStorage.getItem('seenHelpModal')) {
      return;
    }

    setTimeout(() => {
      toggleHelpModalVisibility();
      localStorage.setItem('seenHelpModal', 'true');
    }, 1000);
  }, [] );

  return ( <>
    <div className="z-40 fixed top-[5%] left-[5%] flex flex-col justify-center content-center gap-7 lg:gap-10">
      <DarkModeToggle />
      <SettingsModal />
      <i 
        className="far fa-circle-question fa-2xl ml-1 text-gray-500 dark:text-gray-400 drop-shadow hover:text-gray-700 dark:hover:text-gray-300" 
        onClick={toggleHelpModalVisibility}
      />
    </div>

    {showHelpModal && (
      <HelpModal toggleModal={toggleHelpModalVisibility}/>
    )}

    {showSettingsModal && (
      <SettingsModal />
    )}
  </> );
}
