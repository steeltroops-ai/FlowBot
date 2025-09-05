import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ErrorBanner from '../ui/ErrorBanner';
import useUIStore from '../../store/uiStore';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { validationErrors, showErrorBanner, clearErrors } = useUIStore();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Error Banner */}
      <ErrorBanner
        errors={validationErrors}
        isVisible={showErrorBanner}
        onClose={clearErrors}
      />

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative">
          {children}
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
};

export default Layout;
