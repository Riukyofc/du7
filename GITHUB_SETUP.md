# 🚀 Guia: Como Criar Repositório no GitHub e Fazer Push

## Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `painel-comando-rocinha` (ou o nome que preferir)
   - **Description**: "Sistema de gestão completo para COMANDO ROCINHA"
   - **Privado**: Marque "Private" (IMPORTANTE - tem credenciais!)
3. **NÃO** marque "Initialize with README" (já temos um)
4. Clique em "Create repository"

## Passo 2: Conectar o Repositório Local

Após criar, o GitHub mostrará comandos. Use estes:

```bash
git remote add origin https://github.com/SEU_USUARIO/painel-comando-rocinha.git
git branch -M main
git push -u origin main
```

**OU se preferir SSH:**

```bash
git remote add origin git@github.com:SEU_USUARIO/painel-comando-rocinha.git
git branch -M main
git push -u origin main
```

## Passo 3: Executar os Comandos

Copie e cole no terminal (substitua SEU_USUARIO pelo seu username do GitHub):

```powershell
# 1. Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/painel-comando-rocinha.git

# 2. Renomear branch para main (se necessário)
git branch -M main

# 3. Fazer push
git push -u origin main
```

## ✅ Pronto!

Seu projeto estará no GitHub em:
`https://github.com/SEU_USUARIO/painel-comando-rocinha`

---

## 🔒 IMPORTANTE: Segurança

**ANTES de fazer push, CERTIFIQUE-SE:**

1. ✅ `.gitignore` está configurado
2. ✅ Credenciais do Firebase foram removidas do código
3. ✅ Repositório está PRIVADO

**NUNCA** commite:
- API Keys
- Senhas
- Tokens
- Credenciais do Firebase

---

## 🔧 Commits Futuros

Para fazer updates futuros:

```bash
# 1. Adicionar mudanças
git add .

# 2. Fazer commit
git commit -m "descricao das mudancas"

# 3. Fazer push
git push
```

---

## 📝 Próximos Passos Recomendados

1. **Separar credenciais**: Mova as credenciais do Firebase para um arquivo separado (`firebase-config.js`) e adicione ao `.gitignore`

2. **Configurar GitHub Actions** (opcional): CI/CD para deploy automático

3. **Adicionar contribuidores**: Se trabalhar em equipe, adicione colaboradores no GitHub

4. **Proteger branch main**: Configure regras de proteção no GitHub

---

**Precisa de ajuda?** Me avise! 🚀
