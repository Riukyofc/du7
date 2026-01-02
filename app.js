// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBByHwWc_f1X_q_eGZwBPBVj04TQhzGhk4",
    authDomain: "metrovill-1da45.firebaseapp.com",
    projectId: "metrovill-1da45",
    storageBucket: "metrovill-1da45.firebasestorage.app",
    messagingSenderId: "868840305618",
    appId: "1:868840305618:web:9b57892619820d95710e0b"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// State
const state = {
    currentUser: null,
    activeTab: 'dashboard',
    money: 0,
    transactions: [],
    actions: [],
    salesLog: [],
    routesLog: [],
    members: [],
    inventory: [
        { id: 1, item: 'Maconha', category: 'Drogas', qty: 0, max: 10000, icon: 'package' },
        { id: 2, item: 'Cocaína', category: 'Drogas', qty: 0, max: 10000, icon: 'snowflake' },
        { id: 3, item: 'Metanfetamina', category: 'Drogas', qty: 0, max: 10000, icon: 'flask-conical' },
        { id: 4, item: 'Crack', category: 'Drogas', qty: 0, max: 10000, icon: 'gem' },
    ],
    sales: { items: [], value: '', memberId: null },
    actionForm: { title: '', type: 'Assalto', value: '', selectedMembers: [] },
    routeForm: { memberId: '', material: 'Peças de Arma', quantity: 25 }
};

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'activity' },
    { id: 'actions', label: 'Ações DU7', icon: 'crosshair' },
    { id: 'rotas', label: 'Rotas DU7', icon: 'truck' },
    { id: 'sales', label: 'Vendas', icon: 'calculator' },
    { id: 'ranking', label: 'Ranking', icon: 'trophy' },
    { id: 'members', label: 'Membros', icon: 'users' },
    { id: 'inventory', label: 'Estoque', icon: 'package' },
    { id: 'financial', label: 'Financeiro', icon: 'dollar-sign' },
];

// Auth Functions
function toggleAuthMode(mode) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const subtitle = document.getElementById('auth-subtitle');

    if (mode === 'register') {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        subtitle.innerText = "Novo Membro";
    } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        subtitle.innerText = "Acesso Restrito";
    }
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
    const gameId = document.getElementById('reg-id').value;
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        await db.collection('members').doc(userCredential.user.uid).set({
            gameId: parseInt(gameId),
            name: name,
            email: email,
            role: 'Vapor',
            status: 'offline',
            financial: 0,
            actions: 0,
            routes: 0,
            joinDate: new Date().toISOString().split('T')[0],
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await auth.signOut();
        showAuthMessage("Conta criada com sucesso! Faça login.", "success");
        setTimeout(() => toggleAuthMode('login'), 1500);
    } catch (error) {
        showAuthMessage(error.message, "error");
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        showAuthMessage("Credenciais inválidas!", "error");
    }
}

async function logout() {
    const user = auth.currentUser;
    if (user) {
        try {
            await db.collection('members').doc(user.uid).update({ status: 'offline' });
        } catch (e) { }
    }
    await auth.signOut();
}

// Firebase Auth State Listener
auth.onAuthStateChanged(async (user) => {
    const loadingScreen = document.getElementById('loading-screen');
    const loginScreen = document.getElementById('login-screen');
    const appRoot = document.getElementById('app-root');

    if (user) {
        try {
            await db.collection('members').doc(user.uid).update({ status: 'online' });
        } catch (e) { }

        state.currentUser = user;
        await loadAllData();

        loadingScreen.classList.add('hidden');
        loginScreen.classList.add('hidden');
        appRoot.classList.remove('hidden');
        initApp();
    } else {
        state.currentUser = null;
        loadingScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        appRoot.classList.add('hidden');
        lucide.createIcons();
    }
});

// Data Loading
async function loadAllData() {
    await loadMembers();
    await loadFinancialData();
}

async function loadMembers() {
    const snapshot = await db.collection('members').get();
    state.members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function loadFinancialData() {
    try {
        const doc = await db.collection('config').doc('financial').get();
        if (doc.exists) {
            const data = doc.data();
            state.money = data.money || 0;
            state.transactions = data.transactions || [];
            state.actions = data.actions || [];
            state.salesLog = data.salesLog || [];
            state.routesLog = data.routesLog || [];
        }
    } catch (e) { }
}

async function saveFinancialData() {
    await db.collection('config').doc('financial').set({
        money: state.money,
        transactions: state.transactions,
        actions: state.actions,
        salesLog: state.salesLog,
        routesLog: state.routesLog
    });
}

async function updateMemberInFirestore(memberId, data) {
    await db.collection('members').doc(memberId).update(data);
}

// App Initialization
function initApp() {
    renderNav();
    renderApp();
    updateCurrentUserInfo();
}

function updateCurrentUserInfo() {
    const member = state.members.find(m => m.id === state.currentUser?.uid);
    const container = document.getElementById('currentUserInfo');
    if (member && container) {
        container.innerHTML = `
            <div class="w-10 h-10 rounded bg-blue-900/20 text-yellow-400 flex items-center justify-center font-bold mr-3 border border-blue-500/30">${member.name.charAt(0)}</div>
            <div class="overflow-hidden">
                <p class="text-sm font-bold text-white truncate font-mono">${member.name} | ${member.gameId}</p>
                <p class="text-[10px] text-blue-400 uppercase font-bold tracking-wider">${member.role}</p>
            </div>
        `;
    }
}

function renderNav() {
    const navContainer = document.getElementById('navLinks');
    navContainer.innerHTML = navItems.map(item => `
        <button onclick="setTab('${item.id}')" 
            class="w-full flex items-center p-4 rounded text-sm font-black transition-all duration-300 uppercase tracking-widest group
            ${state.activeTab === item.id
            ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] translate-x-2'
            : 'text-zinc-500 hover:text-yellow-400 hover:bg-zinc-900'}">
            <i data-lucide="${item.icon}" class="mr-4 w-5 h-5"></i>
            ${item.label}
        </button>
    `).join('');
    lucide.createIcons();
}

function setTab(tabId) {
    state.activeTab = tabId;
    document.getElementById('pageTitle').innerText = navItems.find(n => n.id === tabId).label;

    const sidebar = document.getElementById('sidebar');
    if (!sidebar.classList.contains('-translate-x-full')) {
        toggleSidebar();
    }
    renderNav();
    renderApp();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

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
