import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Função auxiliar para validar email (formato básico)
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function LoginPage() {
  const { login, register, forgotPassword } = useAuth();
  const navigate = useNavigate();

  // Estados do formulário de login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Estados do modal de registro
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Estados do modal de recuperação
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Estados de feedback
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // --- VALIDAÇÕES PARA O REGISTRO ---
  const isRegisterFormValid = () => {
    return (
      isValidEmail(registerEmail) &&
      registerUsername.trim().length > 0 &&
      registerPassword.trim().length > 0 // apenas não vazio
    );
  };

  // --- VALIDAÇÕES PARA LOGIN ---
  const isLoginFormValid = () => {
    return loginUsername.trim().length > 0 && loginPassword.trim().length > 0;
  };

  // --- VALIDAÇÃO PARA RECUPERAÇÃO ---
  const isForgotFormValid = () => {
    return isValidEmail(forgotEmail);
  };

  // --- HANDLE LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await login(loginUsername, loginPassword);
      if (result) {
        navigate('/');
      } else {
        setError('Usuário ou senha inválidos');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE REGISTER ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validações manuais
    if (!isValidEmail(registerEmail)) {
      setError('Email inválido. Use o formato usuario@dominio.com');
      setLoading(false);
      return;
    }
    if (registerUsername.trim().length === 0) {
      setError('O nome de usuário é obrigatório');
      setLoading(false);
      return;
    }
    if (registerPassword.trim().length === 0) {
      setError('A senha não pode estar vazia');
      setLoading(false);
      return;
    }

    try {
      const result = await register(registerEmail, registerUsername, registerPassword);
      if (result) {
        setSuccess('Registro realizado com sucesso!');
        setShowRegister(false);
        navigate('/');
      } else {
        setError('Usuário ou email já cadastrado');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE FORGOT PASSWORD ---
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!isValidEmail(forgotEmail)) {
      setError('Digite um email válido');
      setLoading(false);
      return;
    }

    try {
      const result = await forgotPassword(forgotEmail);
      if (result) {
        setSuccess('Email de recuperação enviado!');
        setShowForgot(false);
      } else {
        setError('Email não encontrado');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#58a7e5] flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/buried.png")',
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-64">
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="0.3"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Tela de Login */}
        {!showRegister && !showForgot && (
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-[#58a7e5]">
              LOGIN
            </h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full border-b-2 border-[#58a7e5] py-2 px-1 focus:outline-none focus:border-[#2686cf]"
                  placeholder="Coloque seu login"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border-b-2 border-[#58a7e5] py-2 px-1 focus:outline-none focus:border-[#2686cf]"
                  placeholder="Coloque sua senha"
                  required
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    style={{ accentColor: '#58a7e5' }}
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 h-4 w-4 text-[#58a7e5] focus:ring-[#58a7e5] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600">Lembrar-se de mim</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm text-[#58a7e5] hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <button
                type="submit"
                disabled={!isLoginFormValid() || loading}
                className={`w-full text-white font-bold py-3 rounded-lg transition-colors mb-4
                  ${isLoginFormValid() && !loading
                    ? 'bg-[#58a7e5] hover:bg-[#2686cf] cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                {loading ? 'ENTRANDO...' : 'LOGIN'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="text-sm text-gray-600 hover:text-[#58a7e5]"
                >
                  Não tem uma conta?{' '}
                  <span className="text-[#58a7e5] font-semibold">Registre-se</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal de Registro */}
        {showRegister && (
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-[#58a7e5]">
              REGISTER
            </h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className={`w-full border-b-2 py-2 px-1 focus:outline-none focus:border-[#2686cf]
                    ${registerEmail && !isValidEmail(registerEmail)
                      ? 'border-red-500'
                      : 'border-[#58a7e5]'
                    }`}
                  placeholder="Digite seu email"
                  required
                />
                {registerEmail && !isValidEmail(registerEmail) && (
                  <p className="text-red-500 text-xs mt-1">Formato inválido (ex: usuario@dominio.com)</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário
                </label>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className={`w-full border-b-2 py-2 px-1 focus:outline-none focus:border-[#2686cf]
                    ${registerUsername && registerUsername.trim().length === 0
                      ? 'border-red-500'
                      : 'border-[#58a7e5]'
                    }`}
                  placeholder="Digite o nome de usuário"
                  required
                />
                {registerUsername && registerUsername.trim().length === 0 && (
                  <p className="text-red-500 text-xs mt-1">Usuário não pode estar vazio</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className={`w-full border-b-2 py-2 px-1 focus:outline-none focus:border-[#2686cf]
                    ${registerPassword && registerPassword.trim().length === 0
                      ? 'border-red-500'
                      : 'border-[#58a7e5]'
                    }`}
                  placeholder="Digite sua senha"
                  required
                />
                {registerPassword && registerPassword.trim().length === 0 && (
                  <p className="text-red-500 text-xs mt-1">A senha não pode estar vazia</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isRegisterFormValid() || loading}
                className={`w-full text-white font-bold py-3 rounded-lg transition-colors mb-4
                  ${isRegisterFormValid() && !loading
                    ? 'bg-[#58a7e5] hover:bg-[#2686cf] cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                {loading ? 'CADASTRANDO...' : 'REGISTER'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-gray-600 hover:text-[#58a7e5]"
                >
                  Voltar para o Login
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal de Recuperação de Senha */}
        {showForgot && (
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-[#58a7e5]">
              RECOVER ACCOUNT
            </h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <div className="mb-6">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className={`w-full border-b-2 py-2 px-1 focus:outline-none focus:border-[#2686cf]
                    ${forgotEmail && !isValidEmail(forgotEmail)
                      ? 'border-red-500'
                      : 'border-[#58a7e5]'
                    }`}
                  placeholder="Email"
                  required
                />
                {forgotEmail && !isValidEmail(forgotEmail) && (
                  <p className="text-red-500 text-xs mt-1">Email inválido</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isForgotFormValid() || loading}
                className={`w-full text-white font-bold py-3 rounded-lg transition-colors mb-4
                  ${isForgotFormValid() && !loading
                    ? 'bg-[#58a7e5] hover:bg-[#2686cf] cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                {loading ? 'ENVIANDO...' : 'SEND EMAIL'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-gray-600 hover:text-[#58a7e5]"
                >
                  Voltar para o Login
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}