# 🚨 Guia de Erros do Vercel - Referência Rápida

Este guia lista os erros mais comuns do Vercel e como resolvê-los especificamente para o projeto **Damas Online**.

## 🔴 Erros de Deployment (Mais Comuns)

### NOT_FOUND (404)
**Código**: `NOT_FOUND`  
**HTTP**: `404`

**Causa**: Arquivo ou rota não encontrada.

**Solução**:
- ✅ Verifique se `Root Directory` está como `client`
- ✅ Verifique se `Output Directory` está como `dist`
- ✅ Certifique-se de que o build está gerando `dist/index.html`
- ✅ Verifique o arquivo `vercel.json` com as rotas corretas

**Guia completo**: Veja [SOLUCAO_404_VERCEL.md](./SOLUCAO_404_VERCEL.md)

---

### DEPLOYMENT_NOT_FOUND (404)
**Código**: `DEPLOYMENT_NOT_FOUND`  
**HTTP**: `404`

**Causa**: Deployment específico não encontrado ou foi deletado.

**Solução**:
- ✅ Verifique se o deployment existe no dashboard
- ✅ Faça um novo deploy
- ✅ Verifique se está acessando a URL correta

---

### DEPLOYMENT_DELETED (410)
**Código**: `DEPLOYMENT_DELETED`  
**HTTP**: `410`

**Causa**: Deployment foi removido pela política de retenção.

**Solução**:
- ✅ Crie um novo deployment
- ✅ Ou restaure o deployment deletado (se foi há menos de 30 dias)
- ✅ Vá em Settings → Security → Recently Deleted

**Guia completo**: Veja [SOLUCAO_DEPLOYMENT_DELETED.md](./SOLUCAO_DEPLOYMENT_DELETED.md)

---

### DEPLOYMENT_BLOCKED (403)
**Código**: `DEPLOYMENT_BLOCKED`  
**HTTP**: `403`

**Causa**: Deployment foi bloqueado (geralmente por violação de termos).

**Solução**:
- ✅ Verifique se há alguma violação de termos
- ✅ Entre em contato com o suporte do Vercel
- ✅ Crie um novo projeto se necessário

---

### DEPLOYMENT_DISABLED (402)
**Código**: `DEPLOYMENT_DISABLED`  
**HTTP**: `402`

**Causa**: Deployment foi desabilitado (geralmente por limite de plano).

**Solução**:
- ✅ Verifique o plano da sua conta
- ✅ Ative o deployment novamente nas configurações
- ✅ Considere fazer upgrade do plano se necessário

---

### DEPLOYMENT_PAUSED (503)
**Código**: `DEPLOYMENT_PAUSED`  
**HTTP**: `503`

**Causa**: Deployment foi pausado manualmente.

**Solução**:
- ✅ Vá em Settings → General
- ✅ Despause o projeto
- ✅ Faça um novo deploy

---

## ⚠️ Erros de Função (Serverless Functions)

### FUNCTION_INVOCATION_FAILED (500)
**Código**: `FUNCTION_INVOCATION_FAILED`  
**HTTP**: `500`

**Causa**: Erro ao executar uma função serverless.

**Solução**:
- ✅ Verifique os logs do deployment
- ✅ Verifique se há erros no código da função
- ✅ Teste a função localmente

**Nota**: Este projeto não usa serverless functions, então este erro não deve ocorrer.

---

### FUNCTION_INVOCATION_TIMEOUT (504)
**Código**: `FUNCTION_INVOCATION_TIMEOUT`  
**HTTP**: `504`

**Causa**: Função demorou muito para executar.

**Solução**:
- ✅ Otimize o código da função
- ✅ Considere aumentar o timeout (se possível)
- ✅ Verifique se há loops infinitos

---

## 🔧 Erros de Build

### Problemas Comuns de Build

**Erro**: Build falha no Vercel mas funciona localmente

**Soluções**:
1. ✅ Verifique se todas as dependências estão no `package.json`
2. ✅ Verifique se `node_modules` não está sendo commitado
3. ✅ Verifique a versão do Node.js (Vercel usa Node 18+ por padrão)
4. ✅ Adicione `.nvmrc` ou configure a versão do Node no Vercel

**Erro**: "Module not found"

**Soluções**:
1. ✅ Execute `npm install` localmente e verifique se instala sem erros
2. ✅ Verifique se todas as dependências estão listadas em `package.json`
3. ✅ Limpe o cache do Vercel: Settings → General → Clear Build Cache

---

## 🌐 Erros de DNS

### DNS_HOSTNAME_NOT_FOUND (502)
**Código**: `DNS_HOSTNAME_NOT_FOUND`  
**HTTP**: `502`

**Causa**: Domínio customizado não configurado corretamente.

**Solução**:
- ✅ Verifique as configurações de DNS no Vercel
- ✅ Verifique os registros DNS no seu provedor de domínio
- ✅ Aguarde a propagação do DNS (pode levar até 48h)

---

## 📦 Erros Específicos do Projeto Damas Online

### Erro: "Cannot connect to server"

**Causa**: `VITE_SERVER_URL` não configurada ou incorreta.

**Solução**:
1. ✅ Vá em Settings → Environment Variables
2. ✅ Adicione: `VITE_SERVER_URL` = URL do seu servidor (Render/Railway)
3. ✅ Faça um novo deploy

### Erro: Socket.IO não conecta

**Causa**: Servidor não está rodando ou CORS não configurado.

**Solução**:
1. ✅ Verifique se o servidor está rodando (Render/Railway)
2. ✅ Verifique se `CLIENT_URL` está configurado no servidor
3. ✅ Teste a conexão: `https://seu-servidor.onrender.com/health`

---

## 🔍 Como Diagnosticar Erros

### 1. Verificar Logs do Deployment

1. Vercel Dashboard → Deployments
2. Clique no deployment com erro
3. Veja os logs de build e runtime

### 2. Testar Build Localmente

```bash
cd client
npm install
npm run build
```

Se funcionar localmente mas não no Vercel:
- Verifique as configurações do Vercel
- Verifique variáveis de ambiente
- Limpe o cache do build

### 3. Verificar Configurações

No Vercel Dashboard → Settings → General:
- ✅ Root Directory: `client`
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

---

## 📋 Checklist de Troubleshooting

Antes de reportar um erro, verifique:

- [ ] Build funciona localmente (`npm run build`)
- [ ] Todas as dependências estão no `package.json`
- [ ] `node_modules` não está commitado
- [ ] Variáveis de ambiente estão configuradas
- [ ] Root Directory está correto (`client`)
- [ ] Output Directory está correto (`dist`)
- [ ] Logs do deployment foram verificados
- [ ] Cache do build foi limpo (se necessário)

---

## 🆘 Quando Contatar Suporte

Contate o suporte do Vercel se:

- ❌ Erro persiste após seguir todas as soluções
- ❌ Erro é um "INTERNAL_*" (erro interno da plataforma)
- ❌ Deployment foi bloqueado sem motivo aparente
- ❌ Problemas com billing/plano

**Suporte Vercel**: https://vercel.com/support

---

## 📚 Recursos Adicionais

- [Documentação Oficial de Erros do Vercel](https://vercel.com/docs/errors)
- [Guia de Deploy](./DEPLOY.md)
- [Solução 404](./SOLUCAO_404_VERCEL.md)
- [Solução Deployment Deleted](./SOLUCAO_DEPLOYMENT_DELETED.md)

---

**Desenvolvido por WillTech - Solução web**

