# ✅ Verificar Conexão Socket.IO

## 🎉 ngrok está funcionando!

Vejo que o ngrok está online e recebendo requisições:
- ✅ `/health` retornou 200 OK
- ✅ Servidor está acessível

## 🔍 Próximos Passos para Diagnosticar

### 1. Verificar Console do Navegador

1. **Acesse o app no Vercel**
2. **Abra o Console** (F12 → Console)
3. **Procure por**:
   - `✅ Conectado ao servidor` (deve aparecer)
   - `Server URL: https://geophytic-condemningly-drema.ngrok-free.dev`
   - `Socket ID: [algum-id]`

### 2. Se NÃO aparecer "Conectado ao servidor"

**Problema**: Socket.IO não está conectando

**Verifique**:
1. **Variável de ambiente no Vercel**:
   - Settings → Environment Variables
   - Deve existir: `VITE_SERVER_URL` = `https://geophytic-condemningly-drema.ngrok-free.dev`

2. **Teste a URL manualmente**:
   - No console do navegador, digite:
   ```javascript
   console.log(import.meta.env.VITE_SERVER_URL)
   ```
   - **Deve aparecer**: A URL do ngrok
   - **Se aparecer `undefined`**: A variável não está configurada

3. **Teste conexão direta**:
   ```javascript
   fetch('https://geophytic-condemningly-drema.ngrok-free.dev/health')
     .then(r => r.json())
     .then(console.log)
   ```
   - **Deve retornar**: `{status: "ok"}`

### 3. Se aparecer erro de conexão

**Possíveis erros**:
- `ERR_CONNECTION_REFUSED`: Servidor não está rodando
- `CORS error`: Problema de CORS (mas já configuramos para aceitar tudo)
- `WebSocket error`: Problema com WebSocket

**Soluções**:
1. Verifique se o servidor está rodando (terminal do servidor)
2. Verifique se o ngrok está rodando (você já confirmou que está ✅)
3. Verifique se a URL está correta

### 4. Verificar Terminal do Servidor

Quando você tentar criar uma sala, **no terminal do servidor** deve aparecer:

```
✅ Cliente conectado: [socket-id]
🏠 Sala criada: [room-id] por [nickname]
```

**Se não aparecer**:
- O Socket.IO não está recebendo a conexão
- Pode ser problema de CORS ou WebSocket

### 5. Teste Completo

1. **Acesse**: `https://dama-online-rho.vercel.app`
2. **Abra Console** (F12)
3. **Aguarde alguns segundos** (para conectar)
4. **Verifique se aparece**: `✅ Conectado ao servidor`
5. **Digite um nickname**
6. **Clique em "Criar Sala"**
7. **Veja o console**:
   - Deve aparecer: `🔄 Criando sala para: [nickname]`
   - Deve aparecer: `📤 Evento create-room enviado`
   - Deve aparecer: `✅ Sala criada! Room ID: [código]`

---

## 🐛 Problemas Comuns

### Problema 1: "VITE_SERVER_URL is undefined"

**Solução**:
1. Vercel Dashboard → Settings → Environment Variables
2. Adicione: `VITE_SERVER_URL` = `https://geophytic-condemningly-drema.ngrok-free.dev`
3. Faça novo deploy

### Problema 2: Socket conecta mas não cria sala

**Verifique**:
1. Console mostra "✅ Conectado ao servidor"?
2. Console mostra "📤 Evento create-room enviado"?
3. Terminal do servidor mostra "🏠 Sala criada"?

**Se não aparecer no servidor**:
- O evento não está chegando
- Pode ser problema de WebSocket

### Problema 3: Erro CORS

**Solução**:
O servidor já está configurado para aceitar qualquer origem (`origin: "*"`), então não deveria dar erro CORS.

Se ainda der erro, verifique `server/index.js` linha 13.

---

## 📋 Checklist Rápido

- [ ] ngrok está rodando ✅ (você confirmou)
- [ ] Servidor está rodando (verifique terminal)
- [ ] `/health` funciona ✅ (você confirmou)
- [ ] `VITE_SERVER_URL` configurada no Vercel
- [ ] Console mostra "✅ Conectado ao servidor"
- [ ] Ao criar sala, aparece no console
- [ ] Ao criar sala, aparece no terminal do servidor

---

## 🚀 Próximo Passo

**Me diga o que aparece no console do navegador** quando você:
1. Acessa o app no Vercel
2. Tenta criar uma sala

Com essas informações, consigo identificar exatamente onde está o problema!

---

**Desenvolvido por WillTech - Solução web**

