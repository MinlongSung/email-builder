import React from 'react';
import { SunIcon, MoonIcon } from '../../assets/icons/TopbarIcons';
import { useTheme } from '../hooks/useTheme';
import styles from './ThemeToggle.module.css';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={styles.toggleButton}
      title="Toggle dark mode"
    >
      {isDark ? (
        <MoonIcon size={16} strokeWidth={2.5} />
      ) : (
        <SunIcon size={16} strokeWidth={2.5} />
      )}
    </button>
  );
};
