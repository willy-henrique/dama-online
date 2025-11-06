# 🚀 Guia Rápido de Início

## Instalação Rápida

```bash
# 1. Instalar todas as dependências
npm run install:all

# 2. Iniciar o projeto (cliente + servidor)
npm run dev
```

## Acessar o Jogo

1. Abra `http://localhost:3000` no navegador
2. Digite seu nickname
3. Crie uma sala ou entre com um código
4. Compartilhe o código com outro jogador
5. Jogue!

## Estrutura do Projeto

```
dama-online/
├── client/          # Front-end React (porta 3000)
└── server/          # Back-end Node.js (porta 3001)
```

## Comandos Úteis

- `npm run dev` - Inicia tudo
- `npm run install:all` - Instala dependências
- `cd client && npm run dev` - Só o front-end
- `cd server && npm run dev` - Só o back-end

## Problemas Comuns

**Erro de conexão?**
- Verifique se o servidor está rodando na porta 3001
- Verifique o console do navegador

**Sala não encontrada?**
- Verifique se o código está correto (maiúsculas/minúsculas importam)
- Certifique-se de que ambos estão na mesma rede

## Próximos Passos

Leia o `README.md` completo para:
- Instruções de deploy
- Detalhes da arquitetura
- Regras do jogo
- Troubleshooting completo

