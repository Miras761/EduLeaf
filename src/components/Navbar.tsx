import { Leaf, LogIn, LogOut } from 'lucide-react';
import { useAuthState } from '../hooks/useAuthState';
import { loginWithGoogle, logout } from '../firebase';

interface NavbarProps {
  onNavigate: (screen: 'home') => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const { user } = useAuthState();

  return (
    <nav className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-emerald-100 p-2 rounded-xl group-hover:bg-emerald-200 transition-colors">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="ml-3 text-2xl font-bold text-emerald-800 tracking-tight">
              EduLeaf
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=10B981&color=fff`} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border-2 border-emerald-200"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">Выйти</span>
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-medium hover:bg-emerald-200 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Войти</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
