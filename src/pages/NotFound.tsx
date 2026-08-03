import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
      <h1 className="text-6xl font-bold text-[#3588d4]">404</h1>
      <p className="text-xl">Página não encontrada</p>
      <Link to="/" className="text-[#3588d4] underline hover:text-blue-700">
        Voltar ao início
      </Link>
    </div>
  );
}