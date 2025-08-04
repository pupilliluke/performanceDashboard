import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Text,
  makeStyles,
  shorthands,
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
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  sidebar: {
    width: '250px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e1dfdd',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('20px', '16px'),
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0078d4',
    marginBottom: '32px',
    textAlign: 'center',
  },
  navButton: {
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: '8px',
    ...shorthands.padding('12px', '16px'),
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
    <aside className={classes.sidebar}>
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
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;