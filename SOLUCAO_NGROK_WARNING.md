# 🔧 Solução: Página de Aviso do ngrok

## 🐛 Problema

Ao acessar a URL do ngrok, aparece uma página de aviso pedindo para clicar em "Visit Site". Isso pode interferir na conexão do Socket.IO.

## ✅ Soluções

### Solução 1: Adicionar Header no Cliente (Recomendado)

O ngrok permite pular essa página adicionando um header especial. Vamos configurar isso no código do cliente.

#### Passo 1: Atualizar App.jsx

O Socket.IO precisa enviar o header `ngrok-skip-browser-warning` ao conectar.

Vou atualizar o código para incluir isso automaticamente.

---

### Solução 2: Clique em "Visit Site" (Temporário)

Para testar rapidamente:
1. Clique no botão **"Visit Site"**
2. A página será carregada
3. **Nota**: Isso só funciona para navegadores, não para conexões Socket.IO automáticas

---

### Solução 3: Upgrade para Conta Paga (Opcional)

Se você quiser remover completamente a página de aviso:
- Upgrade para qualquer plano pago do ngrok
- A página de aviso desaparece automaticamente

---

## 🔧 Implementação: Adicionar Header no Socket.IO

✅ **Já implementado!** O código foi atualizado para enviar o header `ngrok-skip-browser-warning` automaticamente.

### O que foi feito:

1. **App.jsx**: Adicionado `extraHeaders` na conexão Socket.IO
2. **HomePage.jsx**: Configuração preparada (se necessário)

### Como funciona:

O Socket.IO agora envia automaticamente o header `ngrok-skip-browser-warning: true` em todas as conexões, fazendo com que o ngrok pule a página de aviso.

---

## ✅ Próximos Passos

1. **Faça commit das alterações**:
   ```bash
   git add .
   git commit -m "Adiciona header para pular aviso do ngrok"
   git push
   ```

2. **Faça novo deploy no Vercel** (ou aguarde deploy automático)

3. **Teste**: A conexão Socket.IO deve funcionar sem mostrar a página de aviso

---

## 🧪 Testar

1. Acesse o app no Vercel
2. Tente criar uma sala
3. Verifique no console do navegador se conectou sem erros
4. A página de aviso não deve aparecer para conexões Socket.IO

---

## 📝 Nota Importante

- A página de aviso ainda pode aparecer se você acessar a URL do ngrok diretamente no navegador
- Mas as conexões Socket.IO automáticas vão pular essa página
- Isso é suficiente para o funcionamento do jogo

