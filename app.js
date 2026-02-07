// Firebase Configuration - Banco de Dados ROCINHA
const firebaseConfig = {
    apiKey: "AIzaSyB3A5Mg4SZJuq8IYfrZaCxNHRnEUCMMJRI",
    authDomain: "rocinj.firebaseapp.com",
    projectId: "rocinj",
    storageBucket: "rocinj.firebasestorage.app",
    messagingSenderId: "934149513286",
    appId: "1:934149513286:web:cf9f358fcd1f9017a52a47",
    measurementId: "G-C2RCG9F0MM"
};

try { firebase.initializeApp(firebaseConfig); } catch (e) { console.warn("Firebase Init Error:", e); }

let auth, db;
try { auth = firebase.auth(); db = firebase.firestore(); } catch (e) { console.warn("Firebase unavailable"); }

const state = {
    currentUser: null, activeTab: 'dashboard', money: 0, transactions: [], actions: [], salesLog: [], routesLog: [], members: [],
    routeMaterials: ['Metal', 'Cobre', 'RDX', 'Plaster', 'Ferro', 'Alum�nio', 'P�lvora', 'Tecido', 'Pl�stico', 'Ketamina'],
    inventory: [
        { id: 1, item: 'Maconha', category: 'Drogas', qty: 0, max: 10000, icon: 'package' },
        { id: 2, item: 'Cocaína', category: 'Drogas', qty: 0, max: 10000, icon: 'snowflake' },
        { id: 3, item: 'Metanfetamina', category: 'Drogas', qty: 0, max: 10000, icon: 'flask-conical' },
        { id: 4, item: 'Crack', category: 'Drogas', qty: 0, max: 10000, icon: 'gem' },
    ],
    sales: { items: [], value: '', memberId: null },
    actionForm: { title: '', type: 'Assalto', value: '', selectedMembers: [] },
    routeForm: { memberId: '', material: 'Metal', quantity: '' },
    // NOVO: Sistema de Logs e Rastreamento
    auditLog: [],
    inventoryLog: [],
    salesItems: ['Maconha', 'Cocaína', 'Metanfetamina', 'Crack', 'Combo'],
    // NOVO: Sistema de Farm Logs
    farmLogs: [],
    farmMaterials: ['Metal', 'Cobre', 'RDX', 'Plaster', 'Ferro', 'Alumínio', 'Pólvora', 'Tecido', 'Plástico', 'Ketamina'],
    roles: [],
    communications: [],
    goals: []
};

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'activity' },
    { id: 'actions', label: 'Ações', icon: 'crosshair' },
    { id: 'rotas', label: 'Farm', icon: 'sprout' },
    { id: 'resumo', label: 'Resumo', icon: 'bar-chart-2' },
    { id: 'sales', label: 'Vendas', icon: 'calculator' },
    { id: 'ranking', label: 'Ranking', icon: 'trophy' },
    { id: 'members', label: 'Membros', icon: 'users' },
    { id: 'roles', label: 'Cargos', icon: 'shield' },
    { id: 'communications', label: 'Comunicação', icon: 'megaphone' },
    { id: 'goals', label: 'Metas', icon: 'target' },
    { id: 'inventory', label: 'Estoque', icon: 'package' },
    { id: 'financial', label: 'Financeiro', icon: 'dollar-sign' },
    { id: 'logs', label: 'Logs', icon: 'file-text' },
];

function toggleAuthMode(mode) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const subtitle = document.getElementById('auth-subtitle');
    if (mode === 'register') { loginForm.classList.add('hidden'); registerForm.classList.remove('hidden'); subtitle.innerText = "Novo Membro"; }
    else { registerForm.classList.add('hidden'); loginForm.classList.remove('hidden'); subtitle.innerText = "Acesso Restrito"; }
    lucide.createIcons();
}

function showAuthMessage(msg, type) {
    const el = document.getElementById('auth-msg');
    el.innerText = msg;
    el.className = `mt-4 p-3 rounded text-xs text-center font-bold ${type === 'success' ? 'bg-green-900/20 border border-green-500/50 text-green-400' : 'bg-red-900/20 border border-red-500/50 text-red-400'}`;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 3000);
}



async function handleRegister(e) {
    e.preventDefault();
    const gameId = document.getElementById('reg-id').value, name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value, password = document.getElementById('reg-pass').value;
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection('members').doc(userCredential.user.uid).set({
            gameId: parseInt(gameId), name, email, role: 'Vapor', status: 'offline', financial: 0, actions: 0, routes: 0,
            joinDate: new Date().toISOString().split('T')[0], createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        await auth.signOut();
        showAuthMessage("Conta criada com sucesso! Faça login.", "success");
        setTimeout(() => toggleAuthMode('login'), 1500);
    } catch (error) { showAuthMessage(error.message, "error"); }
}

async function handleLogin(e) {
    e.preventDefault();
    try { await auth.signInWithEmailAndPassword(document.getElementById('login-email').value, document.getElementById('login-password').value); }
    catch (error) { showAuthMessage("Credenciais inválidas!", "error"); }
}

async function logout() {
    if (auth.currentUser) { try { await db.collection('members').doc(auth.currentUser.uid).update({ status: 'offline' }); } catch (e) { } }
    await auth.signOut();
}

if (auth) {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try { await db.collection('members').doc(user.uid).update({ status: 'online' }); } catch (e) { }
            state.currentUser = user; await loadAllData();
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app-root').classList.remove('hidden');
            initApp();
        } else {
            state.currentUser = null;
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('app-root').classList.add('hidden');
            lucide.createIcons();
        }
    });
} else {
    setTimeout(() => { document.getElementById('loading-screen').classList.add('hidden'); document.getElementById('login-screen').classList.remove('hidden'); lucide.createIcons(); }, 1000);
}

async function loadAllData() { await loadMembers(); await loadFinancialData(); }
async function loadMembers() { try { const snapshot = await db.collection('members').get(); state.members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); } catch (e) { } }
async function loadFinancialData() {
    try {
        const doc = await db.collection('config').doc('financial').get();
        if (doc.exists) {
            const data = doc.data();
            state.money = data.money || 0; state.transactions = data.transactions || []; state.actions = data.actions || [];
            state.salesLog = data.salesLog || []; state.routesLog = data.routesLog || [];
            if (data.routeMaterials) state.routeMaterials = data.routeMaterials;
            if (data.inventory) state.inventory = data.inventory;
            // NOVO: Carregar logs e itens de venda
            state.auditLog = data.auditLog || [];
            state.inventoryLog = data.inventoryLog || [];
            state.salesItems = data.salesItems || ['Maconha', 'Cocaína', 'Metanfetamina', 'Crack', 'Combo'];
            // NOVO: Carregar farm logs
            state.farmLogs = data.farmLogs || [];
        }
    } catch (e) { }
}

async function saveFinancialData() {
    await db.collection('config').doc('financial').set({
        money: state.money, transactions: state.transactions, actions: state.actions,
        salesLog: state.salesLog, routesLog: state.routesLog, routeMaterials: state.routeMaterials,
        inventory: state.inventory,
        // NOVO: Salvar logs e itens de venda
        auditLog: state.auditLog, inventoryLog: state.inventoryLog, salesItems: state.salesItems,
        // NOVO: Salvar farm logs
        farmLogs: state.farmLogs
    });
}

async function updateMemberInFirestore(memberId, data) { await db.collection('members').doc(memberId).update(data); }

function initApp() { renderNav(); renderApp(); updateCurrentUserInfo(); }

function updateCurrentUserInfo() {
    const uid = state.currentUser?.uid || 'demo-123';
    const member = state.members.find(m => m.id === uid) || state.members[0];
    const container = document.getElementById('currentUserInfo');
    if (member && container) {
        container.innerHTML = `<div class="w-10 h-10 rounded bg-purple-900/20 text-purple-400 flex items-center justify-center font-bold mr-3 border border-purple-500/30">${member.name.charAt(0)}</div><div class="overflow-hidden"><p class="text-sm font-bold text-white truncate font-mono">${member.name} | ${member.gameId}</p><p class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">${member.role}</p></div>`;
    }
}

function renderNav() {
    document.getElementById('navLinks').innerHTML = navItems.map(item => `<button onclick="setTab('${item.id}')" class="w-full flex items-center p-4 rounded text-sm font-black transition-all duration-300 uppercase tracking-widest group ${state.activeTab === item.id ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] translate-x-2' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}"><i data-lucide="${item.icon}" class="mr-4 w-5 h-5"></i>${item.label}</button>`).join('');
    lucide.createIcons();
}

function setTab(tabId) {
    state.activeTab = tabId;
    document.getElementById('pageTitle').innerText = navItems.find(n => n.id === tabId).label;
    const sidebar = document.getElementById('sidebar');
    if (!sidebar.classList.contains('-translate-x-full')) toggleSidebar();
    renderNav(); renderApp();
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('-translate-x-full'); document.getElementById('sidebarOverlay').classList.toggle('hidden'); }

function renderApp() {
    const content = document.getElementById('appContent');
    switch (state.activeTab) {
        case 'dashboard': content.innerHTML = renderDashboard(); break;
        case 'actions': content.innerHTML = renderActions(); break;
        case 'rotas': content.innerHTML = renderRoutes(); break;
        case 'resumo': content.innerHTML = renderResumo(); break;
        case 'ranking': content.innerHTML = renderRanking(); break;
        case 'inventory': content.innerHTML = renderInventory(); break;
        case 'members': content.innerHTML = renderMembers(); break;
        case 'sales': content.innerHTML = renderSales(); break;
        case 'financial': content.innerHTML = renderFinancial(); break;
        case 'logs': content.innerHTML = renderLogs(); break;
        case 'roles': content.innerHTML = renderRoles(); pageTitle.textContent = 'Cargos & Permissões'; break;
        case 'communications': content.innerHTML = renderCommunications(); pageTitle.textContent = 'Comunicação'; break;
        case 'goals': content.innerHTML = renderGoals(); pageTitle.textContent = 'Metas'; break;
    }
    lucide.createIcons();
}

// Role Management Functions
async function updateMemberRole(memberId, newRole) {
    try {
        await db.collection('members').doc(memberId).update({ role: newRole });
        await loadMembers();
        renderApp();
        showNotification(`Cargo atualizado para ${newRole}!`, 'success');
    } catch (error) {
        console.error('Erro ao atualizar cargo:', error);
        showNotification('Erro ao atualizar cargo. Verifique suas permissões.', 'error');
    }
}

async function deleteMember(memberId) {
    if (!confirm('Tem certeza que deseja remover este membro?')) return;
    try {
        await db.collection('members').doc(memberId).delete();
        await loadMembers();
        renderApp();
        showNotification('Membro removido com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao deletar membro:', error);
        showNotification('Erro ao remover membro. Verifique suas permissões.', 'error');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-[100] px-6 py-4 rounded-lg shadow-2xl border font-bold text-sm animate-slideUp ${type === 'success'
        ? 'bg-green-900/90 border-green-500 text-green-100'
        : 'bg-red-900/90 border-red-500 text-red-100'
        }`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-5 h-5"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    lucide.createIcons();
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== SUPER ADMIN UTILITY FUNCTIONS =====

// Edit Cash Balance
function editCashBalance() {
    const newAmount = prompt(`Editar saldo do caixa\n\nSaldo atual: R$ ${state.money.toLocaleString('pt-BR')}\n\nDigite o novo valor:`, state.money);
    if (newAmount !== null && !isNaN(newAmount)) {
        const parsed = parseFloat(newAmount);
        if (parsed >= 0) {
            const diff = parsed - state.money;
            state.money = parsed;
            addTransaction(diff >= 0 ? 'in' : 'out', Math.abs(diff), `Ajuste Manual - Super Admin`);
            saveFinancialData();
            renderApp();
            showNotification(`Caixa atualizado para R$ ${parsed.toLocaleString('pt-BR')}!`, 'success');
        }
    }
}

// Delete Transaction
async function deleteTransaction(index) {
    if (!confirm('Deletar esta transação?')) return;
    const transaction = state.transactions[index];

    // Reverse the transaction effect on money
    if (transaction.type === 'in') {
        state.money -= transaction.amount;
    } else {
        state.money += transaction.amount;
    }

    state.transactions.splice(index, 1);
    await saveFinancialData();
    renderApp();
    showNotification('Transação deletada!', 'success');
}

// Update Member Field (financial, actions, routes)
async function updateMemberField(memberId, field, value) {
    try {
        const member = state.members.find(m => m.id === memberId);
        if (member) {
            member[field] = value;
            const updateData = {};
            updateData[field] = value;
            await db.collection('members').doc(memberId).update(updateData);
            showNotification(`${field} atualizado!`, 'success');
        }
    } catch (error) {
        console.error('Erro ao atualizar campo:', error);
        showNotification('Erro ao atualizar. Verifique suas permissões.', 'error');
    }
}

// Delete Action Log
async function deleteActionLog(index) {
    if (!confirm('Deletar este registro de ação?')) return;
    state.actions.splice(index, 1);
    await saveFinancialData();
    renderApp();
    showNotification('Registro deletado!', 'success');
}

// Delete Route Log
async function deleteRouteLog(index) {
    if (!confirm('Deletar este registro de rota?')) return;
    state.routesLog.splice(index, 1);
    await saveFinancialData();
    renderApp();
    showNotification('Registro deletado!', 'success');
}

// Delete Sale Log
async function deleteSaleLog(index) {
    if (!confirm('Deletar este registro de venda?')) return;
    state.salesLog.splice(index, 1);
    await saveFinancialData();
    renderApp();
    showNotification('Registro deletado!', 'success');
}

// Clear All Logs (with confirmation)
async function clearAllLogs(logType) {
    const confirmText = prompt(`ATENÇÃO! Você está prestes a DELETAR TODOS os registros de ${logType}.\n\nDigite "CONFIRMAR" para continuar:`, '');
    if (confirmText === 'CONFIRMAR') {
        if (logType === 'ações') state.actions = [];
        else if (logType === 'rotas') state.routesLog = [];
        else if (logType === 'vendas') state.salesLog = [];
        else if (logType === 'transações') state.transactions = [];

        await saveFinancialData();
        renderApp();
        showNotification(`Todos os registros de ${logType} foram deletados!`, 'success');
    }
}

// ===== SISTEMA DE AUDITORIA E LOGS =====

function logAction(action, details, targetUser = null) {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const actor = state.members.find(m => m.id === state.currentUser?.uid);
    state.auditLog.unshift({
        timestamp: now.toISOString(),
        date: dateStr,
        actor: actor?.name || 'Sistema',
        actorId: actor?.gameId || 'N/A',
        action,
        details,
        targetUser
    });
    saveFinancialData();
}

function hasSpecialPermissions() {
    const uid = state.currentUser?.uid;
    const member = state.members.find(m => m.id === uid);
    return member?.gameId === 59704;
}


