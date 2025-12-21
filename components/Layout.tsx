
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, BookOpen, LogOut, Award, Shield, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Avatar from './Avatar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <div className="min-h-screen bg-light">{children}</div>;

  const NavItem = ({ to, icon: Icon, label, tab }: any) => {
    const isPathActive = location.pathname === to;
    const isTabActive = tab 
        ? location.search === `?tab=${tab}` || (location.search === '' && tab === 'overview')
        : location.search === '';

    const isActive = isPathActive && isTabActive;

    return (
      <Link
        to={to + (tab ? `?tab=${tab}` : '')}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive 
            ? 'bg-blue-100 text-blue-600 border-2 border-blue-200' 
            : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="font-bold hidden md:block">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <nav className="fixed bottom-0 md:relative md:w-64 w-full bg-white border-t md:border-r md:border-t-0 border-gray-200 z-50">
        <div className="flex md:flex-col h-full md:p-4 justify-between">
          
          <div className="hidden md:flex flex-col items-center mb-8 pt-4">
             <h1 className="text-2xl font-black text-secondary tracking-tight">
               Ciencias<span className="text-primary">Quest</span>
             </h1>
             <div className="h-1 w-12 bg-accent mt-1 rounded-full"></div>
          </div>

          <div className="flex md:flex-col justify-around w-full md:space-y-2 p-2 md:p-0">
            {user.role === UserRole.ADMIN ? (
                 <NavItem to="/admin-panel" icon={Shield} label="Admin" />
            ) : user.role === UserRole.TEACHER ? (
                <>
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Visão Geral" tab="overview" />
                    <NavItem to="/dashboard" icon={BookOpen} label="Currículo" tab="curriculum" />
                    <NavItem to="/dashboard" icon={Settings} label="Minhas Turmas" tab="classrooms" />
                    <NavItem to="/profile" icon={User} label="Perfil" />
                </>
            ) : (
                <>
                    <NavItem to="/dashboard" icon={Home} label="Início" />
                    <NavItem to="/leaderboard" icon={Award} label="Ranking" />
                    <NavItem to="/profile" icon={User} label="Perfil" />
                </>
            )}
          </div>

          <div className="hidden md:block border-t pt-4 mt-auto">
             <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-colors">
               <LogOut size={20} />
               <span className="font-bold">Sair</span>
             </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto h-screen pb-20 md:pb-0">
        <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-40">
           <span className="text-xl font-extrabold text-secondary">Ciencias<span className="text-primary">Quest</span></span>
           <div className="flex items-center gap-2">
             {user.role !== UserRole.ADMIN && <span className="font-bold text-accent">{user.xp || 0} XP</span>}
             {user.avatarConfig && <Avatar config={user.avatarConfig} size={32} />}
           </div>
        </header>

        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
