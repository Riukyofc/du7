// Sales, Inventory, Financial Functions

function renderSales() {
    const val = parseFloat(state.sales.value) || 0;
    const factionCut = val * 0.40;
    const playerCut = val * 0.60;
    const drugs = ['Maconha', 'Cocaína', 'Metanfetamina', 'Crack', 'Combo'];

    return `
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div class="xl:col-span-1 space-y-6">
                <div class="bg-black border border-zinc-800 rounded-xl p-6 border-t-4 border-t-blue-600 animate-slideUp">
                    <h3 class="text-xl font-black text-white mb-6 flex items-center uppercase italic">
                        <i data-lucide="calculator" class="text-yellow-400 mr-3 w-5 h-5"></i> Registrar Venda
                    </h3>
                    <div class="space-y-6">
                        <div>
                            <label class="text-blue-400 text-xs uppercase font-black tracking-[0.2em] mb-3 block">Quem Vendeu?</label>
                            <select onchange="state.sales.memberId = this.value" class="w-full bg-zinc-950 border border-zinc-900 rounded p-4 text-white focus:border-yellow-400 outline-none font-bold">
                                <option value="">Selecione o membro...</option>
                                ${state.members.map(m => `<option value="${m.id}">${m.name} | ID: ${m.gameId}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="text-blue-400 text-xs uppercase font-black tracking-[0.2em] mb-3 block">Itens</label>
                            <div class="grid grid-cols-2 gap-3">
                                ${drugs.map(drug => `
                                    <button onclick="toggleSaleItem('${drug}')" class="p-4 rounded border transition-all uppercase text-xs font-bold ${state.sales.items.includes(drug) ? 'bg-blue-600 text-white border-blue-500 scale-105' : 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-700'}">
                                        ${drug}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        <div>
                            <label class="text-blue-400 text-xs uppercase font-black tracking-[0.2em] mb-3 block">Valor Total</label>
                            <div class="relative">
                                <span class="absolute left-5 top-4 text-zinc-500 font-mono text-lg">R$</span>
                                <input type="number" value="${state.sales.value}" oninput="state.sales.value = this.value" class="w-full bg-zinc-950 border border-zinc-900 rounded p-4 pl-12 text-white text-xl font-mono font-bold focus:border-yellow-400 outline-none" placeholder="0.00">
                            </div>
                        </div>
                        <div class="bg-zinc-950/80 p-4 rounded border border-blue-500/20 space-y-2">
                            <div class="flex justify-between text-xs font-bold">
                                <span class="text-purple-400 uppercase">Facção (40%)</span>
                                <span class="text-purple-400 font-mono">R$ ${factionCut.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div class="flex justify-between text-xs font-bold border-t border-zinc-800 pt-2">
                                <span class="text-blue-400 uppercase">Lucro (60%)</span>
                                <span class="text-blue-400 font-mono">R$ ${playerCut.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>
                        <button onclick="processSale()" class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded active:scale-95 flex items-center justify-center">
                            <i data-lucide="check-circle" class="mr-3 w-5 h-5"></i> CONFIRMAR
                        </button>
                    </div>
                </div>
            </div>
            <div class="xl:col-span-2 animate-slideUp">
                <div class="bg-black border border-zinc-900 rounded-xl overflow-hidden h-full flex flex-col">
                    <div class="p-5 border-b border-zinc-900 bg-zinc-950 flex justify-between items-center">
                        <h3 class="font-black text-white uppercase italic flex items-center"><i data-lucide="list" class="mr-2 w-4 h-4 text-zinc-500"></i> Registro de Vendas</h3>
                        <span class="text-xs font-bold bg-zinc-900 text-yellow-400 px-2 py-1 rounded">${state.salesLog.length} Vendas</span>
                    </div>
                    <div class="overflow-x-auto flex-1">
                        <table class="w-full text-left">
                            <thead class="bg-zinc-950/50 text-zinc-500 text-[10px] font-black uppercase">
                                <tr><th class="p-4">Membro</th><th class="p-4">Itens</th><th class="p-4">Total</th><th class="p-4 text-purple-400">Facção</th><th class="p-4 text-right">Data</th></tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-900 text-sm">
                                ${state.salesLog.length === 0 ? `<tr><td colspan="5" class="p-8 text-center text-zinc-600 text-xs italic uppercase">Nenhuma venda registrada.</td></tr>` :
            state.salesLog.map(log => `
                                    <tr class="hover:bg-blue-900/10">
                                        <td class="p-4 font-bold text-white">${log.memberName} <span class="text-zinc-500 font-mono text-xs">| ${log.memberGameId}</span></td>
                                        <td class="p-4 text-zinc-400 max-w-[150px] truncate">${log.items}</td>
                                        <td class="p-4 font-mono text-zinc-300">R$ ${log.total.toLocaleString('pt-BR')}</td>
                                        <td class="p-4 font-mono text-purple-400 font-bold">+ R$ ${log.factionCut.toLocaleString('pt-BR')}</td>
                                        <td class="p-4 text-right text-xs text-zinc-500 font-mono">${log.date}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function toggleSaleItem(item) {
    if (state.sales.items.includes(item)) {
        state.sales.items = state.sales.items.filter(i => i !== item);
    } else {
        state.sales.items.push(item);
    }
    renderApp();
}

async function processSale() {
    const val = parseFloat(state.sales.value);
    const memberId = state.sales.memberId;

    if (!val || val <= 0) { alert("Insira um valor válido para a venda."); return; }
    if (state.sales.items.length === 0) { alert("Selecione pelo menos um item."); return; }
    if (!memberId) { alert("Selecione quem realizou a venda."); return; }

    const member = state.members.find(m => m.id === memberId);
    const factionCut = val * 0.40;
    const playerCut = val * 0.60;
    const itemsStr = state.sales.items.join(', ');

    if (member) {
        member.financial = (member.financial || 0) + factionCut;
        await updateMemberInFirestore(memberId, { financial: member.financial });
    }

    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    state.salesLog.unshift({ memberName: member?.name || 'Desconhecido', memberGameId: member?.gameId || '?', items: itemsStr, total: val, factionCut, playerCut, date: dateStr });
    addTransaction('in', factionCut, `Venda: ${itemsStr} (40%) - ${member?.name || ''}`);
    await saveFinancialData();

    state.sales = { value: '', items: [], memberId: null };
    alert(`Venda registrada! R$ ${factionCut.toLocaleString('pt-BR')} adicionados ao caixa.`);
    renderApp();
}

function renderInventory() {
    return `
        <div class="space-y-8">
            <div class="flex justify-between items-center animate-slideUp">
                <h2 class="text-3xl font-black text-white uppercase italic">Estoque <span class="text-yellow-400">DU7</span></h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                ${state.inventory.map((item, index) => {
        const percent = (item.qty / item.max) * 100;
        return `
                        <div class="bg-zinc-950 border border-zinc-900 rounded p-6 card-insane flex flex-col h-full animate-slideUp" style="animation-delay: ${index * 50}ms">
                            <div class="flex justify-between items-start mb-6">
                                <div class="p-4 bg-black rounded text-yellow-400 border border-zinc-800"><i data-lucide="${item.icon}" class="w-6 h-6"></i></div>
                                <div class="text-right">
                                    <p class="text-[10px] uppercase text-zinc-500 font-black">${item.category}</p>
                                    <p class="text-blue-500 text-xs font-mono font-bold">#${item.id.toString().padStart(3, '0')}</p>
                                </div>
                            </div>
                            <h3 class="text-xl font-black text-white mb-2 uppercase">${item.item}</h3>
                            <div class="flex items-end justify-between mb-3">
                                <span class="text-4xl font-mono text-blue-500 font-bold" id="qty-${item.id}">${item.qty}</span>
                                <span class="text-xs text-zinc-600 mb-1 font-bold">/ ${item.max}</span>
                            </div>
                            <div class="w-full h-2 bg-zinc-900 rounded-full overflow-hidden mb-6">
                                <div class="h-full bg-blue-600 transition-all" style="width: ${percent}%" id="bar-${item.id}"></div>
                            </div>
                            <div class="mt-auto pt-4 border-t border-zinc-900">
                                <div class="flex items-center gap-3">
                                    <input type="number" id="input-${item.id}" placeholder="QTD" class="w-full bg-black border border-zinc-800 rounded p-3 text-white text-center font-bold focus:border-yellow-400 outline-none text-sm font-mono">
                                    <div class="flex gap-2">
                                        <button onclick="updateStock(${item.id}, 'remove')" class="p-3 rounded bg-black text-red-500 border border-zinc-800 hover:border-red-500"><i data-lucide="minus" class="w-4 h-4"></i></button>
                                        <button onclick="updateStock(${item.id}, 'add')" class="p-3 rounded bg-black text-blue-500 border border-zinc-800 hover:border-blue-500"><i data-lucide="plus" class="w-4 h-4"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;
}

function updateStock(id, op) {
    const input = document.getElementById(`input-${id}`);
    const amount = parseInt(input.value);
    if (!amount || amount <= 0) return;

    const item = state.inventory.find(i => i.id === id);
    if (item) {
        if (op === 'add') item.qty += amount;
        if (op === 'remove') item.qty = Math.max(0, item.qty - amount);

        document.getElementById(`qty-${id}`).innerText = item.qty;
        const percent = (item.qty / item.max) * 100;
        document.getElementById(`bar-${id}`).style.width = `${percent}%`;
        input.value = '';
    }
}

function renderFinancial() {
    return `
        <div class="space-y-6 animate-slideUp">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-black border border-zinc-900 rounded-xl p-6 border-l-4 border-l-blue-600">
                    <p class="text-zinc-400 text-sm font-bold uppercase mb-2">Saldo em Caixa</p>
                    <h2 class="text-5xl font-black text-white font-mono">R$ ${state.money.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                </div>
                <div class="flex flex-col gap-3 justify-center">
                    <button onclick="openFinancialModal('in')" class="flex-1 bg-blue-900/20 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 font-bold py-4 px-6 rounded-xl flex items-center justify-center">
                        <i data-lucide="arrow-up-circle" class="mr-3 w-6 h-6"></i> DEPOSITAR
                    </button>
                    <button onclick="openFinancialModal('out')" class="flex-1 bg-red-900/20 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-bold py-4 px-6 rounded-xl flex items-center justify-center">
                        <i data-lucide="arrow-down-circle" class="mr-3 w-6 h-6"></i> SACAR
                    </button>
                </div>
            </div>
            <div class="bg-black border border-zinc-900 rounded-xl overflow-hidden">
                <div class="p-4 border-b border-zinc-900 bg-zinc-900/30 flex justify-between items-center">
                    <h3 class="font-bold text-white flex items-center"><i data-lucide="history" class="mr-2 text-zinc-500 w-4 h-4"></i> Histórico de Transações</h3>
                    <span class="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded">${state.transactions.length} Registros</span>
                </div>
                <div class="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin">
                    <table class="w-full text-left">
                        <thead class="sticky top-0 bg-black z-10">
                            <tr class="border-b border-zinc-800 text-zinc-500 text-xs uppercase">
                                <th class="p-4 font-bold">Tipo</th><th class="p-4 font-bold">Descrição</th><th class="p-4 font-bold">Data</th><th class="p-4 font-bold text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-zinc-900">
                            ${state.transactions.length === 0 ? `<tr><td colspan="4" class="p-8 text-center text-zinc-500 text-sm italic">Nenhuma transação registrada.</td></tr>` :
            state.transactions.map(t => `
                                <tr class="hover:bg-zinc-900/30">
                                    <td class="p-4">${t.type === 'in' ? '<span class="px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">ENTRADA</span>' : '<span class="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">SAÍDA</span>'}</td>
                                    <td class="p-4 text-white font-medium">${t.desc}</td>
                                    <td class="p-4 text-zinc-500 text-sm font-mono">${t.date}</td>
                                    <td class="p-4 text-right font-mono font-bold ${t.type === 'in' ? 'text-yellow-400' : 'text-red-400'}">${t.type === 'in' ? '+' : '-'} R$ ${t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function addTransaction(type, amount, desc) {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    state.transactions.unshift({ type, amount, desc, date: dateStr });
    if (type === 'in') state.money += amount;
    else state.money -= amount;
}

let currentFinType = 'in';

function openFinancialModal(type) {
    currentFinType = type;
    const isDeposit = type === 'in';
    const modal = document.createElement('div');
    modal.id = 'financialModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-black border-2 border-zinc-900 w-full max-w-md rounded-lg animate-scaleIn overflow-hidden">
            <div class="flex justify-between items-center p-5 border-b border-zinc-900">
                <h3 class="text-xl font-black text-white uppercase italic flex items-center">
                    <span class="w-2 h-6 ${isDeposit ? 'bg-blue-600' : 'bg-red-500'} mr-3 rounded-full"></span>
                    ${isDeposit ? 'Depositar Dinheiro' : 'Sacar Dinheiro'}
                </h3>
                <button onclick="closeFinancialModal()" class="text-zinc-500 hover:text-red-500"><i data-lucide="x"></i></button>
            </div>
            <div class="p-6">
                <form onsubmit="submitFinTransaction(event)" class="space-y-5">
                    <div>
                        <label class="block text-xs text-blue-400 uppercase font-bold mb-2">Valor (R$)</label>
                        <input id="finAmount" type="number" required class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white text-xl font-black focus:border-yellow-400 outline-none font-mono" placeholder="0.00">
                    </div>
                    <div>
                        <label class="block text-xs text-blue-400 uppercase font-bold mb-2">Descrição</label>
                        <input id="finDesc" required class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white focus:border-yellow-400 outline-none" placeholder="Ex: Pagamento">
                    </div>
                    <button type="submit" class="w-full ${isDeposit ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'} text-white font-bold py-3 rounded active:scale-95">${isDeposit ? 'Confirmar Depósito' : 'Confirmar Saque'}</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    lucide.createIcons();
}

function closeFinancialModal() {
    const modal = document.getElementById('financialModal');
    if (modal) modal.remove();
}

async function submitFinTransaction(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('finAmount').value);
    const desc = document.getElementById('finDesc').value;
    if (!amount || amount <= 0) return;

    if (currentFinType === 'out' && amount > state.money) {
        alert("Saldo insuficiente!");
        return;
    }

    addTransaction(currentFinType, amount, desc);
    await saveFinancialData();
    closeFinancialModal();
    renderApp();
}
