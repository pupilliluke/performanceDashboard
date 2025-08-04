import React from 'react';
import { makeStyles } from '@fluentui/react-components';
import Sidebar from '../Sidebar/Sidebar';

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    width: '100%',
    '@media (max-width: 768px)': {
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '80px', // Account for hamburger button
    },
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      <Sidebar />
      <main className={classes.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default Layout;