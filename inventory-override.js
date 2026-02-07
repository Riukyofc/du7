// Override renderInventory para adicionar botão de delete
function renderInventory() {
    const hasSpecialPerms = hasSpecialPermissions();
    return `<div class="space-y-8">
        <div class="flex justify-between items-center animate-slideUp"><h2 class="text-3xl font-black text-white uppercase italic">Estoque <span class="text-purple-500">4K</span></h2>${hasSpecialPerms ? '<span class="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg animate-pulse">⭐ ACESSO ESPECIAL</span>' : ''}</div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            ${state.inventory.map((item, index) => {
        const percent = (item.qty / item.max) * 100;
        const isLow = percent < 20;
        return `<div class="bg-zinc-950 border ${isLow ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-zinc-900'} rounded p-6 card-insane flex flex-col h-full animate-slideUp relative" style="animation-delay: ${index * 50}ms">
            ${isLow ? '<div class="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded font-black uppercase animate-pulse">⚠ BAIXO</div>' : ''}
            <button onclick="deleteInventoryItem(${item.id})" class="absolute top-2 left-2 p-2 bg-red-900/30 border border-red-500/30 rounded hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-all" title="Remover item">
                <i data-lucide="trash-2" class="w-3 h-3"></i>
            </button>
            <div class="flex justify-between items-start mb-6 mt-6"><div class="p-4 bg-black rounded ${isLow ? 'text-red-400' : 'text-purple-400'} border border-zinc-800"><i data-lucide="${item.icon}" class="w-6 h-6"></i></div><div class="text-right"><p class="text-[10px] uppercase text-zinc-500 font-black">${item.category}</p><p class="text-purple-500 text-xs font-mono font-bold">#${item.id.toString().padStart(3, '0')}</p></div></div>
            <h3 class="text-xl font-black text-white mb-2 uppercase">${item.item}</h3>
            <div class="flex items-end justify-between mb-3"><span class="text-4xl font-mono ${isLow ? 'text-red-400' : 'text-purple-500'} font-bold" id="qty-${item.id}">${item.qty}</span><span class="text-xs text-zinc-600 mb-1 font-bold">/ ${item.max}</span></div>
            <div class="w-full h-2 bg-zinc-900 rounded-full overflow-hidden mb-6"><div class="h-full ${isLow ? 'bg-red-600' : 'bg-purple-600'} transition-all" style="width: ${percent}%" id="bar-${item.id}"></div></div>
            <div class="mt-auto pt-4 border-t border-zinc-900"><div class="flex items-center gap-3"><input type="number" id="input-${item.id}" placeholder="QTD" class="w-full bg-black border border-zinc-800 rounded p-3 text-white text-center font-bold focus:border-purple-400 outline-none text-sm font-mono"><div class="flex gap-2"><button onclick="updateStock(${item.id}, 'remove')" class="p-3 rounded bg-black text-red-500 border border-zinc-800 hover:border-red-500"><i data-lucide="minus" class="w-4 h-4"></i></button><button onclick="updateStock(${item.id}, 'add')" class="p-3 rounded bg-black text-purple-500 border border-zinc-800 hover:border-purple-500"><i data-lucide="plus" class="w-4 h-4"></i></button></div></div></div>
        </div>`;
    }).join('')}
            <div class="bg-black border-2 border-dashed border-zinc-800 hover:border-purple-600 rounded p-6 flex flex-col h-full items-center justify-center cursor-pointer transition-all group animate-slideUp hover:bg-zinc-950" onclick="openAddInventoryModal()"><div class="w-20 h-20 rounded-full border-2 border-zinc-800 group-hover:border-purple-500 flex items-center justify-center mb-6 transition-all bg-zinc-900 group-hover:bg-purple-900/20"><i data-lucide="plus" class="w-10 h-10 text-zinc-600 group-hover:text-purple-400 transition-all"></i></div><h3 class="text-xl font-black text-zinc-600 group-hover:text-white uppercase italic tracking-widest transition-all">Novo Item</h3><p class="text-xs text-zinc-700 group-hover:text-purple-500 mt-2 font-bold uppercase transition-all">Adicionar ao Estoque</p></div>
        </div>
        ${hasSpecialPerms ? renderInventoryLog() : ''}
    </div>`;
}
