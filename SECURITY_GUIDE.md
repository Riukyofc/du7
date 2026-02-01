# 🔐 Guia de Segurança - Painel COMANDO ROCINHA

## Regras de Firestore Implementadas

### 📋 Visão Geral

As regras de segurança foram configuradas com **controle de acesso baseado em roles (RBAC)** e validação de dados para máxima segurança.

---

## 🛡️ Níveis de Acesso

### 👤 Membros Comuns (Vapor, Soldado)
```
✅ Ler dados de todos os membros
✅ Ler configurações financeiras
✅ Atualizar próprio status (online/offline/ausente)
❌ Modificar role ou dados financeiros
❌ Deletar membros
❌ Modificar configurações
```

### 👑 Líderes (Gerente, Dono, Comandante, Admin)
```
✅ Todas as permissões de membros comuns
✅ Atualizar role de outros membros
✅ Modificar financial, actions, routes
✅ Deletar membros
✅ Modificar configurações do sistema
✅ Acessar logs
```

### ⭐ Super Admin (alexcastrocutrim@gmail.com)
```
✅ ACESSO TOTAL E IRRESTRITO
✅ Modificar qualquer campo de qualquer membro
✅ Promover/rebaixar qualquer cargo (incluindo Admin)
✅ Deletar qualquer membro
✅ Modificar todas as configurações sem validação
✅ Bypass de todas as restrições de role
```

---

## 📁 Proteções por Coleção

### `members/{userId}`

| Operação | Quem pode? | Validações |
|----------|------------|------------|
| **Ler** | Qualquer membro autenticado | - |
| **Criar** | Próprio usuário (registro) | gameId (number), name, email, role válido, status válido |
| **Atualizar Status** | Próprio usuário | Apenas campo `status`, deve ser válido |
| **Atualizar Dados** | Líderes | Campos: role, financial, actions, routes, status |
| **Deletar** | Apenas líderes | - |

### `config/{configId}`

| Operação | Quem pode? | Validações |
|----------|------------|------------|
| **Ler** | Qualquer membro autenticado | - |
| **Escrever** | Apenas líderes | Estrutura completa para `financial` |

**Validações para `config/financial`:**
- ✅ `money` (number) ≥ 0
- ✅ `transactions` (array)
- ✅ `actions` (array)
- ✅ `salesLog` (array)
- ✅ `routesLog` (array)

### `logs/{logId}` (Opcional)

| Operação | Quem pode? | Validações |
|----------|------------|------------|
| **Ler** | Apenas líderes | - |
| **Criar** | Qualquer membro | userId = próprio UID, timestamp = servidor |
| **Atualizar/Deletar** | Ninguém | Logs são imutáveis |

---

## 🎯 Valores Válidos

### Status Permitidos
- `online`
- `offline`
- `ausente`

### Roles Permitidos (Hierarquia)
1. `Admin` (máximo acesso)
2. `Comandante`
3. `Dono`
4. `Gerente`
5. `Soldado`
6. `Vapor` (membro básico)

---

## 🚀 Como Aplicar as Regras

### Método 1: Firebase Console (Recomendado)
1. Acesse: https://console.firebase.google.com/project/rocinj
2. Vá em **Firestore Database** → **Rules**
3. Copie o conteúdo de `firestore.rules`
4. Cole no editor
5. Clique em **Publish**

### Método 2: Firebase CLI
```bash
cd C:\Users\alexc\.gemini\antigravity\scratch\tropa-du7-firebase
firebase deploy --only firestore:rules
```

---

## ⚠️ Avisos de Segurança

> **IMPORTANTE**: As chaves de API do Firebase no código front-end são **públicas por design**. A segurança real vem das regras do Firestore, não da ocultação das chaves.

> **CRÍTICO**: Sempre teste as regras primeiro em modo **teste** antes de publicar em produção.

> **RECOMENDADO**: Configure alertas de uso no Firebase Console para detectar acessos suspeitos.

---

## 🧪 Testando as Regras

### No Firebase Console:
1. Vá em **Firestore Database** → **Rules**
2. Clique na aba **Rules Playground**
3. Teste cenários:
   - Membro comum tentando modificar role de outro
   - Líder atualizando dados financeiros
   - Usuário não autenticado tentando ler dados

### Exemplos de Teste:

**✅ PERMITIDO:**
```javascript
// Vapor atualizando próprio status
auth: { uid: "user123" }
path: /databases/(default)/documents/members/user123
method: update
data: { status: "online" }
```

**❌ BLOQUEADO:**
```javascript
// Vapor tentando se promover a Admin
auth: { uid: "user123", role: "Vapor" }
path: /databases/(default)/documents/members/user123
method: update
data: { role: "Admin" }
```

---

## 📊 Monitoramento

Configure alertas para:
- ✅ Tentativas de acesso negadas
- ✅ Modificações em `config/financial`
- ✅ Criação/deleção de membros
- ✅ Mudanças de role

**Firebase Console** → **Firestore Database** → **Usage**
