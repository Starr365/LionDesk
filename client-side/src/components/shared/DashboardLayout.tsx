import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useAuthContext } from './AuthContext';
import logo from '../../assets/liondesk.svg';

interface SidebarTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface DashboardLayoutProps {
  roleName: 'Student' | 'Faculty Staff' | 'Administrator (HOD)';
  userName: string;
  children: React.ReactNode;
  activeTab: string;
  tabs: SidebarTab[];
  onAvatarClick?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  roleName,
  userName,
  children,
  activeTab,
  tabs,
  onAvatarClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuthContext();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-main flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="h-16 bg-brand-card border-b border-brand-border/40 fixed top-0 left-0 w-full z-30 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-brand-text-muted hover:text-brand-primary focus:outline-none"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          
          <Link to="/" className="flex items-center">
            <img src={logo} alt="LionDesk Logo" className="h-8 w-auto filter invert brightness-50" />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-brand-primary uppercase tracking-wide">{roleName}</p>
            <p className="text-sm font-extrabold text-brand-text-main leading-tight">{userName}</p>
          </div>
          <button
            onClick={onAvatarClick}
            className="h-8 w-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary text-sm shadow-xs hover:bg-brand-primary hover:text-brand-white transition focus:outline-none shrink-0"
            title="View Profile"
          >
            {userName.split(' ').map((n) => n[0]).join('')}
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Left Sidebar (Desktop) */}
        <aside className="w-64 bg-brand-card border-r border-brand-border/40 hidden md:block fixed left-0 top-16 h-[calc(100vh-64px)] z-20">
          <nav className="p-4 h-full flex flex-col justify-between pb-8">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={tab.onClick}
                    className={`w-full flex items-center space-x-2.5 rounded-xl text-xs tracking-wide transition-all duration-155 text-left ${
                      isActive
                        ? 'bg-brand-primary text-brand-white shadow-md shadow-brand-primary/25 px-4.5 py-3.5 font-bold scale-[1.02]'
                        : 'text-brand-text-muted hover:text-brand-primary hover:bg-brand-silver/20 px-3.5 py-2.5 font-semibold'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="pt-4 border-t border-brand-border/20">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-2.5 rounded-xl text-xs tracking-wide transition-all duration-155 text-left text-brand-text-muted hover:text-red-500 hover:bg-red-50/10 px-3.5 py-2.5 font-semibold"
              >
                <FiLogOut className="h-4.5 w-4.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-brand-primary/10 backdrop-blur-xs z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="w-60 bg-brand-card border-r border-brand-border/40 fixed left-0 top-16 h-[calc(100vh-64px)] z-50 md:hidden animate-slide-in">
              <nav className="p-4 h-full flex flex-col justify-between pb-8">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          tab.onClick();
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2.5 rounded-xl text-xs tracking-wide transition-all duration-155 text-left ${
                          isActive
                            ? 'bg-brand-primary text-brand-white px-4.5 py-3.5 font-bold scale-[1.02]'
                            : 'text-brand-text-muted hover:text-brand-primary hover:bg-brand-silver/20 px-3.5 py-2.5 font-semibold'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="pt-4 border-t border-brand-border/20">
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 rounded-xl text-xs tracking-wide transition-all duration-155 text-left text-brand-text-muted hover:text-red-500 hover:bg-red-50/10 px-3.5 py-2.5 font-semibold"
                  >
                    <FiLogOut className="h-4.5 w-4.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </aside>
          </>
        )}

        {/* Right Main Content */}
        <main className="flex-1 md:pl-64 p-6 sm:p-8 min-h-[calc(100vh-64px)] z-10">
          <div className="max-w-5xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
