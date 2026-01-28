// Features - Actions, Routes
function renderActions() {
    const val = parseFloat(state.actionForm.value) || 0;
    const count = state.actionForm.selectedMembers.length;
    const factionCut = val * 0.10;
    const remaining = val - factionCut;
    const splitPerMember = count > 0 ? remaining / count : 0;
    const actionTypes = ["Assalto", "Sequestro", "Tráfico", "Lojinha", "PVP", "Outros"];

    return `<div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div class="xl:col-span-1 space-y-6">
            <div class="bg-black border border-zinc-800 rounded-xl p-6 border-t-4 border-t-purple-600 animate-slideUp">
                <h3 class="text-xl font-black text-white mb-6 flex items-center uppercase italic"><i data-lucide="crosshair" class="text-purple-400 mr-3 w-5 h-5"></i> Registrar Ação</h3>
                <div class="space-y-5">
                    <div><label class="text-purple-400 text-xs uppercase font-black tracking-[0.2em] mb-2 block">Nome da Ação</label><input oninput="state.actionForm.title = this.value" value="${state.actionForm.title}" class="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-white focus:border-purple-400 outline-none font-bold" placeholder="Ex: Assalto Banco Central"></div>
                    <div><label class="text-purple-400 text-xs uppercase font-black tracking-[0.2em] mb-2 block">Tipo de Ação</label><select onchange="state.actionForm.type = this.value" class="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-white focus:border-purple-400 outline-none font-bold">${actionTypes.map(t => `<option value="${t}" ${state.actionForm.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
                    <div><label class="text-purple-400 text-xs uppercase font-black tracking-[0.2em] mb-2 block">Valor Total Ganho</label><div class="relative"><span class="absolute left-3 top-3 text-zinc-500 font-mono">R$</span><input type="number" oninput="state.actionForm.value = this.value" value="${state.actionForm.value}" class="w-full bg-zinc-950 border border-zinc-900 rounded p-3 pl-10 text-white focus:border-purple-400 outline-none font-mono font-bold" placeholder="0.00"></div></div>
                    <div><label class="text-purple-400 text-xs uppercase font-black tracking-[0.2em] mb-2 block">Membros Participantes</label><div class="bg-zinc-950 border border-zinc-900 rounded p-2 max-h-48 overflow-y-auto scrollbar-thin grid grid-cols-2 gap-2">${state.members.map(m => `<label class="flex items-center p-2 bg-black border border-zinc-800 hover:border-purple-400/50 rounded cursor-pointer"><input type="checkbox" onchange="toggleActionMember('${m.id}')" ${state.actionForm.selectedMembers.includes(m.id) ? 'checked' : ''} class="w-4 h-4 bg-zinc-900 border-zinc-700 rounded"><span class="ml-2 text-xs text-zinc-300 font-bold truncate">${m.name} | ${m.gameId}</span></label>`).join('')}</div><p class="text-right text-[10px] text-purple-400 mt-1 uppercase font-bold">${count} Membros Selecionados</p></div>
                    <div class="bg-zinc-950/80 p-4 rounded border border-purple-500/20 space-y-2"><div class="flex justify-between text-xs font-bold"><span class="text-white uppercase">Facção (10%)</span><span class="text-white font-mono">R$ ${factionCut.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span></div><div class="flex justify-between text-xs font-bold border-t border-zinc-800 pt-2"><span class="text-purple-400 uppercase">Membros (${count}x)</span><span class="text-purple-400 font-mono">R$ ${splitPerMember.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / cada</span></div></div>
                    <button onclick="submitAction()" class="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest rounded active:scale-95">REGISTRAR AÇÃO</button>
                </div>
            </div>
        </div>
        <div class="xl:col-span-2 animate-slideUp">
            <div class="bg-black border border-zinc-900 rounded-xl overflow-hidden h-full flex flex-col">
                <div class="p-5 border-b border-zinc-900 bg-zinc-950 flex justify-between items-center"><h3 class="font-black text-white uppercase italic flex items-center"><i data-lucide="list" class="mr-2 w-4 h-4 text-zinc-500"></i> Histórico de Operações</h3><span class="text-xs font-bold bg-zinc-900 text-purple-400 px-2 py-1 rounded">${state.actions.length} Ações</span></div>
                <div class="overflow-x-auto flex-1"><table class="w-full text-left"><thead class="bg-zinc-950/50 text-zinc-500 text-[10px] font-black uppercase"><tr><th class="p-4">Ação</th><th class="p-4">Tipo</th><th class="p-4">Total</th><th class="p-4 text-purple-400">Facção</th><th class="p-4">Data</th></tr></thead><tbody class="divide-y divide-zinc-900 text-sm">${state.actions.length === 0 ? `<tr><td colspan="5" class="p-8 text-center text-zinc-600 text-xs italic uppercase">Nenhuma ação registrada.</td></tr>` : state.actions.map(a => `<tr class="hover:bg-purple-900/10"><td class="p-4 font-bold text-white">${a.title}</td><td class="p-4"><span class="text-[10px] bg-zinc-900 px-2 py-1 rounded text-zinc-400 uppercase font-bold">${a.type}</span></td><td class="p-4 font-mono text-zinc-300">R$ ${a.total.toLocaleString('pt-BR')}</td><td class="p-4 font-mono text-purple-400 font-bold">+ R$ ${a.factionCut.toLocaleString('pt-BR')}</td><td class="p-4 text-right text-xs text-zinc-500 font-mono">${a.date}</td></tr>`).join('')}</tbody></table></div>
            </div>
        </div>
    </div>`;
}

function toggleActionMember(id) {
    if (state.actionForm.selectedMembers.includes(id)) state.actionForm.selectedMembers = state.actionForm.selectedMembers.filter(mId => mId !== id);
    else state.actionForm.selectedMembers.push(id);
    renderApp();
}

async function submitAction() {
    const title = state.actionForm.title, type = state.actionForm.type, val = parseFloat(state.actionForm.value), selectedIds = state.actionForm.selectedMembers;
    if (!title || !val || val <= 0 || selectedIds.length === 0) { alert("Preencha todos os campos e selecione pelo menos um membro."); return; }
    const factionCut = val * 0.10, split = (val - factionCut) / selectedIds.length;
    const memberNames = state.members.filter(m => selectedIds.includes(m.id)).map(m => m.name);
    for (const id of selectedIds) { const member = state.members.find(m => m.id === id); if (member) { member.actions = (member.actions || 0) + 1; await updateMemberInFirestore(id, { actions: member.actions }); } }
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    state.actions.unshift({ title, type, total: val, factionCut, split, members: memberNames, date: dateStr });
    addTransaction('in', factionCut, `Ação: ${title} (${type})`);
    await saveFinancialData();
    state.actionForm = { title: '', type: 'Assalto', value: '', selectedMembers: [] };
    alert(`Ação registrada! R$ ${factionCut.toLocaleString('pt-BR')} adicionados ao caixa.`);
    renderApp();
}

function renderRoutes() {
    return `<div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div class="xl:col-span-1 space-y-6">
            <div class="bg-black border border-zinc-800 rounded-xl p-6 border-t-4 border-t-purple-600 animate-slideUp">
                <h3 class="text-xl font-black text-white mb-6 flex items-center uppercase italic"><i data-lucide="truck" class="text-purple-400 mr-3 w-5 h-5"></i> Registrar Rota</h3>
                <div class="space-y-5">
                    <div><label class="text-purple-400 text-xs uppercase font-black tracking-[0.2em] mb-2 block">Membro</label><select onchange="state.routeForm.memberId = this.value" class="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-white focus:border-purple-400 outline-none font-bold"><option value="">Selecione o membro...</option>${state.members.map(m => `<option value="${m.id}">${m.name} | ID: ${m.gameId}</option>`).join('')}</select></div>
                    <div><label class="text-purple-400 text-xs uppercase font-black tracking-[0.2em] mb-2 block">Material</label><div class="flex gap-2"><select onchange="state.routeForm.material = this.value" class="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-white focus:border-purple-400 outline-none font-bold">${state.routeMaterials.map(m => `<option value="${m}">${m}</option>`).join('')}</select><button onclick="openAddRouteItemModal()" class="bg-purple-600 hover:bg-purple-500 text-white rounded p-3 flex items-center justify-center min-w-[50px] transition-all active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.3)]"><i data-lucide="plus" class="w-6 h-6"></i></button></div><div class="text-right mt-1"><button onclick="manageRouteItems()" class="text-[10px] text-zinc-500 hover:text-white underline uppercase tracking-wider font-bold">Gerenciar Lista</button></div></div>
                    <div><label class="text-purple-400 text-xs uppercase font-black tracking-[0.2em] mb-2 block">Quantidade</label><input type="number" oninput="state.routeForm.quantity = this.value" value="${state.routeForm.quantity}" placeholder="Ex: 100" class="w-full bg-zinc-950 border border-zinc-900 rounded p-3 text-white focus:border-purple-400 outline-none font-mono font-bold"></div>
                    <button onclick="submitRoute()" class="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest rounded active:scale-95">CONFIRMAR ENTREGA</button>
                </div>
            </div>
        </div>
        <div class="xl:col-span-2 animate-slideUp">
            <div class="bg-black border border-zinc-900 rounded-xl overflow-hidden h-full flex flex-col">
                <div class="p-5 border-b border-zinc-900 bg-zinc-950 flex justify-between items-center"><h3 class="font-black text-white uppercase italic flex items-center"><i data-lucide="clipboard-list" class="mr-2 w-4 h-4 text-zinc-500"></i> Log de Entregas</h3><span class="text-xs font-bold bg-zinc-900 text-purple-400 px-2 py-1 rounded">${state.routesLog.length} Entregas</span></div>
                <div class="overflow-x-auto flex-1"><table class="w-full text-left"><thead class="bg-zinc-950/50 text-zinc-500 text-[10px] font-black uppercase"><tr><th class="p-4">Membro</th><th class="p-4">Material</th><th class="p-4 text-right">Qtd</th><th class="p-4 text-right">Hora</th></tr></thead><tbody class="divide-y divide-zinc-900 text-sm">${state.routesLog.length === 0 ? `<tr><td colspan="4" class="p-8 text-center text-zinc-600 text-xs italic uppercase">Nenhuma rota registrada.</td></tr>` : state.routesLog.map(log => `<tr class="hover:bg-purple-900/10"><td class="p-4 font-bold text-white">${log.memberName} <span class="text-zinc-500 font-mono text-xs">| ID: ${log.memberGameId}</span></td><td class="p-4 text-zinc-400">${log.material}</td><td class="p-4 text-right font-mono text-purple-400 font-bold">${log.qty}</td><td class="p-4 text-right text-xs text-zinc-500 font-mono">${log.date}</td></tr>`).join('')}</tbody></table></div>
            </div>
        </div>
    </div>`;
}

async function submitRoute() {
    const memberId = state.routeForm.memberId, material = state.routeForm.material, quantity = parseInt(state.routeForm.quantity);
    if (!memberId) { alert("Selecione um membro!"); return; }
    if (!quantity || quantity <= 0) { alert("Insira uma quantidade válida!"); return; }
    const member = state.members.find(m => m.id === memberId);
    if (member) { member.routes = (member.routes || 0) + 1; await updateMemberInFirestore(memberId, { routes: member.routes }); }
    const now = new Date();
    const dateStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    state.routesLog.unshift({ memberName: member?.name || 'Desconhecido', memberGameId: member?.gameId || '?', material, qty: quantity, date: dateStr });
    await saveFinancialData();
    alert(`Rota registrada para ${member?.name}!`);
    state.routeForm.memberId = ''; state.routeForm.quantity = '';
    renderApp();
}

function openAddRouteItemModal() {
    const modal = document.createElement('div');
    modal.id = 'addRouteItemModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm';
    modal.innerHTML = `<div class="bg-black border-2 border-zinc-900 w-full max-w-md rounded-lg animate-scaleIn overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)]"><div class="flex justify-between items-center p-5 border-b border-zinc-900 bg-zinc-950"><h3 class="text-xl font-black text-white uppercase italic flex items-center"><i data-lucide="package-plus" class="mr-2 text-purple-400"></i> Nova Rota</h3><button onclick="document.getElementById('addRouteItemModal').remove()" class="text-zinc-500 hover:text-red-500 transition-colors"><i data-lucide="x"></i></button></div><div class="p-6"><div class="mb-6"><label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Nome do Item/Rota</label><input id="newRouteItemInput" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none transition-all placeholder-zinc-700" placeholder="Ex: Caixa Misteriosa"></div><button onclick="confirmAddRouteItem()" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95">ADICIONAR AGORA</button></div></div>`;
    document.body.appendChild(modal);
    document.getElementById('newRouteItemInput').focus();
    lucide.createIcons();
}

async function confirmAddRouteItem() {
    const val = document.getElementById('newRouteItemInput').value.trim();
    if (val && !state.routeMaterials.includes(val)) { state.routeMaterials.push(val); state.routeForm.material = val; await saveFinancialData(); document.getElementById('addRouteItemModal').remove(); renderApp(); }
    else if (state.routeMaterials.includes(val)) { alert("Esse item já existe na lista!"); }
}

function manageRouteItems() {
    const modal = document.createElement('div');
    modal.id = 'routeItemsModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm';
    modal.innerHTML = `<div class="bg-black border-2 border-zinc-900 w-full max-w-md rounded-lg animate-scaleIn overflow-hidden"><div class="flex justify-between items-center p-5 border-b border-zinc-900"><h3 class="text-xl font-black text-white uppercase italic">Gerenciar Itens de Rota</h3><button onclick="document.getElementById('routeItemsModal').remove()" class="text-zinc-500 hover:text-red-500"><i data-lucide="x"></i></button></div><div class="p-6 space-y-4"><div class="max-h-60 overflow-y-auto space-y-2 border border-zinc-900 rounded p-2 scrollbar-thin">${state.routeMaterials.map(item => `<div class="flex justify-between items-center bg-zinc-950 p-3 rounded border border-zinc-900 hover:border-purple-500/30 transition-colors"><span class="text-white text-sm font-bold uppercase">${item}</span><button onclick="removeRouteItem('${item}')" class="text-zinc-600 hover:text-red-500 transition-colors"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>`).join('')}</div></div></div>`;
    document.body.appendChild(modal);
    lucide.createIcons();
}

async function removeRouteItem(item) {
    if (confirm('Remover ' + item + '?')) { state.routeMaterials = state.routeMaterials.filter(i => i !== item); await saveFinancialData(); document.getElementById('routeItemsModal').remove(); manageRouteItems(); renderApp(); }
}
