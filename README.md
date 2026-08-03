# 🏋️ EasyGym

> Uma aplicação web Full Stack para gerenciamento de treinos, desenvolvida como MVP para a disciplina de Desenvolvimento Web da PUC-Rio.

![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Status](https://img.shields.io/badge/Status-Acadêmico-success?style=for-the-badge)

---

## 📖 Sobre

O **EasyGym** é uma aplicação **Full Stack** desenvolvida como projeto da disciplina **Desenvolvimento Web** da **PUC-Rio**.

O sistema permite que usuários criem, acompanhem e analisem seus treinos por meio de uma interface moderna desenvolvida em **React + TypeScript**, consumindo uma API REST construída com **FastAPI**.

A aplicação oferece autenticação JWT, gerenciamento completo de treinos, histórico de atividades, estatísticas e configurações de perfil, com persistência em banco de dados.

---

## 🌐 Demonstração

### Frontend

https://whandger.github.io/PUC-Rio-MVP-front-End-Vite/#/

### Backend

https://github.com/whandger/PUC-Rio-MVP-back-End-FastApi

> **Observação**
>
> Para utilizar todas as funcionalidades é necessário executar o backend ou configurar a variável `VITE_API_URL` apontando para uma API disponível.

---

# ✨ Funcionalidades

## 🔐 Autenticação

- Login utilizando JWT
- Cadastro de usuários
- Recuperação de senha
- Logout
- Rotas protegidas

---

## 🏠 Dashboard

- Saudação personalizada
- Calendário de frequência semanal
- Registro de presença
- Resumo do treino selecionado

---

## 💪 Treinos

- Criar treinos
- Editar treinos
- Excluir treinos
- Adicionar exercícios
- Definir séries
- Definir repetições
- Definir carga
- Pesquisa por nome
- Pesquisa por grupo muscular

---

## 📜 Histórico

- Histórico completo de treinos
- Filtro por período
- Alteração dos pesos registrados
- Visualização detalhada de cada exercício

---

## 📚 Exercícios

- Catálogo completo
- GIF demonstrativo
- Instruções detalhadas
- Página individual para cada exercício

---

## 📊 Estatísticas

- Total de treinos por ano
- Frequência anual
- Gráfico semanal
- Heatmap anual
- Evolução da carga
- Filtros por ano
- Filtros por músculo
- Filtros por exercício

---

## 👤 Conta

- Alteração de nome
- Alteração de senha
- Foto de perfil
- Tema claro/escuro
- Exclusão completa da conta

---

## 🎨 Interface

- Responsiva
- Tema claro/escuro
- Componentes reutilizáveis
- Cards interativos
- Modais
- Página 404 personalizada

---

# 🛠 Tecnologias

## Frontend

- React 18
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Context API
- Axios

## Backend

- FastAPI
- SQLAlchemy
- SQLite / PostgreSQL
- JWT
- Passlib
- Pydantic v2
- Uvicorn

---

# 🚀 Instalação

## Pré-requisitos

- Node.js 16+
- npm

Opcionalmente:

- Backend FastAPI

Clone o projeto:

```bash
git clone https://github.com/whandger/PUC-Rio-MVP-front-End-Vite.git
```

Entre na pasta:

```bash
cd PUC-Rio-MVP-front-End-Vite
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Configure a URL da API:

```env
VITE_API_URL=http://localhost:8000
```

Execute o projeto:

```bash
npm run dev
```

O frontend ficará disponível em:

```
http://localhost:5173
```

---

# 📁 Estrutura

```
src
├── components
├── context
├── data
├── hooks
├── pages
├── services
├── utils
├── App.tsx
├── main.tsx
└── types.ts

public

.env.example
package.json
vite.config.ts
```

---

# 🔗 Comunicação com o Backend

A aplicação utiliza um cliente Axios responsável por:

- configurar automaticamente a URL da API;
- enviar o token JWT no header Authorization;
- tratar erros de requisição;
- centralizar toda a comunicação HTTP.

Todos os dados da aplicação são persistidos através da API REST.

---

# 🧪 Desenvolvimento

Durante o desenvolvimento é possível:

- executar frontend e backend simultaneamente;
- utilizar o catálogo local como fallback;
- criar usuários reais para testes;
- consumir a API local ou remota.

---

# 📚 Repositórios

| Projeto | Link |
|----------|------|
| Frontend | https://github.com/whandger/PUC-Rio-MVP-front-End-Vite |
| Backend | https://github.com/whandger/PUC-Rio-MVP-back-End-FastApi |

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos.

---

# 👨‍💻 Autor

**Whandger Wolf**

GitHub:
https://github.com/whandger

---

<p align="center">
Desenvolvido com ❤️ utilizando React, TypeScript, Vite e FastAPI.
</p>