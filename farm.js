// Sistema de Logs de Farm
function renderFarm() {
    const currentUserEmail = state.currentUser?.email || '';
    const isSuperAdmin = currentUserEmail === 'alexcastrocutrim@gmail.com';

    // Calcular número da semana
    const currentWeek = getWeekNumber(new Date());

    // Filtrar logs da semana atual
    const weekLogs = state.farmLogs.filter(log => log.weekNumber === currentWeek);

    // Agrupar logs por membro
    const memberStats = {};
    weekLogs.forEach(log => {
        if (!memberStats[log.memberName]) {
            memberStats[log.memberName] = {
                name: log.memberName,
                gameId: log.memberGameId,
                materials: {}
            };
        }
        if (!memberStats[log.memberName].materials[log.material]) {
            memberStats[log.memberName].materials[log.material] = 0;
        }
        memberStats[log.memberName].materials[log.material] += log.quantity;
    });

    // Converter para array
    const memberArray = Object.values(memberStats);

    // Calcular estatísticas
    let topFarmer = null;
    let maxTotal = 0;
    memberArray.forEach(member => {
        const total = Object.values(member.materials).reduce((a, b) => a + b, 0);
        if (total > maxTotal) {
            maxTotal = total;
            topFarmer = member.name;
        }
    });

    // Material mais farmado
    const materialTotals = {};
    weekLogs.forEach(log => {
        materialTotals[log.material] = (materialTotals[log.material] || 0) + log.quantity;
    });
    const topMaterial = Object.entries(materialTotals).sort((a, b) => b[1] - a[1])[0];

    return `<div class="space-y-8">
        <div class="flex justify-between items-center animate-slideUp">
            <div>
                <h2 class="text-3xl font-black text-white uppercase italic">Logs de <span class="text-purple-500">Farm</span></h2>
                <p class="text-zinc-500 text-xs uppercase tracking-widest mt-1 font-bold">Semana ${currentWeek} - Controle de Farmagem</p>
            </div>
            <div class="flex gap-2">
                <button onclick="openRegisterFarmModal()" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2">
                    <i data-lucide="plus" class="w-4 h-4"></i>Registrar Farm
                </button>
                <button onclick="exportFarmCSV()" class="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 border border-zinc-800">
                    <i data-lucide="download" class="w-4 h-4"></i>Exportar
                </button>
            </div>
        </div>

        <!-- Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideUp">
            <div class="bg-black border border-zinc-900 rounded-xl p-5">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-zinc-500 text-xs uppercase font-bold">Top Farmer</span>
                    <i data-lucide="award" class="w-4 h-4 text-purple-400"></i>
                </div>
                <p class="text-xl font-black text-white truncate">${topFarmer || 'N/A'}</p>
            </div>
            <div class="bg-black border border-zinc-900 rounded-xl p-5">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-zinc-500 text-xs uppercase font-bold">Material +Farmado</span>
                    <i data-lucide="package" class="w-4 h-4 text-purple-400"></i>
                </div>
                <p class="text-xl font-black text-white truncate">${topMaterial ? topMaterial[0] : 'N/A'}</p>
            </div>
            <div class="bg-black border border-zinc-900 rounded-xl p-5">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-zinc-500 text-xs uppercase font-bold">Total na Semana</span>
                    <i data-lucide="trending-up" class="w-4 h-4 text-purple-400"></i>
                </div>
                <p class="text-3xl font-mono text-purple-500 font-bold">${weekLogs.reduce((acc, log) => acc + log.quantity, 0).toLocaleString('pt-BR')}</p>
            </div>
        </div>

        <!-- Tabela de Membros -->
        <div class="bg-black border border-zinc-900 rounded-xl overflow-hidden animate-slideUp">
            <div class="p-5 border-b border-zinc-900 bg-zinc-950">
                <h3 class="font-black text-white uppercase italic flex items-center">
                    <i data-lucide="users" class="mr-2 w-4 h-4 text-zinc-500"></i> 
                    Resumo por Membro
                </h3>
            </div>
            <div class="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin">
                <table class="w-full text-left">
                    <thead class="sticky top-0 bg-zinc-950/95 backdrop-blur-sm text-zinc-500 text-[10px] font-black uppercase">
                        <tr>
                            <th class="p-4">Membro</th>
                            <th class="p-4">Materiais Farmados</th>
                            <th class="p-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-900">
                        ${memberArray.length === 0 ? `<tr><td colspan="3" class="p-8 text-center text-zinc-600 text-xs italic uppercase">Nenhum farm registrado essa semana.</td></tr>` : memberArray.map(member => {
        const total = Object.values(member.materials).reduce((a, b) => a + b, 0);
        const materialsStr = Object.entries(member.materials)
            .map(([mat, qty]) => `<span class="inline-block bg-zinc-900 px-2 py-1 rounded mr-1 mb-1 text-[10px]"><span class="text-purple-400 font-bold">${qty.toLocaleString('pt-BR')}</span> ${mat}</span>`)
            .join('');
        return `<tr class="hover:bg-purple-900/10 group">
                                <td class="p-4 font-bold text-white">
                                    ${member.name}
                                    <span class="text-zinc-500 font-mono text-xs">| ID: ${member.gameId}</span>
                                </td>
                                <td class="p-4 text-zinc-300">
                                    <div class="flex flex-wrap gap-1">
                                        ${materialsStr}
                                    </div>
                                </td>
                                <td class="p-4 text-right font-mono text-purple-400 font-bold text-xl">
                                    ${total.toLocaleString('pt-BR')}
                                </td>
                            </tr>`;
    }).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Histórico Detalhado -->
        <div class="bg-black border border-zinc-900 rounded-xl overflow-hidden animate-slideUp">
            <div class="p-5 border-b border-zinc-900 bg-zinc-950 flex justify-between items-center">
                <h3 class="font-black text-white uppercase italic flex items-center">
                    <i data-lucide="list" class="mr-2 w-4 h-4 text-zinc-500"></i> 
                    Histórico Detalhado
                </h3>
                <div class="flex items-center gap-2">
                    <!-- Filtros -->
                    <select id="filterMember" onchange="applyFarmFilters()" class="bg-zinc-900 border border-zinc-800 rounded px-3 py-1 text-xs text-white">
                        <option value="">Todos os Membros</option>
                        ${state.members.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
                    </select>
                    <select id="filterMaterial" onchange="applyFarmFilters()" class="bg-zinc-900 border border-zinc-800 rounded px-3 py-1 text-xs text-white">
                        <option value="">Todos os Materiais</option>
                        ${state.farmMaterials.map(mat => `<option value="${mat}">${mat}</option>`).join('')}
                    </select>
                    <label class="flex items-center gap-1 text-xs text-zinc-400">
                        <input type="checkbox" id="filterAllWeeks" onchange="applyFarmFilters()" class="rounded">
                        Todas as semanas
                    </label>
                </div>
            </div>
            <div class="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin">
                <table class="w-full text-left" id="farmHistoryTable">
                    <thead class="sticky top-0 bg-zinc-950/95 backdrop-blur-sm text-zinc-500 text-[10px] font-black uppercase">
                        <tr>
                            <th class="p-4">Data/Hora</th>
                            <th class="p-4">Membro</th>
                            <th class="p-4">Material</th>
                            <th class="p-4 text-right">Quantidade</th>
                            ${isSuperAdmin ? '<th class="p-4 text-center">Ações</th>' : ''}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-900" id="farmHistoryBody">
                        ${renderFarmHistory(weekLogs, isSuperAdmin)}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

// Função para obter número da semana
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Abrir modal para registrar farm
function openRegisterFarmModal() {
    const modal = document.createElement('div');
    modal.id = 'registerFarmModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm';
    modal.innerHTML = `<div class="bg-black border-2 border-zinc-900 w-full max-w-md rounded-lg animate-scaleIn overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)]"><div class="flex justify-between items-center p-5 border-b border-zinc-900 bg-zinc-950"><h3 class="text-xl font-black text-white uppercase italic flex items-center"><i data-lucide="sprout" class="mr-2 text-purple-400"></i> Registrar Farm</h3><button onclick="document.getElementById('registerFarmModal').remove()" class="text-zinc-500 hover:text-red-500 transition-colors"><i data-lucide="x"></i></button></div><div class="p-6 space-y-5"><div><label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Membro</label><select id="farmMemberId" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none"><option value="">Selecione o membro...</option>${state.members.map(m => `<option value="${m.id}">${m.name} | ID: ${m.gameId}</option>`).join('')}</select></div><div><label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Material</label><select id="farmMaterial" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none">${state.farmMaterials.map(mat => `<option value="${mat}">${mat}</option>`).join('')}</select></div><div><label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Quantidade</label><input id="farmQuantity" type="number" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-mono font-bold focus:border-purple-400 outline-none placeholder-zinc-700" placeholder="0"></div><button onclick="submitFarm()" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95">REGISTRAR AGORA</button></div></div>`;
    document.body.appendChild(modal);
    lucide.createIcons();
}

// Submeter farm
async function submitFarm() {
    const memberId = document.getElementById('farmMemberId').value;
    const material = document.getElementById('farmMaterial').value;
    const quantity = parseInt(document.getElementById('farmQuantity').value);

    if (!memberId || !material || !quantity || quantity <= 0) {
        alert('Preencha todos os campos corretamente!');
        return;
    }

    const member = state.members.find(m => m.id === memberId);
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const weekNumber = getWeekNumber(now);

    state.farmLogs.unshift({
        memberName: member.name,
        memberGameId: member.gameId,
        memberId: memberId,
        material: material,
        quantity: quantity,
        timestamp: now.toISOString(),
        date: dateStr,
        weekNumber: weekNumber
    });

    // Registrar no log de auditoria
    logAction(
        'Farm Registrado',
        `${member.name} farmou ${quantity}x ${material}`,
        member.name
    );

    await saveFinancialData();
    document.getElementById('registerFarmModal').remove();
    alert(`Farm registrado! ${quantity}x ${material}`);
    renderApp();
}

// Exportar farm CSV
function exportFarmCSV() {
    const currentWeek = getWeekNumber(new Date());
    const weekLogs = state.farmLogs.filter(log => log.weekNumber === currentWeek);

    const headers = ['Data/Hora', 'Membro', 'ID', 'Material', 'Quantidade'];
    const rows = weekLogs.map(log => [
        log.date,
        log.memberName,
        log.memberGameId,
        log.material,
        log.quantity
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(field => `"${field}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `farm_semana${currentWeek}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    alert('✅ Farm logs exportados em CSV!');
}

// Renderizar histórico de farm
function renderFarmHistory(logs, isSuperAdmin) {
    if (logs.length === 0) {
        return `<tr><td colspan="${isSuperAdmin ? '5' : '4'}" class="p-8 text-center text-zinc-600 text-xs italic uppercase">Nenhum log encontrado com os filtros aplicados.</td></tr>`;
    }

    return logs.map((log, idx) => `
        <tr class="hover:bg-purple-900/10 group">
            <td class="p-4 text-zinc-500 text-xs font-mono">${log.date}</td>
            <td class="p-4 font-bold text-white">
                ${log.memberName}
                <span class="text-zinc-500 font-mono text-xs">| ID: ${log.memberGameId}</span>
            </td>
            <td class="p-4 text-zinc-300">${log.material}</td>
            <td class="p-4 text-right font-mono text-purple-400 font-bold text-lg">${log.quantity.toLocaleString('pt-BR')}</td>
            ${isSuperAdmin ? `
                <td class="p-4 text-center">
                    <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="editFarmLog(${idx})" class="text-blue-400 hover:text-blue-300" title="Editar">
                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                        </button>
                        <button onclick="deleteFarmLog(${idx})" class="text-red-400 hover:text-red-300" title="Deletar">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            ` : ''}
        </tr>
    `).join('');
}

// Aplicar filtros ao histórico de farm
function applyFarmFilters() {
    const memberFilter = document.getElementById('filterMember').value;
    const materialFilter = document.getElementById('filterMaterial').value;
    const allWeeks = document.getElementById('filterAllWeeks').checked;

    const currentWeek = getWeekNumber(new Date());

    let filteredLogs = state.farmLogs;

    // Filtrar por semana
    if (!allWeeks) {
        filteredLogs = filteredLogs.filter(log => log.weekNumber === currentWeek);
    }

    // Filtrar por membro
    if (memberFilter) {
        filteredLogs = filteredLogs.filter(log => log.memberId === memberFilter);
    }

    // Filtrar por material
    if (materialFilter) {
        filteredLogs = filteredLogs.filter(log => log.material === materialFilter);
    }

    // Renderizar tabela filtrada
    const currentUserEmail = state.currentUser?.email || '';
    const isSuperAdmin = currentUserEmail === 'alexcastrocutrim@gmail.com';
    const tbody = document.getElementById('farmHistoryBody');
    tbody.innerHTML = renderFarmHistory(filteredLogs, isSuperAdmin);
    lucide.createIcons();
}

// Editar log de farm
function editFarmLog(index) {
    const log = state.farmLogs[index];

    const modal = document.createElement('div');
    modal.id = 'editFarmModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm';
    modal.innerHTML = `<div class="bg-black border-2 border-zinc-900 w-full max-w-md rounded-lg animate-scaleIn overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)]"><div class="flex justify-between items-center p-5 border-b border-zinc-900 bg-zinc-950"><h3 class="text-xl font-black text-white uppercase italic flex items-center"><i data-lucide="edit-2" class="mr-2 text-purple-400"></i> Editar Farm</h3><button onclick="document.getElementById('editFarmModal').remove()" class="text-zinc-500 hover:text-red-500 transition-colors"><i data-lucide="x"></i></button></div><div class="p-6 space-y-5"><div><label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Membro</label><select id="editFarmMemberId" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none">${state.members.map(m => `<option value="${m.id}" ${m.id === log.memberId ? 'selected' : ''}>${m.name} | ID: ${m.gameId}</option>`).join('')}</select></div><div><label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Material</label><select id="editFarmMaterial" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none">${state.farmMaterials.map(mat => `<option value="${mat}" ${mat === log.material ? 'selected' : ''}>${mat}</option>`).join('')}</select></div><div><label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Quantidade</label><input id="editFarmQuantity" type="number" value="${log.quantity}" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-mono font-bold focus:border-purple-400 outline-none placeholder-zinc-700"></div><button onclick="saveEditedFarmLog(${index})" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95">SALVAR ALTERAÇÕES</button></div></div>`;
    document.body.appendChild(modal);
    lucide.createIcons();
}

// Salvar farm editado
async function saveEditedFarmLog(index) {
    const memberId = document.getElementById('editFarmMemberId').value;
    const material = document.getElementById('editFarmMaterial').value;
    const quantity = parseInt(document.getElementById('editFarmQuantity').value);

    if (!memberId || !material || !quantity || quantity <= 0) {
        alert('Preencha todos os campos corretamente!');
        return;
    }

    const member = state.members.find(m => m.id === memberId);
    const oldLog = state.farmLogs[index];

    // Atualizar log
    state.farmLogs[index] = {
        ...oldLog,
        memberName: member.name,
        memberGameId: member.gameId,
        memberId: memberId,
        material: material,
        quantity: quantity
    };

    // Log de auditoria
    logAction(
        'Farm Editado',
        `Log alterado: ${oldLog.memberName} ${oldLog.quantity}x ${oldLog.material} → ${member.name} ${quantity}x ${material}`,
        member.name
    );

    await saveFinancialData();
    document.getElementById('editFarmModal').remove();
    alert('✅ Farm editado com sucesso!');
    renderApp();
}

// Deletar log de farm
async function deleteFarmLog(index) {
    const log = state.farmLogs[index];

    if (!confirm(`Tem certeza que deseja deletar este log?\n\n${log.memberName}: ${log.quantity}x ${log.material}\n${log.date}`)) {
        return;
    }

    // Remover log
    state.farmLogs.splice(index, 1);

    // Log de auditoria
    logAction(
        'Farm Deletado',
        `Log removido: ${log.memberName} ${log.quantity}x ${log.material} (${log.date})`,
        log.memberName
    );

    await saveFinancialData();
    alert('✅ Farm deletado com sucesso!');
    renderApp();
}

