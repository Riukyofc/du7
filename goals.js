// Sistema de Metas e Objetivos
function renderGoals() {
    const currentUserEmail = state.currentUser?.email || '';
    const isAdmin = currentUserEmail === 'alexcastrocutrim@gmail.com';

    const goals = (state.goals || []).filter(g => g.status !== 'archived');

    // Calcular progresso para cada meta
    goals.forEach(goal => {
        goal.current = calculateGoalProgress(goal);
        const progress = (goal.current / goal.target) * 100;
        if (progress >= 100 && goal.status === 'active') {
            goal.status = 'completed';
            goal.completedAt = new Date().toISOString();
        }
    });

    return `<div class="space-y-8">
        <div class="flex justify-between items-center animate-slideUp">
            <div>
                <h2 class="text-3xl font-black text-white uppercase italic">Metas e <span class="text-purple-500">Objetivos</span></h2>
                <p class="text-zinc-500 text-xs uppercase tracking-widest mt-1 font-bold">Tracking de Performance</p>
            </div>
            ${isAdmin ? `
                <button onclick="openCreateGoalModal()" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2">
                    <i data-lucide="target" class="w-4 h-4"></i>Nova Meta
                </button>
            ` : ''}
        </div>

        <!-- Grid de Metas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
            ${goals.length === 0 ? `
                <div class="col-span-full bg-black border border-zinc-900 rounded-xl p-12 text-center">
                    <i data-lucide="target" class="w-16 h-16 mx-auto mb-4 text-zinc-700"></i>
                    <p class="text-zinc-500 text-lg font-bold">Nenhuma meta ativa</p>
                    <p class="text-zinc-600 text-sm mt-2">Crie metas para acompanhar o desempenho da equipe.</p>
                </div>
            ` : goals.map(goal => {
        const progress = Math.min((goal.current / goal.target) * 100, 100);
        const daysLeft = Math.ceil((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24));
        const statusColors = {
            active: 'border-purple-500 bg-purple-900/10',
            completed: 'border-green-500 bg-green-900/10',
            failed: 'border-red-500 bg-red-900/10'
        };

        return `
                    <div class="bg-black border-2 rounded-xl p-6 ${statusColors[goal.status]} relative">
                        ${goal.status === 'completed' ? `
                            <div class="absolute top-4 right-4">
                                <span class="bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase flex items-center gap-1">
                                    <i data-lucide="check" class="w-3 h-3"></i>COMPLETA
                                </span>
                            </div>
                        ` : ''}
                        
                        <div class="mb-4">
                            <h3 class="text-xl font-black text-white uppercase italic mb-2">${goal.title}</h3>
                            <p class="text-zinc-400 text-sm">${goal.description || ''}</p>
                        </div>
                        
                        <!-- Progress Bar -->
                        <div class="mb-4">
                            <div class="flex justify-between text-xs text-zinc-500 mb-2">
                                <span class="font-mono font-bold text-purple-400">${goal.current.toLocaleString('pt-BR')} / ${goal.target.toLocaleString('pt-BR')} ${goal.unit}</span>
                                <span class="font-bold">${progress.toFixed(1)}%</span>
                            </div>
                            <div class="w-full bg-zinc-900 rounded-full h-3 overflow-hidden">
                                <div class="h-full ${goal.status === 'completed' ? 'bg-green-500' : 'bg-purple-500'} rounded-full transition-all" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        
                        <!-- Info -->
                        <div class="flex items-center justify-between text-xs text-zinc-500">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-1 bg-zinc-900 rounded font-bold uppercase">${goal.type}</span>
                                ${goal.status === 'active' && daysLeft >= 0 ? `
                                    <span class="flex items-center gap-1">
                                        <i data-lucide="clock" class="w-3 h-3"></i>
                                        ${daysLeft} dias
                                    </span>
                                ` : ''}
                            </div>
                            ${isAdmin && goal.status === 'active' ? `
                                <button onclick="deleteGoal('${goal.id}')" class="text-red-400 hover:text-red-300">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            ` : ''}
                        </div>
                        
                        ${goal.reward ? `
                            <div class="mt-3 pt-3 border-t border-zinc-800">
                                <p class="text-xs text-zinc-500">🎁 Recompensa: <span class="text-purple-400 font-bold">${goal.reward}</span></p>
                            </div>
                        ` : ''}
                    </div>
                `;
    }).join('')}
        </div>
    </div>`;
}

// Calcular progresso da meta
function calculateGoalProgress(goal) {
    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);

    if (goal.type === 'farm') {
        const logs = state.farmLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= start && logDate <= end &&
                (goal.material ? log.material === goal.material : true);
        });
        return logs.reduce((sum, log) => sum + (log.quantity || 0), 0);
    }

    if (goal.type === 'sales') {
        const sales = state.salesLogs.filter(sale => {
            const saleDate = new Date(sale.timestamp);
            return saleDate >= start && saleDate <= end;
        });
        return sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    }

    if (goal.type === 'actions') {
        const actions = state.actions.filter(action => {
            const actionDate = new Date(action.timestamp);
            return actionDate >= start && actionDate <= end;
        });
        return actions.length;
    }

    return goal.current || 0;
}

// Modal criar meta
function openCreateGoalModal() {
    const modal = document.createElement('div');
    modal.id = 'createGoalModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-black border-2 border-zinc-900 w-full max-w-2xl rounded-lg animate-scaleIn overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)]">
            <div class="flex justify-between items-center p-5 border-b border-zinc-900 bg-zinc-950">
                <h3 class="text-xl font-black text-white uppercase italic flex items-center">
                    <i data-lucide="target" class="mr-2 text-purple-400"></i> Nova Meta
                </h3>
                <button onclick="document.getElementById('createGoalModal').remove()" class="text-zinc-500 hover:text-red-500 transition-colors">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="p-6 space-y-5">
                <div>
                    <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Tipo de Meta</label>
                    <select id="goalType" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none" onchange="toggleMaterialField()">
                        <option value="farm">Farm</option>
                        <option value="sales">Vendas</option>
                        <option value="actions">Ações DU7</option>
                        <option value="routes">Rotas</option>
                        <option value="custom">Customizada</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Título</label>
                    <input id="goalTitle" type="text" placeholder="Ex: Farmar 10.000 Metal" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none">
                </div>
                <div id="materialField" class="hidden">
                    <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Material (Farm)</label>
                    <select id="goalMaterial" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none">
                        ${state.farmMaterials.map(mat => `<option value="${mat}">${mat}</option>`).join('')}
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Meta (Número)</label>
                        <input id="goalTarget" type="number" min="1" placeholder="10000" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-mono font-bold focus:border-purple-400 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Unidade</label>
                        <input id="goalUnit" type="text" value="unidades" placeholder="unidades" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Data Início</label>
                        <input id="goalStartDate" type="date" value="${new Date().toISOString().split('T')[0]}" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-mono font-bold focus:border-purple-400 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Data Fim</label>
                        <input id="goalEndDate" type="date" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-mono font-bold focus:border-purple-400 outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Recompensa (Opcional)</label>
                    <input id="goalReward" type="text" placeholder="Ex: Bônus de R$ 5.000" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none">
                </div>
                <button onclick="saveNewGoal()" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95">
                    CRIAR META
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    lucide.createIcons();
    toggleMaterialField();
}

function toggleMaterialField() {
    const type = document.getElementById('goalType').value;
    const field = document.getElementById('materialField');
    field.classList.toggle('hidden', type !== 'farm');
}

// Salvar meta
async function saveNewGoal() {
    const type = document.getElementById('goalType').value;
    const title = document.getElementById('goalTitle').value.trim();
    const target = parseInt(document.getElementById('goalTarget').value);
    const unit = document.getElementById('goalUnit').value.trim();
    const startDate = document.getElementById('goalStartDate').value;
    const endDate = document.getElementById('goalEndDate').value;
    const reward = document.getElementById('goalReward').value.trim();
    const material = type === 'farm' ? document.getElementById('goalMaterial').value : null;

    if (!title || !target || !startDate || !endDate) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const newGoal = {
        id: 'goal_' + Date.now(),
        type,
        title,
        target,
        current: 0,
        unit,
        material,
        startDate,
        endDate,
        reward,
        status: 'active',
        completedAt: null
    };

    if (!state.goals) state.goals = [];
    state.goals.push(newGoal);

    logAction('Meta Criada', `"${title}" - Meta: ${target} ${unit}`, state.currentUser.displayName);

    await saveFinancialData();
    document.getElementById('createGoalModal').remove();
    alert('✅ Meta criada com sucesso!');
    renderApp();
}

// Deletar meta
async function deleteGoal(goalId) {
    const goal = state.goals.find(g => g.id === goalId);

    if (!confirm(`Deletar meta "${goal.title}"?`)) return;

    state.goals = state.goals.filter(g => g.id !== goalId);

    logAction('Meta Deletada', `"${goal.title}"`, state.currentUser.displayName);

    await saveFinancialData();
    alert('✅ Meta deletada!');
    renderApp();
}
