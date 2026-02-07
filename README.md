# 🛡️ Painel COMANDO ROCINHA - Sistema de Gestão 4K

Sistema completo de gerenciamento para organizações com Firebase, incluindo farm logs, vendas, ações, membros, cargos, comunicação e metas.

## ✨ Funcionalidades

### 📊 Dashboard
- Visão geral de estatísticas
- Widgets de comunicados e metas ativas
- Resumo financeiro

### 🌾 Sistema de Farm
- Registro de farm por membro
- Histórico detalhado com filtros (membro, material, semana)
- Edição e exclusão de logs (Super Admin)
- Exportação para CSV

### 💰 Sistema de Vendas
- Registro de vendas com múltiplos itens
- Cálculo automático de corte da facção
- Histórico de transações

### 🎯 Sistema de Ações
- Registro de ações (assaltos, território, etc)
- Divisão automática por participantes
- Histórico com filtros

### 👥 Membros
- Gestão completa de membros
- Atribuição de cargos
- Visualização de estatísticas por membro

### 🛡️ Cargos e Permissões
- Criação de cargos customizados
- Permissões granulares (view, create, edit, delete)
- Controle por seção (farm, vendas, ações, etc)
- Hierarquia de níveis

### 📢 Sistema de Comunicação
- Comunicados internos com prioridades (Importante, Normal, Info)
- Marcar como lido
- Arquivamento de comunicados antigos

### 🎯 Metas e Objetivos
- Criação de metas (farm, vendas, ações, customizadas)
- Tracking automático de progresso
- Barras visuais de progresso
- Status automático (ativa → completa)
- Recompensas opcionais

### 📦 Estoque
- Gerenciamento de inventário
- Controle de limites
- Histórico de movimentações

### 💵 Financeiro
- Gerenciamento de caixa
- Histórico de transações
- Exportação de dados

### 📝 Logs de Auditoria
- Registro automático de todas as ações
- Filtros por tipo de ação
- Histórico completo

## 🚀 Como Usar

### Pré-requisitos
- Servidor HTTP (pode usar Live Server, http-server, etc)
- Navegador moderno
- Conta Firebase (configuração necessária)

### Instalação

1. **Clone o repositório**
```bash
git clone <seu-repo>
cd tropa-du7-firebase
```

2. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Ative Firebase Authentication (Email/Password)
   - Ative Cloud Firestore
   - Copie as credenciais do Firebase
   - **IMPORTANTE**: Crie um arquivo `firebase-config.js` (ele está no .gitignore)
   
```javascript
// firebase-config.js
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJECT.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_BUCKET",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};
```

3. **Modifique app.js**
   - Substitua a configuração hardcoded do Firebase pela importação do config:
```javascript
// No início do app.js, substitua:
const firebaseConfig = { ... };
// Por:
// Importe o arquivo de config (ou use <script src> no HTML)
```

4. **Inicie um servidor local**
```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js
npx http-server -p 8000

# Opção 3: Live Server (VS Code extension)
```

5. **Acesse**
```
http://localhost:8000
```

## 👤 Usuário Super Admin

O Super Admin é definido por email no código:
- Email: `alexcastrocutrim@gmail.com` (modifique no código se necessário)
- Super Admin tem acesso total a todas as funcionalidades

## 📁 Estrutura de Arquivos

```
tropa-du7-firebase/
├── index.html              # Página principal
├── app.js                  # Lógica principal e estado
├── components.js           # Componentes reutilizáveis
├── farm.js                 # Sistema de farm
├── sales-fin.js            # Sistema de vendas
├── features.js             # Ações e rotas
├── logs.js                 # Sistema de logs
├── roles.js                # Cargos e permissões
├── communications.js       # Sistema de comunicação
├── goals.js                # Metas e objetivos
├── inventory-override.js   # Gerenciamento de estoque
├── resumo.js               # Resumo de atividades
├── logo-4k.png             # Logo do sistema
└── README.md               # Este arquivo
```

## 🔒 Segurança

- **NUNCA** commite suas credenciais do Firebase
- Use `.gitignore` para proteger dados sensíveis
- Configure regras de segurança no Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **Backend**: Firebase (Authentication + Firestore)
- **Ícones**: Lucide Icons
- **Fontes**: Inter, JetBrains Mono

## 📝 Licença

Este projeto é privado e de uso interno.

## 👨‍💻 Desenvolvedor

Desenvolvido para COMANDO ROCINHA

---

**Versão**: 3.0  
**Última atualização**: Fevereiro 2026
