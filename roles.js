// Sistema de Cargos e Permissões
function renderRoles() {
    const currentUserEmail = state.currentUser?.email || '';
    const isSuperAdmin = currentUserEmail === 'alexcastrocutrim@gmail.com';

    if (!isSuperAdmin) {
        return `<div class="p-8 text-center text-zinc-600">
            <i data-lucide="lock" class="w-16 h-16 mx-auto mb-4 text-zinc-700"></i>
            <p class="text-xl font-bold uppercase">Acesso Negado</p>
            <p class="text-sm mt-2">Apenas Super Admins podem gerenciar cargos.</p>
        </div>`;
    }

    const roles = state.roles || [];

    return `<div class="space-y-8">
        <div class="flex justify-between items-center animate-slideUp">
            <div>
                <h2 class="text-3xl font-black text-white uppercase italic">Cargos e <span class="text-purple-500">Permissões</span></h2>
                <p class="text-zinc-500 text-xs uppercase tracking-widest mt-1 font-bold">Gerenciamento de Hierarquia</p>
            </div>
            <button onclick="openCreateRoleModal()" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2">
                <i data-lucide="plus" class="w-4 h-4"></i>Criar Cargo
            </button>
        </div>

        <!-- Grid de Cargos -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slideUp">
            ${roles.length === 0 ? `
                <div class="col-span-full bg-black border border-zinc-900 rounded-xl p-8 text-center">
                    <i data-lucide="shield-off" class="w-12 h-12 mx-auto mb-4 text-zinc-700"></i>
                    <p class="text-zinc-500 italic">Nenhum cargo criado ainda. Clique em "Criar Cargo" para começar.</p>
                </div>
            ` : roles.map(role => `
                <div class="bg-black border-2 rounded-xl overflow-hidden hover:border-purple-500 transition-all group" style="border-color: ${role.color}20">
                    <div class="p-5 border-b" style="background: ${role.color}10; border-color: ${role.color}30">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: ${role.color}20">
                                    <i data-lucide="shield" class="w-5 h-5" style="color: ${role.color}"></i>
                                </div>
                                <div>
                                    <h3 class="font-black text-white uppercase italic">${role.name}</h3>
                                    <p class="text-xs text-zinc-500">Nível ${role.level}</p>
                                </div>
                            </div>
                            ${role.level > 0 ? `
                                <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button onclick="editRole('${role.id}')" class="text-blue-400 hover:text-blue-300">
                                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                                    </button>
                                    <button onclick="deleteRole('${role.id}')" class="text-red-400 hover:text-red-300">
                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="p-5">
                        <p class="text-xs text-zinc-500 uppercase font-bold mb-3">Permissões</p>
                        ${role.permissions?.all ? `
                            <div class="flex items-center gap-2 text-purple-400 text-xs">
                                <i data-lucide="check-circle" class="w-4 h-4"></i>
                                <span class="font-bold">ACESSO TOTAL</span>
                            </div>
                        ` : `
                            <div class="space-y-1 text-xs">
                                ${Object.entries(role.permissions || {}).slice(0, 5).map(([section, perms]) => `
                                    <div class="flex items-center gap-2 text-zinc-400">
                                        <i data-lucide="check" class="w-3 h-3 text-purple-400"></i>
                                        <span>${section}: ${Object.keys(perms).filter(k => perms[k]).join(', ')}</span>
                                    </div>
                                `).join('')}
                                ${Object.keys(role.permissions || {}).length > 5 ? `<div class="text-zinc-600 italic">+${Object.keys(role.permissions).length - 5} mais...</div>` : ''}
                            </div>
                        `}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;
}

// Modal criar cargo
function openCreateRoleModal() {
    const modal = document.createElement('div');
    modal.id = 'createRoleModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto';
    modal.innerHTML = `
        <div class="bg-black border-2 border-zinc-900 w-full max-w-3xl rounded-lg animate-scaleIn overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)] my-8">
            <div class="flex justify-between items-center p-5 border-b border-zinc-900 bg-zinc-950">
                <h3 class="text-xl font-black text-white uppercase italic flex items-center">
                    <i data-lucide="shield-plus" class="mr-2 text-purple-400"></i> Criar Novo Cargo
                </h3>
                <button onclick="document.getElementById('createRoleModal').remove()" class="text-zinc-500 hover:text-red-500 transition-colors">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <!-- Nome e Configurações Básicas -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Nome do Cargo</label>
                        <input id="roleName" type="text" placeholder="Ex: Moderador" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Nível (1-10)</label>
                        <input id="roleLevel" type="number" min="1" max="10" value="3" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-mono font-bold focus:border-purple-400 outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Cor do Cargo</label>
                    <input id="roleColor" type="color" value="#8b5cf6" class="w-full h-12 bg-zinc-950 border border-zinc-800 rounded cursor-pointer">
                </div>

                <!-- Grid de Permissões -->
                <div>
                    <label class="block text-xs text-purple-400 uppercase font-bold mb-3 tracking-widest">Permissões por Seção</label>
                    <div class="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-3">
                        ${['farm', 'sales', 'actions', 'routes', 'members', 'communications', 'goals', 'settings'].map(section => `
                            <div class="border border-zinc-800 rounded p-3">
                                <p class="text-sm font-bold text-white uppercase mb-2">${section}</p>
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    ${['view', 'create', 'edit', 'delete'].map(action => `
                                        <label class="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-purple-400">
                                            <input type="checkbox" class="rolePermission rounded" data-section="${section}" data-action="${action}">
                                            <span>${action}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button onclick="saveNewRole()" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95">
                    CRIAR CARGO
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    lucide.createIcons();
}

// Salvar novo cargo
async function saveNewRole() {
    const name = document.getElementById('roleName').value.trim();
    const level = parseInt(document.getElementById('roleLevel').value);
    const color = document.getElementById('roleColor').value;

    if (!name || !level) {
        alert('Preencha o nome e nível do cargo!');
        return;
    }

    // Coletar permissões
    const permissions = {};
    document.querySelectorAll('.rolePermission').forEach(cb => {
        const section = cb.dataset.section;
        const action = cb.dataset.action;
        if (!permissions[section]) permissions[section] = {};
        permissions[section][action] = cb.checked;
    });

    const newRole = {
        id: 'role_' + Date.now(),
        name,
        level,
        color,
        permissions
    };

    if (!state.roles) state.roles = [];
    state.roles.push(newRole);

    // Log de auditoria
    logAction('Cargo Criado', `Novo cargo: ${name} (Nível ${level})`, state.currentUser.displayName);

    await saveFinancialData();
    document.getElementById('createRoleModal').remove();
    alert('✅ Cargo criado com sucesso!');
    renderApp();
}

// Deletar cargo
async function deleteRole(roleId) {
    const role = state.roles.find(r => r.id === roleId);

    // Verificar se há membros com este cargo
    const membersWithRole = state.members.filter(m => m.roleId === roleId);
    if (membersWithRole.length > 0) {
        alert(`Não é possível deletar este cargo.\n${membersWithRole.length} membro(s) ainda possui(em) este cargo.`);
        return;
    }

    if (!confirm(`Tem certeza que deseja deletar o cargo "${role.name}"?`)) {
        return;
    }

    state.roles = state.roles.filter(r => r.id !== roleId);

    logAction('Cargo Deletado', `Cargo removido: ${role.name}`, state.currentUser.displayName);

    await saveFinancialData();
    alert('✅ Cargo deletado!');
    renderApp();
}

// Função auxiliar para verificar permissão
function hasPermission(action, section) {
    const user = state.currentUser;
    if (!user) return false;

    // Super Admin sempre tem permissão
    if (user.email === 'alexcastrocutrim@gmail.com') return true;

    const role = state.roles?.find(r => r.id === user.roleId);
    if (!role) return false;

    // Se tem permissão total
    if (role.permissions?.all) return true;

    // Verificar permissão específica
    return role.permissions?.[section]?.[action] === true;
}
