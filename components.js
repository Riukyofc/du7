// Components - Dashboard, Members, Ranking
function renderDashboard() {
    const currentUserEmail = state.currentUser?.email || '';
    const isSuperAdmin = currentUserEmail === 'alexcastrocutrim@gmail.com';
    const recentTransactions = state.transactions.slice(0, 5);
    return `<div class="space-y-8">
        <div class="animate-slideUp bg-black border border-zinc-800 rounded-lg p-8 relative overflow-hidden backdrop-blur-sm group hover:border-purple-600/50 transition-colors duration-500">
            <div class="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div class="flex flex-col md:flex-row justify-between items-center relative z-10">
                <div>
                    <p class="text-zinc-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Caixa da Organização ${isSuperAdmin ? '<button onclick="editCashBalance()" class="ml-2 text-purple-400 hover:text-purple-300"><i data-lucide="edit-3" class="w-3 h-3 inline"></i></button>' : ''}</p>
                    <h1 class="text-5xl md:text-7xl font-black text-white font-mono tracking-tighter">R$ ${state.money.toLocaleString('pt-BR')}</h1>
                    <div class="flex items-center mt-4 space-x-6">
                        <span class="flex items-center text-purple-400 text-sm font-bold bg-purple-900/30 px-3 py-1 rounded border border-purple-500/30">
                            <i data-lucide="trending-up" class="w-4 h-4 mr-2"></i> +${state.transactions.filter(t => t.type === 'in').length} Op.
                        </span>
                    </div>
                </div>
                <div class="mt-6 md:mt-0">
                    <div class="w-24 h-24 bg-black rounded-full border-4 border-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)] animate-float">
                        <i data-lucide="dollar-sign" class="w-12 h-12 text-purple-500"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-5 animate-slideUp">
                <h3 class="text-white font-black uppercase text-sm tracking-[0.2em] flex items-center border-l-4 border-purple-600 pl-4">
                    <i data-lucide="activity" class="w-4 h-4 mr-3"></i> Log de Atividades
                </h3>
                ${recentTransactions.length > 0 ? `<div class="space-y-3">${recentTransactions.map((t, idx) => `
                    <div class="bg-zinc-950/50 border border-zinc-900 rounded p-4 flex items-center justify-between hover:border-purple-600/50 transition-all group">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded flex items-center justify-center font-bold ${t.type === 'in' ? 'bg-purple-600 text-white' : 'bg-white text-black'}">
                                <i data-lucide="${t.type === 'in' ? 'arrow-down-left' : 'arrow-up-right'}" class="w-5 h-5"></i>
                            </div>
                            <div><p class="text-white text-sm font-bold uppercase">${t.desc}</p><p class="text-[10px] text-zinc-500 font-mono">${t.date}</p></div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="font-mono text-lg font-black ${t.type === 'in' ? 'text-purple-400' : 'text-white'}">${t.type === 'in' ? '+' : '-'} R$ ${t.amount.toLocaleString('pt-BR')}</span>
                            ${isSuperAdmin ? `<button onclick="deleteTransaction(${idx})" class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all"><i data-lucide="trash-2" class="w-4 h-4"></i></button>` : ''}
                        </div>
                    </div>`).join('')}</div>` : `<div class="p-10 text-center border-2 border-dashed border-zinc-900 rounded text-zinc-600 italic uppercase tracking-widest text-xs">Sem registros no sistema.</div>`}
            </div>
            <div class="space-y-5 animate-slideUp">
                <h3 class="text-zinc-500 font-black uppercase text-sm tracking-[0.2em] flex items-center border-l-4 border-zinc-700 pl-4"><i data-lucide="shield-alert" class="w-4 h-4 mr-3"></i> Intel ROCINHA</h3>
                <div class="bg-zinc-950 border border-zinc-900 rounded-lg p-6 space-y-4">
                    <div class="flex justify-between items-center p-3 bg-black rounded border border-zinc-800"><span class="text-zinc-400 text-xs font-bold uppercase">Território</span><span class="text-purple-500 font-black text-xs uppercase">DOMINADO</span></div>
                    <div class="flex justify-between items-center p-3 bg-black rounded border border-zinc-800"><span class="text-zinc-400 text-xs font-bold uppercase">Membros ON</span><span class="text-white font-mono font-bold">${state.members.filter(m => m.status === 'online').length}/${state.members.length}</span></div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderMembers() {
    const currentUserEmail = state.currentUser?.email || '';
    const isSuperAdmin = currentUserEmail === 'alexcastrocutrim@gmail.com';
    const currentMember = state.members.find(m => m.id === state.currentUser?.uid);
    const isLeader = currentMember && ['Gerente', 'Dono', 'Comandante', 'Admin'].includes(currentMember.role);
    const canEditRoles = isSuperAdmin || isLeader;

    return `<div class="space-y-8">
        <div class="flex justify-between items-center animate-slideUp">
            <h2 class="text-3xl font-black text-white tracking-tighter uppercase italic">Membros <span class="text-purple-500">ROCINHA</span></h2>
            ${isSuperAdmin ? '<span class="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg animate-pulse">⭐ SUPER ADMIN</span>' : ''}
        </div>
        <div class="bg-black border border-zinc-900 rounded-xl overflow-hidden shadow-2xl animate-slideUp">
            <table class="w-full text-left">
                <thead><tr class="bg-zinc-950 border-b border-zinc-900 text-zinc-500 text-xs font-black uppercase tracking-[0.2em]"><th class="p-6">Membro</th><th class="p-6">Cargo</th><th class="p-6">Status</th><th class="p-6">Financeiro</th><th class="p-6">Ações</th><th class="p-6">Rotas</th>${canEditRoles ? '<th class="p-6">Ações</th>' : ''}</tr></thead>
                <tbody class="divide-y divide-zinc-900/50">
                    ${state.members.length === 0 ? `<tr><td colspan="${canEditRoles ? '7' : '6'}" class="p-8 text-center text-zinc-600 text-sm italic">Nenhum membro registrado.</td></tr>` : state.members.map(m => `
                        <tr class="hover:bg-purple-900/10 transition-colors group">
                            <td class="p-6"><div class="flex items-center"><div class="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-zinc-500 font-black mr-4 border border-zinc-800">${m.name?.charAt(0) || '?'}</div><div><p class="text-white font-bold text-base">${m.name || 'N/A'} | ${m.gameId || '?'}</p><p class="text-[10px] text-zinc-600 uppercase font-mono">${m.email || ''}</p></div></div></td>
                            <td class="p-6">
                                ${canEditRoles ? `
                                <select onchange="updateMemberRole('${m.id}', this.value)" 
                                    class="text-xs px-3 py-1.5 rounded border bg-black font-bold uppercase cursor-pointer hover:border-purple-500 transition-colors ${['Gerente', 'Dono', 'Comandante', 'Admin'].includes(m.role) ? 'text-purple-400 border-purple-500/30' : 'text-zinc-400 border-zinc-800'}">
                                    <option value="Vapor" ${m.role === 'Vapor' ? 'selected' : ''}>Vapor</option>
                                    <option value="Soldado" ${m.role === 'Soldado' ? 'selected' : ''}>Soldado</option>
                                    <option value="Gerente" ${m.role === 'Gerente' ? 'selected' : ''}>Gerente</option>
                                    <option value="Dono" ${m.role === 'Dono' ? 'selected' : ''}>Dono</option>
                                    <option value="Comandante" ${m.role === 'Comandante' ? 'selected' : ''}>Comandante</option>
                                    <option value="Admin" ${m.role === 'Admin' ? 'selected' : ''}>Admin</option>
                                </select>
                                ` : `<span class="text-xs px-3 py-1.5 rounded border bg-black font-bold uppercase ${['Gerente', 'Dono', 'Comandante', 'Admin'].includes(m.role) ? 'text-purple-400 border-purple-500/30' : 'text-zinc-400 border-zinc-800'}">${m.role || 'Vapor'}</span>`}
                            </td>
                            <td class="p-6"><span class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${m.status === 'online' ? 'bg-green-900/30 text-green-400 border-green-500/30' : 'bg-zinc-900 text-zinc-600 border-zinc-800'}"><span class="w-1.5 h-1.5 rounded-full mr-2 ${m.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}"></span>${m.status || 'offline'}</span></td>
                            <td class="p-6 text-purple-400 font-mono font-bold">
                                ${canEditRoles ? `<input type="number" value="${m.financial || 0}" onchange="updateMemberField('${m.id}', 'financial', parseFloat(this.value))" class="w-24 bg-transparent border-b border-transparent hover:border-purple-500 focus:border-purple-500 outline-none transition-colors">` : `R$ ${(m.financial || 0).toLocaleString('pt-BR')}`}
                            </td>
                            <td class="p-6 text-zinc-300 font-bold">
                                ${canEditRoles ? `<input type="number" value="${m.actions || 0}" onchange="updateMemberField('${m.id}', 'actions', parseInt(this.value))" class="w-16 bg-transparent border-b border-transparent hover:border-zinc-500 focus:border-zinc-500 outline-none transition-colors">` : `${m.actions || 0}`}
                            </td>
                            <td class="p-6 text-zinc-300 font-bold">
                                ${canEditRoles ? `<input type="number" value="${m.routes || 0}" onchange="updateMemberField('${m.id}', 'routes', parseInt(this.value))" class="w-16 bg-transparent border-b border-transparent hover:border-zinc-500 focus:border-zinc-500 outline-none transition-colors">` : `${m.routes || 0}`}
                            </td>
                            ${canEditRoles ? `<td class="p-6"><button onclick="deleteMember('${m.id}')" class="text-red-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><i data-lucide="trash-2" class="w-4 h-4"></i></button></td>` : ''}
                        </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

function renderRanking() {
    const topFinancial = [...state.members].sort((a, b) => (b.financial || 0) - (a.financial || 0)).slice(0, 5);
    const topActions = [...state.members].sort((a, b) => (b.actions || 0) - (a.actions || 0)).slice(0, 5);
    const topRoutes = [...state.members].sort((a, b) => (b.routes || 0) - (a.routes || 0)).slice(0, 5);

    const renderRankList = (title, icon, data, valueFormatter) => `
        <div class="bg-black border border-zinc-800 rounded-xl p-6 card-insane animate-slideUp">
            <div class="flex items-center mb-6 pb-4 border-b border-zinc-900"><div class="p-3 bg-purple-900/20 rounded-lg mr-4 border border-purple-500/30"><i data-lucide="${icon}" class="w-6 h-6 text-purple-400"></i></div><h3 class="text-lg font-black text-white uppercase italic">${title}</h3></div>
            <div class="space-y-4">${data.map((m, i) => {
        let rankColor = 'text-zinc-500', rankBg = 'bg-zinc-900', medal = '';
        if (i === 0) { rankColor = 'text-purple-400'; rankBg = 'bg-purple-900/20'; medal = '👑'; }
        else if (i === 1) { rankColor = 'text-white'; rankBg = 'bg-zinc-800/50'; medal = '🥈'; }
        else if (i === 2) { rankColor = 'text-orange-700'; rankBg = 'bg-orange-900/10'; medal = '🥉'; }
        return `<div class="flex items-center justify-between p-3 rounded ${rankBg}"><div class="flex items-center"><span class="font-black ${rankColor} w-6 text-center mr-3 text-lg">${i + 1}</span><div><p class="font-bold text-white text-sm">${m.name} | ${m.gameId} ${medal}</p><p class="text-[10px] text-zinc-500 uppercase">${m.role}</p></div></div><span class="font-mono font-bold text-purple-400 text-sm">${valueFormatter(m)}</span></div>`;
    }).join('')}${data.length === 0 ? '<p class="text-zinc-600 text-xs text-center italic">Sem dados.</p>' : ''}</div>
        </div>`;

    return `<div class="space-y-8">
        <div class="text-center mb-10 animate-slideUp"><h2 class="text-4xl font-black text-white uppercase italic">Hall da Fama <span class="text-purple-500">ROCINHA</span></h2><p class="text-zinc-500 text-xs uppercase tracking-[0.3em] mt-2">Os Melhores da Favela</p></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${renderRankList('Magnata', 'dollar-sign', topFinancial, m => `R$ ${(m.financial || 0).toLocaleString('pt-BR')}`)}
            ${renderRankList('Atirador de Elite', 'crosshair', topActions, m => `${m.actions || 0} Ações`)}
            ${renderRankList('Piloto de Fuga', 'truck', topRoutes, m => `${m.routes || 0} Entregas`)}
        </div>
    </div>`;
}
