import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { api } from "../../services/api"

export default function ConfigSection() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Estados para edição inline
  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [newName, setNewName] = useState(user?.username || "");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveName = () => {
    if (newName.trim() && newName !== user?.username) {
      updateProfile({ username: newName.trim() });
    }
    setEditingName(false);
  };

  const handleSavePassword = async () => {
    if (newPassword.trim()) {
      await updateProfile({ password: newPassword.trim() });
      alert("Senha alterada com sucesso!");
      setNewPassword("");
    }
    setEditingPassword(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja deletar sua conta? Esta ação é irreversível.",
      )
    ) {
      await api.del("/account");
      logout();
    }
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho do perfil */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative group">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt="Foto de perfil"
              className="w-14 h-14 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#185FA5] flex items-center justify-center text-white text-xl font-bold shadow-md">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
            <span className="material-icons text-white text-sm">
              photo_camera
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {user?.username || "Usuário"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email || "email@exemplo.com"}
          </p>
        </div>
      </div>

      {/* Opções */}
      <div className="space-y-1">
        {/* Alterar nome */}
        {editingName ? (
          <div className="flex items-center gap-2 px-3 py-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Salvar
            </button>
            <button
              onClick={() => setEditingName(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
          >
            <span className="material-icons text-gray-400">badge</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Alterar nome
            </span>
          </button>
        )}

        {/* Alterar senha */}
        {editingPassword ? (
          <div className="flex items-center gap-2 px-3 py-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova senha"
              className="flex-1 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
              autoFocus
            />
            <button
              onClick={handleSavePassword}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Salvar
            </button>
            <button
              onClick={() => setEditingPassword(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingPassword(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
          >
            <span className="material-icons text-gray-400">lock</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Alterar senha
            </span>
          </button>
        )}

        {/* Alterar foto */}
        <label className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer text-left">
          <span className="material-icons text-gray-400">photo_camera</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Alterar foto
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </label>

        {/* Tema escuro / claro */}
        <div className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center gap-3">
            <span className="material-icons text-gray-400">
              {theme === "dark" ? "dark_mode" : "light_mode"}
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {theme === "dark" ? "Tema escuro" : "Tema claro"}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              theme === "dark" ? "bg-[#185FA5]" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === "dark" ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Logout + Deletar conta */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
        >
          <span className="material-icons text-gray-400">logout</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Sair da conta
          </span>
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          onClick={handleDeleteAccount}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-left"
        >
          <span className="material-icons text-red-400">delete_forever</span>
          <span className="text-sm text-red-500 font-medium">
            Deletar conta
          </span>
        </button>
      </div>
    </div>
  );
}
