import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

export default Layout;