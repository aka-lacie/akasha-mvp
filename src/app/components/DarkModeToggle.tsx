'use client';
import { useTheme } from "next-themes";
import React from 'react'
import { DarkModeSwitch } from 'react-toggle-dark-mode';

export default function DarkModeToggle() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [isDarkMode, setDarkMode] = React.useState(theme === 'dark');

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <DarkModeSwitch
      style={{ marginBottom: '2rem' }}
      checked={isDarkMode}
      onChange={toggleDarkMode}
      size={40}
    />
  )
}