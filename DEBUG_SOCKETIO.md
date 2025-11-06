# 🐛 Debug: Não Está Criando Salas

## 🔍 Problema

Ao tentar criar uma sala, nada acontece.

## ✅ Checklist de Verificação

### 1. Verificar se o Servidor Está Rodando

**No terminal do servidor**, você deve ver:
```
🚀 Servidor rodando na porta 3001
```

Se não estiver rodando:
```bash
cd server
npm run dev
```

### 2. Verificar se o ngrok Está Rodando

**No terminal do ngrok**, você deve ver:
```
Forwarding  https://geophytic-condemningly-drema.ngrok-free.dev -> http://localhost:3001
```

Se não estiver rodando:
```bash
ngrok http 3001
```

### 3. Verificar Variável de Ambiente no Vercel

1. Vercel Dashboard → Settings → Environment Variables
2. Verifique se existe:
   - **Key**: `VITE_SERVER_URL`
   - **Value**: `https://geophytic-condemningly-drema.ngrok-free.dev` (sua URL do ngrok)

### 4. Verificar Console do Navegador

1. Acesse o app no Vercel
2. Abra o Console (F12 → Console)
3. Procure por:
   - ✅ `✅ Conectado ao servidor` (deve aparecer)
   - ❌ Erros de conexão
   - ❌ Erros CORS

### 5. Verificar se Socket.IO Está Conectando

No console do navegador, você deve ver:
```
✅ Conectado ao servidor
```

Se não aparecer, há problema de conexão.

---

## 🔧 Soluções

### Solução 1: Verificar URL do Servidor

O app precisa saber onde está o servidor. Verifique:

1. **No código**: `client/src/App.jsx` linha 6
   ```javascript
   const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
   ```

2. **No Vercel**: A variável `VITE_SERVER_URL` deve estar configurada

3. **Teste**: A URL do ngrok deve estar acessível
   - Acesse: `https://geophytic-condemningly-drema.ngrok-free.dev/health`
   - Deve retornar: `{"status":"ok"}`

### Solução 2: Verificar CORS no Servidor

O servidor precisa aceitar conexões do Vercel. Verifique:

1. **No código**: `server/index.js` linha 13
   - Deve estar: `origin: process.env.CLIENT_URL || "*"`
   - Isso permite conexões de qualquer origem em desenvolvimento

2. **Se usar produção**: Configure `CLIENT_URL` no servidor com a URL do Vercel

### Solução 3: Verificar Logs do Servidor

Quando você tenta criar uma sala, **no terminal do servidor** deve aparecer:

```
✅ Cliente conectado: [socket-id]
🏠 Sala criada: [room-id] por [nickname]
```

Se não aparecer, o servidor não está recebendo a requisição.

### Solução 4: Verificar Eventos Socket.IO

No console do navegador, verifique se os eventos estão sendo enviados:

1. Abra o Console (F12)
2. Tente criar uma sala
3. Você deve ver eventos sendo enviados

Se não aparecer nada, o Socket.IO não está conectado.

---

## 🧪 Teste Passo a Passo

### Teste 1: Verificar Conexão

1. Acesse o app no Vercel
2. Abra o Console (F12)
3. Digite:
   ```javascript
   console.log(window.location.href)
   ```
4. Verifique se aparece a URL do Vercel

### Teste 2: Verificar Variável de Ambiente

No console do navegador, digite:
```javascript
console.log(import.meta.env.VITE_SERVER_URL)
```

**Deve aparecer**: A URL do ngrok

**Se aparecer `undefined`**: A variável não está configurada no Vercel

### Teste 3: Testar Conexão Direta

No console do navegador, digite:
```javascript
fetch('https://geophytic-condemningly-drema.ngrok-free.dev/health')
  .then(r => r.json())
  .then(console.log)
```

**Deve retornar**: `{status: "ok"}`

**Se der erro**: O servidor não está acessível

---

## 🔍 Debug Avançado

### Adicionar Logs no Código

Adicione logs temporários para debug:

**client/src/App.jsx** (após linha 20):
```javascript
newSocket.on('connect', () => {
  console.log('✅ Conectado ao servidor');
  console.log('Server URL:', SERVER_URL);
});

newSocket.on('error', (error) => {
  console.error('❌ Erro Socket.IO:', error);
});

newSocket.on('connect_error', (error) => {
  console.error('❌ Erro de conexão:', error);
});
```

**client/src/pages/HomePage.jsx** (após linha 58):
```javascript
const handleCreateRoom = (e) => {
  e.preventDefault();
  console.log('🔄 Tentando criar sala...');
  console.log('Socket conectado?', socket?.connected);
  if (!nickname.trim()) {
    setError('Digite um nickname');
    return;
  }
  localStorage.setItem('dama-nickname', nickname);
  setError('');
  socket.emit('create-room', nickname);
  console.log('📤 Evento create-room enviado');
};
```

---

## 📋 Checklist Completo

- [ ] Servidor rodando na porta 3001
- [ ] ngrok rodando e mostrando URL
- [ ] Variável `VITE_SERVER_URL` configurada no Vercel
- [ ] Console mostra "✅ Conectado ao servidor"
- [ ] `/health` retorna `{"status":"ok"}`
- [ ] Sem erros CORS no console
- [ ] Servidor recebe eventos (ver logs do servidor)

---

## 🚨 Problemas Comuns

### "Socket.IO não conecta"

**Causa**: URL do servidor incorreta ou servidor não acessível

**Solução**:
1. Verifique `VITE_SERVER_URL` no Vercel
2. Teste a URL do ngrok: `/health`
3. Verifique se ngrok está rodando

### "Evento enviado mas servidor não recebe"

**Causa**: CORS ou servidor não está escutando

**Solução**:
1. Verifique logs do servidor
2. Verifique CORS no `server/index.js`
3. Reinicie o servidor

### "Sala criada mas não aparece"

**Causa**: Evento `room-created` não está sendo recebido

**Solução**:
1. Verifique se o listener está registrado
2. Verifique console para erros
3. Verifique se socket está conectado

---

**Desenvolvido por WillTech - Solução web**

