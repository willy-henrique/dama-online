# 🔧 Solução: ngrok Fechando Rapidamente

## 🐛 Problema

O terminal do ngrok abre e fecha muito rápido, não mostrando a URL.

## ✅ Soluções

### Solução 1: ngrok Precisa de Autenticação (Mais Comum)

O ngrok gratuito precisa de uma conta e token de autenticação.

#### Passo 1: Criar Conta no ngrok

1. Acesse: https://dashboard.ngrok.com/signup
2. Crie uma conta gratuita
3. Faça login

#### Passo 2: Obter Token de Autenticação

1. No dashboard do ngrok, vá em: **Your Authtoken**
2. Copie o token (algo como: `2abc123...xyz`)

#### Passo 3: Configurar Token no ngrok

Abra o PowerShell ou CMD e execute:

```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

Substitua `SEU_TOKEN_AQUI` pelo token que você copiou.

#### Passo 4: Testar ngrok

```bash
ngrok http 3001
```

Agora deve funcionar e mostrar a URL!

---

### Solução 2: Verificar se o Servidor Está Rodando

O ngrok precisa que o servidor esteja rodando na porta 3001.

#### Passo 1: Iniciar o Servidor

Em um terminal separado:

```bash
cd server
npm run dev
```

Você deve ver:
```
🚀 Servidor rodando na porta 3001
```

#### Passo 2: Deixar o Servidor Rodando

**NÃO feche esse terminal!** Deixe ele rodando.

#### Passo 3: Iniciar ngrok em Outro Terminal

Agora, em **outro terminal** (novo), execute:

```bash
ngrok http 3001
```

---

### Solução 3: Usar Comando Correto

Certifique-se de usar o comando correto:

```bash
# ✅ CORRETO
ngrok http 3001

# ❌ ERRADO (sem especificar porta)
ngrok http

# ❌ ERRADO (porta errada)
ngrok http 3000
```

---

### Solução 4: Verificar Instalação do ngrok

#### Windows (PowerShell como Administrador):

```bash
# Verificar se está instalado
ngrok version

# Se não estiver instalado, baixe de:
# https://ngrok.com/download
```

#### Ou instalar via npm:

```bash
npm install -g ngrok
```

---

## 📋 Passo a Passo Completo

### 1. Criar Conta e Obter Token

1. Acesse: https://dashboard.ngrok.com/signup
2. Crie conta gratuita
3. Vá em: **Your Authtoken**
4. Copie o token

### 2. Configurar Token

```bash
ngrok config add-authtoken SEU_TOKEN_COPIADO
```

### 3. Iniciar Servidor (Terminal 1)

```bash
cd server
npm run dev
```

**Deixe rodando!**

### 4. Iniciar ngrok (Terminal 2 - Novo)

```bash
ngrok http 3001
```

### 5. Copiar URL

Você verá algo como:

```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3001
```

Copie a URL `https://abc123.ngrok-free.app`

### 6. Configurar no Vercel

1. Vercel Dashboard → Settings → Environment Variables
2. Adicione:
   - **Name**: `VITE_SERVER_URL`
   - **Value**: `https://abc123.ngrok-free.app` (sua URL do ngrok)
3. Faça um novo deploy

---

## 🐛 Erros Comuns

### Erro: "authtoken is required"

**Solução**: Configure o token:
```bash
ngrok config add-authtoken SEU_TOKEN
```

### Erro: "bind: address already in use"

**Solução**: A porta 3001 já está em uso. Verifique:
- Se o servidor já está rodando
- Se outro processo está usando a porta

### Erro: "could not start tunnel"

**Solução**: 
- Verifique se o servidor está rodando na porta 3001
- Tente reiniciar o ngrok
- Verifique sua conexão com internet

---

## 💡 Dica: Manter ngrok Aberto

Para evitar que o terminal feche:

1. **Use PowerShell ou CMD** (não o terminal integrado do VS Code para ngrok)
2. **Execute o comando diretamente** no terminal
3. **Não feche o terminal** enquanto estiver usando

---

## 🔄 Alternativa: Usar Render/Railway

Se o ngrok estiver dando muito trabalho, considere usar Render ou Railway:

- ✅ URL fixa (não muda)
- ✅ Sempre online
- ✅ Mais confiável
- ✅ Gratuito também

Veja: [DEPLOY.md](./DEPLOY.md)

---

**Desenvolvido por WillTech - Solução web**

