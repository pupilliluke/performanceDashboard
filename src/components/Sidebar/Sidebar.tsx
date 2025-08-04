import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Text,
  makeStyles,
} from '@fluentui/react-components';
import {
  Home20Regular,
  CalendarDay20Regular,
  CalendarWorkWeek20Regular,
  Calendar20Regular,
  Lightbulb20Regular,
  Board20Regular,
  Note20Regular,
  Alert20Regular,
  Navigation20Regular,
  Dismiss20Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  sidebar: {
    width: '250px',
    minWidth: '250px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e1dfdd',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingLeft: '16px',
    paddingRight: '16px',
    position: 'relative',
    transition: 'transform 0.3s ease',
    flexShrink: 0,
    '@media (max-width: 768px)': {
      position: 'fixed',
      top: '0',
      left: '0',
      height: '100vh',
      zIndex: 1000,
      transform: 'translateX(-100%)',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
    },
  },
  sidebarOpen: {
    '@media (max-width: 768px)': {
      transform: 'translateX(0)',
    },
  },
  overlay: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
    },
  },
  hamburgerButton: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
      position: 'fixed',
      top: '16px',
      left: '16px',
      zIndex: 1001,
      backgroundColor: '#0078d4',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      width: '48px',
      height: '48px',
      minWidth: '48px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
  },
  closeButton: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
      position: 'absolute',
      top: '16px',
      right: '16px',
      minWidth: '32px',
      width: '32px',
      height: '32px',
      borderRadius: '4px',
    },
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0078d4',
    marginBottom: '32px',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      marginTop: '48px',
    },
  },
  navButton: {
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: '8px',
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  activeButton: {
    backgroundColor: '#f3f2f1',
    color: '#0078d4',
  },
});

const Sidebar: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when clicking on a nav item on mobile
  const handleNavClick = (path: string) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  // Close sidebar when clicking overlay
  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home20Regular },
    { path: '/day', label: 'Day View', icon: CalendarDay20Regular },
    { path: '/week', label: 'Week View', icon: CalendarWorkWeek20Regular },
    { path: '/month', label: 'Month View', icon: Calendar20Regular },
    { path: '/year', label: 'Year View', icon: Calendar20Regular },
    { path: '/brainstorm', label: 'Brainstorm', icon: Lightbulb20Regular },
    { path: '/kanban', label: 'KanbanPro', icon: Board20Regular },
    { path: '/notes', label: 'Notes', icon: Note20Regular },
    { path: '/reminders', label: 'Reminders', icon: Alert20Regular },
  ];

  return (
    <>
      {/* Hamburger Menu Button for Mobile */}
      <Button
        className={classes.hamburgerButton}
        appearance="primary"
        icon={<Navigation20Regular />}
        onClick={toggleSidebar}
      />

      {/* Overlay for Mobile */}
      {isOpen && (
        <button 
          className={classes.overlay} 
          onClick={handleOverlayClick}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside className={`${classes.sidebar} ${isOpen ? classes.sidebarOpen : ''}`}>
        {/* Close Button for Mobile */}
        <Button
          className={classes.closeButton}
          appearance="subtle"
          icon={<Dismiss20Regular />}
          onClick={() => setIsOpen(false)}
        />

        <Text className={classes.logo}>TodoPro</Text>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                appearance="subtle"
                className={`${classes.navButton} ${isActive ? classes.activeButton : ''}`}
                icon={<Icon />}
                onClick={() => handleNavClick(item.path)}
              >
                {item.label}
              </Button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;