
// ===== FUNÇÕES DE GERENCIAMENTO DE ITENS DE VENDA =====

function openAddSalesItemModal() {
    const modal = document.createElement('div');
    modal.id = 'addSalesItemModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm';
    modal.innerHTML = `<div class="bg-black border-2 border-zinc-900 w-full max-w-md rounded-lg animate-scaleIn overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)]"><div class="flex justify-between items-center p-5 border-b border-zinc-900 bg-zinc-950"><h3 class="text-xl font-black text-white uppercase italic flex items-center"><i data-lucide="package-plus" class="mr-2 text-purple-400"></i> Novo Item de Venda</h3><button onclick="document.getElementById('addSalesItemModal').remove()" class="text-zinc-500 hover:text-red-500 transition-colors"><i data-lucide="x"></i></button></div><div class="p-6"><div class="mb-6"><label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Nome do Item</label><input id="newSalesItemInput" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none transition-all placeholder-zinc-700" placeholder="Ex: LSD"></div><button onclick="confirmAddSalesItem()" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95">ADICIONAR AGORA</button></div></div>`;
    document.body.appendChild(modal);
    document.getElementById('newSalesItemInput').focus();
    lucide.createIcons();
}

async function confirmAddSalesItem() {
    const val = document.getElementById('newSalesItemInput').value.trim();
    if (val && !state.salesItems.includes(val)) {
        state.salesItems.push(val);
        logAction('Item de Venda Criado', `"${val}" adicionado à lista de vendas`, null);
        await saveFinancialData();
        document.getElementById('addSalesItemModal').remove();
        renderApp();
    }
    else if (state.salesItems.includes(val)) { alert("Esse item já existe na lista!"); }
    else { alert("Digite um nome válido!"); }
}

function manageSalesItems() {
    const modal = document.createElement('div');
    modal.id = 'salesItemsModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm';
    modal.innerHTML = `<div class="bg-black border-2 border-zinc-900 w-full max-w-md rounded-lg animate-scaleIn overflow-hidden"><div class="flex justify-between items-center p-5 border-b border-zinc-900"><h3 class="text-xl font-black text-white uppercase italic">Gerenciar Itens de Venda</h3><button onclick="document.getElementById('salesItemsModal').remove()" class="text-zinc-500 hover:text-red-500"><i data-lucide="x"></i></button></div><div class="p-6 space-y-4"><div class="max-h-60 overflow-y-auto space-y-2 border border-zinc-900 rounded p-2 scrollbar-thin">${state.salesItems.map(item => `<div class="flex justify-between items-center bg-zinc-950 p-3 rounded border border-zinc-900 hover:border-purple-500/30 transition-colors"><span class="text-white text-sm font-bold uppercase">${item}</span><button onclick="removeSalesItem('${item}')" class="text-zinc-600 hover:text-red-500 transition-colors"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>`).join('')}</div></div></div>`;
    document.body.appendChild(modal);
    lucide.createIcons();
}

async function removeSalesItem(item) {
    if (confirm('Remover ' + item + '?')) {
        state.salesItems = state.salesItems.filter(i => i !== item);
        logAction('Item de Venda Removido', `"${item}" removido da lista`, null);
        await saveFinancialData();
        document.getElementById('salesItemsModal').remove();
        manageSalesItems();
        renderApp();
    }
}

// ===== RENDERIZAR HISTÓRICO DE ESTOQUE =====

function renderInventoryLog() {
    return `<div class="mt-8 animate-slideUp">
        <div class="bg-black border border-zinc-900 rounded-xl overflow-hidden">
            <div class="p-5 border-b border-zinc-900 bg-gradient-to-r from-purple-900/20 to-pink-900/20 flex justify-between items-center">
                <h3 class="font-black text-white uppercase italic flex items-center">
                    <i data-lucide="history" class="mr-2 w-5 h-5 text-purple-400"></i> 
                    Histórico de Movimentações
                    <span class="ml-3 bg-purple-600 text-white text-[10px] px-2 py-1 rounded font-black uppercase">ACESSO RESTRITO</span>
                </h3>
                <span class="text-xs font-bold bg-zinc-900 text-purple-400 px-3 py-1 rounded">${state.inventoryLog.length} Registros</span>
            </div>
            <div class="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin">
                <table class="w-full text-left">
                    <thead class="sticky top-0 bg-zinc-950/95 backdrop-blur-sm text-zinc-500 text-[10px] font-black uppercase">
                        <tr>
                            <th class="p-4">Data/Hora</th>
                            <th class="p-4">Usuário</th>
                            <th class="p-4">Item</th>
                            <th class="p-4">Ação</th>
                            <th class="p-4 text-right">Quantidade</th>
                            <th class="p-4 text-right">Antes → Depois</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-900">
                        ${state.inventoryLog.length === 0 ? `<tr><td colspan="6" class="p-8 text-center text-zinc-600 text-xs italic uppercase">Nenhuma movimentação registrada.</td></tr>` : state.inventoryLog.map(log => `
                            <tr class="hover:bg-purple-900/10 group">
                                <td class="p-4 text-zinc-500 text-xs font-mono">${log.date}</td>
                                <td class="p-4 font-bold text-white">
                                    ${log.actor} 
                                    <span class="text-zinc-500 font-mono text-xs">| ID: ${log.actorId}</span>
                                </td>
                                <td class="p-4 text-zinc-300 font-bold">${log.item}</td>
                                <td class="p-4">
                                    <span class="px-2 py-1 rounded text-xs font-black uppercase ${log.operation === 'add' ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'bg-red-600/20 text-red-400 border border-red-500/30'}">
                                        <i data-lucide="${log.operation === 'add' ? 'plus' : 'minus'}" class="w-3 h-3 inline mr-1"></i>
                                        ${log.operation === 'add' ? 'ADIÇÃO' : 'REMOÇÃO'}
                                    </span>
                                </td>
                                <td class="p-4 text-right font-mono ${log.operation === 'add' ? 'text-purple-400' : 'text-red-400'} font-bold">
                                    ${log.operation === 'add' ? '+' : '-'}${log.quantity}
                                </td>
                                <td class="p-4 text-right font-mono text-zinc-400 text-xs">
                                    ${log.before} → ${log.after}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
}
