// Render Components - Part 2

function renderDashboard() {
    const recentTransactions = state.transactions.slice(0, 5);
    return `
        <div class="space-y-8">
            <div class="animate-slideUp bg-black border border-zinc-800 rounded-lg p-8 relative overflow-hidden backdrop-blur-sm group hover:border-blue-500/50 transition-colors duration-500">
                <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                <div class="flex flex-col md:flex-row justify-between items-center relative z-10">
                    <div>
                        <p class="text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Sistema Financeiro DU7</p>
                        <h1 class="text-5xl md:text-7xl font-black text-white font-mono tracking-tighter">R$ ${state.money.toLocaleString('pt-BR')}</h1>
                        <div class="flex items-center mt-4 space-x-6">
                            <span class="flex items-center text-yellow-400 text-sm font-bold bg-yellow-900/30 px-3 py-1 rounded border border-yellow-500/30">
                                <i data-lucide="trending-up" class="w-4 h-4 mr-2"></i> +${state.transactions.filter(t => t.type === 'in').length} Op.
                            </span>
                        </div>
                    </div>
                    <div class="mt-6 md:mt-0">
                        <div class="w-24 h-24 bg-black rounded-full border-4 border-yellow-500 flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.3)] animate-float">
                            <i data-lucide="dollar-sign" class="w-12 h-12 text-yellow-400"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-5 animate-slideUp">
                    <h3 class="text-yellow-400 font-black uppercase text-sm tracking-[0.2em] flex items-center border-l-4 border-yellow-400 pl-4">
                        <i data-lucide="activity" class="w-4 h-4 mr-3"></i> Log de Atividades
                    </h3>
                    ${recentTransactions.length > 0 ? `
                        <div class="space-y-3">
                            ${recentTransactions.map(t => `
                                <div class="bg-zinc-950/50 border border-zinc-900 rounded p-4 flex items-center justify-between hover:border-yellow-400/50 transition-all">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 rounded flex items-center justify-center font-bold ${t.type === 'in' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}">
                                            <i data-lucide="${t.type === 'in' ? 'arrow-down-left' : 'arrow-up-right'}" class="w-5 h-5"></i>
                                        </div>
                                        <div>
                                            <p class="text-white text-sm font-bold uppercase">${t.desc}</p>
                                            <p class="text-[10px] text-zinc-500 font-mono">${t.date}</p>
                                        </div>
                                    </div>
                                    <span class="font-mono text-lg font-black ${t.type === 'in' ? 'text-yellow-400' : 'text-red-500'}">
                                        ${t.type === 'in' ? '+' : '-'} R$ ${t.amount.toLocaleString('pt-BR')}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    ` : `<div class="p-10 text-center border-2 border-dashed border-zinc-900 rounded text-zinc-600 italic uppercase tracking-widest text-xs">Sem registros no sistema.</div>`}
                </div>
                <div class="space-y-5 animate-slideUp">
                    <h3 class="text-zinc-500 font-black uppercase text-sm tracking-[0.2em] flex items-center border-l-4 border-zinc-700 pl-4">
                        <i data-lucide="shield-alert" class="w-4 h-4 mr-3"></i> Intel DU7
                    </h3>
                    <div class="bg-zinc-950 border border-zinc-900 rounded-lg p-6 space-y-4">
                        <div class="flex justify-between items-center p-3 bg-black rounded border border-zinc-800">
                            <span class="text-zinc-400 text-xs font-bold uppercase">Território</span>
                            <span class="text-blue-500 font-black text-xs uppercase">DOMINADO</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-black rounded border border-zinc-800">
                            <span class="text-zinc-400 text-xs font-bold uppercase">Membros ON</span>
                            <span class="text-white font-mono font-bold">${state.members.filter(m => m.status === 'online').length}/${state.members.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderMembers() {
    return `
        <div class="space-y-8">
            <div class="flex justify-between items-center animate-slideUp">
                <h2 class="text-3xl font-black text-white tracking-tighter uppercase italic">Membros <span class="text-yellow-400">DU7</span></h2>
            </div>
            <div class="bg-black border border-zinc-900 rounded-xl overflow-hidden shadow-2xl animate-slideUp">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-zinc-950 border-b border-zinc-900 text-zinc-500 text-xs font-black uppercase tracking-[0.2em]">
                            <th class="p-6">Membro</th>
                            <th class="p-6">Cargo</th>
                            <th class="p-6">Status</th>
                            <th class="p-6">Financeiro</th>
                            <th class="p-6">Ações</th>
                            <th class="p-6">Rotas</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-900/50">
                        ${state.members.length === 0 ?
            `<tr><td colspan="6" class="p-8 text-center text-zinc-600 text-sm italic">Nenhum membro registrado.</td></tr>` :
            state.members.map(m => `
                            <tr class="hover:bg-blue-900/10 transition-colors group">
                                <td class="p-6">
                                    <div class="flex items-center">
                                        <div class="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-zinc-500 font-black mr-4 border border-zinc-800">${m.name?.charAt(0) || '?'}</div>
                                        <div>
                                            <p class="text-white font-bold text-base">${m.name || 'N/A'} | ${m.gameId || '?'}</p>
                                            <p class="text-[10px] text-zinc-600 uppercase font-mono">${m.email || ''}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-6">
                                    <span class="text-xs px-3 py-1.5 rounded border bg-black font-bold uppercase ${m.role === 'Líder' ? 'text-yellow-400 border-yellow-500/30' : 'text-zinc-400 border-zinc-800'}">${m.role || 'Vapor'}</span>
                                </td>
                                <td class="p-6">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${m.status === 'online' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : 'bg-zinc-900 text-zinc-600 border-zinc-800'}">
                                        <span class="w-1.5 h-1.5 rounded-full mr-2 ${m.status === 'online' ? 'bg-blue-500 animate-pulse' : 'bg-zinc-600'}"></span>
                                        ${m.status || 'offline'}
                                    </span>
                                </td>
                                <td class="p-6 text-yellow-400 font-mono font-bold">R$ ${(m.financial || 0).toLocaleString('pt-BR')}</td>
                                <td class="p-6 text-zinc-300 font-bold">${m.actions || 0}</td>
                                <td class="p-6 text-zinc-300 font-bold">${m.routes || 0}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderRanking() {
    const topFinancial = [...state.members].sort((a, b) => (b.financial || 0) - (a.financial || 0)).slice(0, 5);
    const topActions = [...state.members].sort((a, b) => (b.actions || 0) - (a.actions || 0)).slice(0, 5);
    const topRoutes = [...state.members].sort((a, b) => (b.routes || 0) - (a.routes || 0)).slice(0, 5);

    const renderRankList = (title, icon, data, valueFormatter) => `
        <div class="bg-black border border-zinc-800 rounded-xl p-6 card-insane animate-slideUp">
            <div class="flex items-center mb-6 pb-4 border-b border-zinc-900">
                <div class="p-3 bg-blue-900/20 rounded-lg mr-4 border border-blue-500/30">
                    <i data-lucide="${icon}" class="w-6 h-6 text-yellow-400"></i>
                </div>
                <h3 class="text-lg font-black text-white uppercase italic">${title}</h3>
            </div>
            <div class="space-y-4">
                ${data.map((m, i) => {
        let rankColor = 'text-zinc-500', rankBg = 'bg-zinc-900', medal = '';
        if (i === 0) { rankColor = 'text-yellow-400'; rankBg = 'bg-yellow-900/20'; medal = '👑'; }
        else if (i === 1) { rankColor = 'text-zinc-300'; rankBg = 'bg-zinc-800/50'; medal = '🥈'; }
        else if (i === 2) { rankColor = 'text-orange-700'; rankBg = 'bg-orange-900/10'; medal = '🥉'; }
        return `
                        <div class="flex items-center justify-between p-3 rounded ${rankBg}">
                            <div class="flex items-center">
                                <span class="font-black ${rankColor} w-6 text-center mr-3 text-lg">${i + 1}</span>
                                <div>
                                    <p class="font-bold text-white text-sm">${m.name} | ${m.gameId} ${medal}</p>
                                    <p class="text-[10px] text-zinc-500 uppercase">${m.role}</p>
                                </div>
                            </div>
                            <span class="font-mono font-bold text-blue-400 text-sm">${valueFormatter(m)}</span>
                        </div>
                    `;
    }).join('')}
                ${data.length === 0 ? '<p class="text-zinc-600 text-xs text-center italic">Sem dados.</p>' : ''}
            </div>
        </div>
    `;

    return `
        <div class="space-y-8">
            <div class="text-center mb-10 animate-slideUp">
                <h2 class="text-4xl font-black text-white uppercase italic">Hall da Fama <span class="text-yellow-400">DU7</span></h2>
                <p class="text-zinc-500 text-xs uppercase tracking-[0.3em] mt-2">Melhores Desempenhos</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${renderRankList('Top Financeiro', 'dollar-sign', topFinancial, m => `R$ ${(m.financial || 0).toLocaleString('pt-BR')}`)}
                ${renderRankList('Top Ações', 'crosshair', topActions, m => `${m.actions || 0} Ações`)}
                ${renderRankList('Rei das Rotas', 'truck', topRoutes, m => `${m.routes || 0} Entregas`)}
            </div>
        </div>
    `;
}
