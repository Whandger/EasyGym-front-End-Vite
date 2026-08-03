import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white dark:bg-gray-900 w-full h-[8dvh] shadow-md z-50 px-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
      <div>
        <h1 className="text-[#2686cf] dark:text-blue-400 font-bold text-[24px] leading-tight">
          Easy Gym
        </h1>
        <h4
          className={`text-[#58a7e5] dark:text-blue-300 font-bold text-[17px] m-0 transition-all duration-300 ease-in-out ${
            isHomePage
              ? 'max-h-8 opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          Olá {user?.username || 'usuário'}
        </h4>
      </div>
    </header>
  );
}