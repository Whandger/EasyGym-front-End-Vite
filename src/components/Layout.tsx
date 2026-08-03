import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col h-dvh overflow-hidden font-sans dark:bg-gray-950">
      {/* Header sempre no topo */}
      <Header />
      
      {/* Container principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Footer - aparece na esquerda apenas no desktop */}
        <div className="hidden lg:flex">
          <Footer />
        </div>
        
        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-700">
          <Outlet />
        </main>
      </div>
      
      {/* Footer - visível apenas no mobile (embaixo) */}
      <div className="lg:hidden">
        <Footer />
      </div>
    </div>
  );
}