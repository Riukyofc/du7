// Sistema de Logs Detalhados
function renderLogs() {
    const currentUserEmail = state.currentUser?.email || '';
    const isSuperAdmin = currentUserEmail === 'alexcastrocutrim@gmail.com';

    // Filtros (por enquanto sem implementação, apenas UI)
    const filterOptions = {
        actions: ['Todos', 'Estoque Adicionado', 'Estoque Removido', 'Item de Venda Criado', 'Item de Venda Removido', 'Membro Editado', 'Cargo Alterado'],
        members: ['Todos', ...state.members.map(m => m.name)]
    };

    return `<div class="space-y-8">
        <div class="flex justify-between items-center animate-slideUp">
            <div>
                <h2 class="text-3xl font-black text-white uppercase italic">Sistema de <span class="text-purple-500">Logs</span></h2>
                <p class="text-zinc-500 text-xs uppercase tracking-widest mt-1 font-bold">Auditoria Completa de Ações</p>
            </div>
            <div class="flex gap-2">
                <button onclick="exportLogsCSV()" class="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 border border-zinc-800">
                    <i data-lucide="download" class="w-4 h-4"></i>CSV
                </button>
                <button onclick="exportLogsJSON()" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2">
                    <i data-lucide="file-code" class="w-4 h-4"></i>JSON
                </button>
            </div>
        </div>

        <!-- Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slideUp">
            <div class="bg-black border border-zinc-900 rounded-xl p-5">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-zinc-500 text-xs uppercase font-bold">Total de Logs</span>
                    <i data-lucide="file-text" class="w-4 h-4 text-purple-400"></i>
                </div>
                <p class="text-3xl font-black text-white font-mono">${state.auditLog.length}</p>
            </div>
            <div class="bg-black border border-zinc-900 rounded-xl p-5">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-zinc-500 text-xs uppercase font-bold">Última Ação</span>
                    <i data-lucide="clock" class="w-4 h-4 text-purple-400"></i>
                </div>
                <p class="text-sm font-bold text-white">${state.auditLog[0]?.date || 'N/A'}</p>
            </div>
            <div class="bg-black border border-zinc-900 rounded-xl p-5">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-zinc-500 text-xs uppercase font-bold">Mais Ativo</span>
                    <i data-lucide="user" class="w-4 h-4 text-purple-400"></i>
                </div>
                <p class="text-sm font-bold text-white truncate">${getMostActiveUser()}</p>
            </div>
            <div class="bg-black border border-zinc-900 rounded-xl p-5">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-zinc-500 text-xs uppercase font-bold">Tipo Comum</span>
                    <i data-lucide="bar-chart" class="w-4 h-4 text-purple-400"></i>
                </div>
                <p class="text-sm font-bold text-white truncate">${getMostCommonAction()}</p>
            </div>
        </div>

        <!-- Tabela de Logs -->
        <div class="bg-black border border-zinc-900 rounded-xl overflow-hidden animate-slideUp">
            <div class="p-5 border-b border-zinc-900 bg-zinc-950">
                <h3 class="font-black text-white uppercase italic flex items-center">
                    <i data-lucide="list" class="mr-2 w-4 h-4 text-zinc-500"></i> 
                    Histórico de Atividades
                </h3>
            </div>
            <div class="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin">
                <table class="w-full text-left">
                    <thead class="sticky top-0 bg-zinc-950/95 backdrop-blur-sm text-zinc-500 text-[10px] font-black uppercase">
                        <tr>
                            <th class="p-4">Data/Hora</th>
                            <th class="p-4">Usuário</th>
                            <th class="p-4">Ação</th>
                            <th class="p-4">Detalhes</th>
                            <th class="p-4">Alvo</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-900">
                        ${state.auditLog.length === 0 ? `<tr><td colspan="5" class="p-8 text-center text-zinc-600 text-xs italic uppercase">Nenhum log registrado ainda.</td></tr>` : state.auditLog.map((log, idx) => `
                            <tr class="hover:bg-purple-900/10 group">
                                <td class="p-4 text-zinc-500 text-xs font-mono">${log.date}</td>
                                <td class="p-4 font-bold text-white">
                                    ${log.actor}
                                    <span class="text-zinc-500 font-mono text-xs">| ID: ${log.actorId}</span>
                                </td>
                                <td class="p-4">
                                    <span class="px-2 py-1 rounded text-xs font-black uppercase ${getActionColor(log.action)}">
                                        ${log.action}
                                    </span>
                                </td>
                                <td class="p-4 text-zinc-300 max-w-md truncate">${log.details}</td>
                                <td class="p-4 text-zinc-500 text-xs">${log.targetUser || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}

function getActionColor(action) {
    if (action.includes('Adicionado') || action.includes('Criado')) return 'bg-purple-600/20 text-purple-400 border border-purple-500/30';
    if (action.includes('Removido') || action.includes('Deletado')) return 'bg-red-600/20 text-red-400 border border-red-500/30';
    if (action.includes('Atualizado') || action.includes('Editado')) return 'bg-blue-600/20 text-blue-400 border border-blue-500/30';
    return 'bg-zinc-600/20 text-zinc-400 border border-zinc-500/30';
}

function getMostActiveUser() {
    if (state.auditLog.length === 0) return 'N/A';
    const userCounts = {};
    state.auditLog.forEach(log => {
        userCounts[log.actor] = (userCounts[log.actor] || 0) + 1;
    });
    const mostActive = Object.entries(userCounts).sort((a, b) => b[1] - a[1])[0];
    return mostActive ? mostActive[0] : 'N/A';
}

function getMostCommonAction() {
    if (state.auditLog.length === 0) return 'N/A';
    const actionCounts = {};
    state.auditLog.forEach(log => {
        actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });
    const mostCommon = Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0];
    return mostCommon ? mostCommon[0] : 'N/A';
}

function exportLogsCSV() {
    const headers = ['Data/Hora', 'Usuário', 'ID do Usuário', 'Ação', 'Detalhes', 'Alvo'];
    const rows = state.auditLog.map(log => [
        log.date,
        log.actor,
        log.actorId,
        log.action,
        log.details,
        log.targetUser || ''
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(field => `"${field}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logs_rocinha_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    alert('✅ Logs exportados em CSV!');
}

function exportLogsJSON() {
    const json = JSON.stringify(state.auditLog, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logs_rocinha_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    alert('✅ Logs exportados em JSON!');
}
