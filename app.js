// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBByHwWc_f1X_q_eGZwBPBVj04TQhzGhk4",
    authDomain: "metrovill-1da45.firebaseapp.com",
    projectId: "metrovill-1da45",
    storageBucket: "metrovill-1da45.firebasestorage.app",
    messagingSenderId: "868840305618",
    appId: "1:868840305618:web:9b57892619820d95710e0b"
};

try { firebase.initializeApp(firebaseConfig); } catch (e) { console.warn("Firebase Init Error:", e); }

let auth, db;
try { auth = firebase.auth(); db = firebase.firestore(); } catch (e) { console.warn("Firebase unavailable"); }

const state = {
    currentUser: null, activeTab: 'dashboard', money: 0, transactions: [], actions: [], salesLog: [], routesLog: [], members: [],
    routeMaterials: ['Peças de Arma', 'Metal', 'Pólvora', 'Tecido', 'Plástico', 'Ketamina', 'Veneno de Rato'],
    inventory: [
        { id: 1, item: 'Maconha', category: 'Drogas', qty: 0, max: 10000, icon: 'package' },
        { id: 2, item: 'Cocaína', category: 'Drogas', qty: 0, max: 10000, icon: 'snowflake' },
        { id: 3, item: 'Metanfetamina', category: 'Drogas', qty: 0, max: 10000, icon: 'flask-conical' },
        { id: 4, item: 'Crack', category: 'Drogas', qty: 0, max: 10000, icon: 'gem' },
    ],
    sales: { items: [], value: '', memberId: null },
    actionForm: { title: '', type: 'Assalto', value: '', selectedMembers: [] },
    routeForm: { memberId: '', material: 'Peças de Arma', quantity: '' }
};

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'activity' },
    { id: 'actions', label: 'Ações', icon: 'crosshair' },
    { id: 'rotas', label: 'Rotas', icon: 'truck' },
    { id: 'sales', label: 'Vendas', icon: 'calculator' },
    { id: 'ranking', label: 'Ranking', icon: 'trophy' },
    { id: 'members', label: 'Membros', icon: 'users' },
    { id: 'inventory', label: 'Estoque', icon: 'package' },
    { id: 'financial', label: 'Financeiro', icon: 'dollar-sign' },
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
        }
    } catch (e) { }
}

async function saveFinancialData() {
    await db.collection('config').doc('financial').set({ money: state.money, transactions: state.transactions, actions: state.actions, salesLog: state.salesLog, routesLog: state.routesLog, routeMaterials: state.routeMaterials, inventory: state.inventory });
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
        case 'ranking': content.innerHTML = renderRanking(); break;
        case 'inventory': content.innerHTML = renderInventory(); break;
        case 'members': content.innerHTML = renderMembers(); break;
        case 'sales': content.innerHTML = renderSales(); break;
        case 'financial': content.innerHTML = renderFinancial(); break;
    }
    lucide.createIcons();
}
