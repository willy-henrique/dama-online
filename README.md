# 🎮 Damas Online - Jogo Multiplayer em Tempo Real

Jogo de Damas online totalmente funcional, desenvolvido para navegadores web (desktop e mobile), que permite dois jogadores se conectarem e jogarem em tempo real via Wi-Fi (local ou remoto).

**Desenvolvido por WillTech - Solução web**

## ✨ Funcionalidades

- ✅ **Multiplayer em Tempo Real**: Dois jogadores podem jogar simultaneamente via Socket.IO
- ✅ **Sistema de Salas**: Crie ou entre em salas usando códigos únicos
- ✅ **Regras Completas de Damas**: 
  - Movimentos diagonais válidos
  - Captura obrigatória
  - Múltiplas capturas em sequência
  - Promoção à dama ao chegar no final
- ✅ **Interface Moderna**: Design responsivo com TailwindCSS
- ✅ **Validação de Jogadas**: Todas as jogadas são validadas no servidor
- ✅ **Sincronização Automática**: Estado do jogo sincronizado em tempo real
- ✅ **Controle de Turnos**: Sistema robusto de gerenciamento de turnos
- ✅ **Detecção de Fim de Jogo**: Identifica vitória/derrota automaticamente

## 🏗️ Tecnologias

### Front-end
- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **TailwindCSS** - Estilização moderna
- **Socket.IO Client** - Comunicação em tempo real

### Back-end
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Socket.IO** - WebSockets para tempo real
- **UUID** - Geração de IDs únicos

## 📁 Estrutura do Projeto

```
dama-online/
├── client/                 # Front-end React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   │   ├── GameBoard.jsx
│   │   │   └── GameInfo.jsx
│   │   ├── pages/         # Páginas
│   │   │   ├── HomePage.jsx
│   │   │   └── GamePage.jsx
│   │   ├── utils/         # Utilitários
│   │   │   └── gameLogic.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                 # Back-end Node.js
    ├── controllers/       # Controladores (MVC)
    │   └── GameController.js
    ├── models/            # Modelos de dados
    │   └── Game.js
    ├── sockets/           # Handlers Socket.IO
    │   └── SocketHandler.js
    ├── index.js           # Entry point
    └── package.json
```

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. **Clone o repositório ou navegue até a pasta do projeto**

2. **Instale as dependências de todas as partes:**

```bash
npm run install:all
```

Ou manualmente:

```bash
# Instalar dependências raiz
npm install

# Instalar dependências do cliente
cd client
npm install

# Instalar dependências do servidor
cd ../server
npm install
```

### Executar o Projeto

**Opção 1: Executar tudo de uma vez (recomendado)**

Na raiz do projeto:

```bash
npm run dev
```

Isso iniciará:
- Front-end na porta **3000** (http://localhost:3000)
- Back-end na porta **3001** (http://localhost:3001)

**Opção 2: Executar separadamente**

Terminal 1 - Servidor:
```bash
cd server
npm run dev
```

Terminal 2 - Cliente:
```bash
cd client
npm run dev
```

### Acessar o Jogo

1. Abra seu navegador em `http://localhost:3000`
2. Digite seu nickname
3. Clique em "Criar Sala" ou "Entrar na Sala"
4. Se criou uma sala, compartilhe o código com outro jogador
5. Quando ambos estiverem conectados, o jogo inicia automaticamente!

## 🌐 Deploy Online

Para instruções detalhadas de deploy no Vercel (front-end) e Render/Railway (back-end), consulte o arquivo **[DEPLOY.md](./DEPLOY.md)**.

### Resumo Rápido

1. **Back-end (Render/Railway)**:
   - Conecte o repositório GitHub
   - Configure `Root Directory: server`
   - Adicione variáveis: `PORT=3001` e `CLIENT_URL` (será atualizado depois)

2. **Front-end (Vercel)**:
   - Conecte o repositório GitHub
   - Configure `Root Directory: client`
   - Adicione variável: `VITE_SERVER_URL` (URL do seu servidor)

3. **Atualize CLIENT_URL** no back-end com a URL do Vercel

📖 **Guia completo**: Veja [DEPLOY.md](./DEPLOY.md) para instruções passo a passo.

## 🎯 Como Jogar

1. **Criar Sala:**
   - Digite seu nickname
   - Clique em "Criar Sala"
   - Um código único será gerado
   - Compartilhe este código com seu oponente

2. **Entrar em Sala:**
   - Digite seu nickname
   - Digite o código da sala
   - Clique em "Entrar na Sala"

3. **Jogar:**
   - Clique em uma peça sua para selecioná-la
   - Clique em uma célula destacada para mover
   - Capturas são obrigatórias quando disponíveis
   - Quando uma peça chega ao final, vira dama automaticamente
   - O jogo termina quando um jogador não tem mais peças ou movimentos

## 🎨 Regras do Jogo

- **Movimento**: Peças se movem apenas nas diagonais escuras
- **Captura Obrigatória**: Se houver captura possível, você DEVE capturar
- **Múltiplas Capturas**: Se após uma captura houver outra possível, você deve continuar
- **Promoção**: Peças viram damas ao chegar no final do tabuleiro
- **Damas**: Podem se mover em qualquer diagonal, para frente ou para trás
- **Vitória**: O primeiro jogador a eliminar todas as peças do oponente ou deixá-lo sem movimentos vence

## 🛠️ Arquitetura

O projeto segue os princípios **SOLID** e padrão **MVC**:

- **Model (Game.js)**: Gerencia o estado do tabuleiro e lógica do jogo
- **View (React Components)**: Interface do usuário
- **Controller (GameController.js)**: Gerencia múltiplas partidas
- **Socket Handler**: Gerencia comunicação em tempo real

### Padrões de Design

- **Strategy Pattern**: Validação de movimentos (diferentes para peão e dama)
- **Observer Pattern**: Atualização do estado via Socket.IO events
- **Single Responsibility**: Cada classe tem uma responsabilidade única

## 📝 Scripts Disponíveis

### Raiz do Projeto
- `npm run dev` - Inicia cliente e servidor simultaneamente
- `npm run install:all` - Instala todas as dependências

### Cliente
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção

### Servidor
- `npm run dev` - Inicia servidor com watch mode
- `npm start` - Inicia servidor de produção

## 🐛 Troubleshooting

### Problema: "Cannot connect to server"
- Verifique se o servidor está rodando na porta 3001
- Verifique se a variável `VITE_SERVER_URL` está configurada corretamente

### Problema: "Sala não encontrada"
- Verifique se o código da sala está correto (case-sensitive)
- Certifique-se de que ambos os jogadores estão na mesma rede (para jogos locais)

### Problema: Movimentos não funcionam
- Verifique se é seu turno (indicado no painel lateral)
- Lembre-se: capturas são obrigatórias quando disponíveis

## 📄 Licença

Este projeto é open source e está disponível para uso livre.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**Desenvolvido por WillTech - Solução web**

Desenvolvido com ❤️ usando React, Node.js e Socket.IO

