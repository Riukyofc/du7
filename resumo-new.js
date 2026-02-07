// REFORMULAÇÃO COMPLETA: renderResumo
function renderResumo() {
    // Processar dados por membro
    const memberData = {};

    // Inicializar estrutura para cada membro
    state.members.forEach(member => {
        memberData[member.id] = {
            name: member.name,
            gameId: member.gameId,
            role: member.role || 'Membro',
            materials: {},
            actionsCount: member.actions || 0,
            farmCount: member.routes || 0
        };
    });

    // Agregar materiais de FARM (routesLog)
    state.routesLog.forEach(entry => {
        // Validar estrutura
        if (!entry.memberId || !entry.material || !entry.quantity) {
            console.warn('⚠️ Farm entry inválido:', entry);
            return;
        }

        const memberId = entry.memberId;
        const material = entry.material;
        const quantity = parseInt(entry.quantity); // Garantir número

        if (isNaN(quantity)) {
            console.warn('⚠️ Quantidade inválida:', entry);
            return;
        }

        if (memberData[memberId]) {
            if (!memberData[memberId].materials[material]) {
                memberData[memberId].materials[material] = 0;
            }
            memberData[memberId].materials[material] += quantity;
        }
    });

    // Converter para array e ordenar por total
    const memberArray = Object.values(memberData).sort((a, b) => {
        const totalA = Object.values(a.materials).reduce((sum, val) => sum + val, 0);
        const totalB = Object.values(b.materials).reduce((sum, val) => sum + val, 0);
        return totalB - totalA;
    });

    return `<div class="space-y-8">
        <div class="flex justify-between items-center animate-slideUp">
            <div>
                <h2 class="text-3xl font-black text-white uppercase italic">Resumo <span class="text-purple-500">Geral</span></h2>
                <p class="text-zinc-500 text-xs uppercase tracking-widest mt-1 font-bold">Visão Consolidada dos Membros</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            ${memberArray.map((member, index) => {
        const totalMaterials = Object.values(member.materials).reduce((sum, val) => sum + val, 0);
        const hasMaterials = totalMaterials > 0;

        return `<div class="bg-black border border-zinc-900 rounded-xl overflow-hidden animate-slideUp" style="animation-delay: ${index * 50}ms">
                    <div class="p-5 border-b border-zinc-900 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="text-xl font-black text-white uppercase">
                                    ${member.name}
                                    <span class="text-zinc-500 font-mono text-sm ml-2">| ID: ${member.gameId}</span>
                                </h3>
                                <p class="text-xs text-purple-400 uppercase font-bold mt-1">${member.role}</p>
                            </div>
                            ${hasMaterials ? `<div class="bg-purple-600 text-white text-xs font-black px-3 py-1 rounded-full">
                                ${totalMaterials.toLocaleString('pt-BR')} Total
                            </div>` : ''}
                        </div>
                    </div>

                    <div class="grid grid-cols-3 divide-x divide-zinc-900 bg-zinc-950/50">
                        <div class="p-3 text-center">
                            <p class="text-[10px] text-zinc-500 uppercase font-bold mb-1">Ações</p>
                            <p class="text-lg font-mono text-white font-bold">${member.actionsCount}</p>
                        </div>
                        <div class="p-3 text-center">
                            <p class="text-[10px] text-zinc-500 uppercase font-bold mb-1">Farms</p>
                            <p class="text-lg font-mono text-white font-bold">${member.farmCount}</p>
                        </div>
                        <div class="p-3 text-center">
                            <p class="text-[10px] text-zinc-500 uppercase font-bold mb-1">Farm Total</p>
                            <p class="text-lg font-mono text-purple-400 font-bold">${totalMaterials.toLocaleString('pt-BR')}</p>
                        </div>
                    </div>

                    ${hasMaterials ? `<div class="p-5">
                        <h4 class="text-xs text-zinc-500 uppercase font-black mb-3 flex items-center">
                            <i data-lucide="sprout" class="w-3 h-3 mr-2"></i>
                            Farm
                        </h4>
                        <div class="grid grid-cols-2 gap-2">
                            ${Object.entries(member.materials)
                    .sort((a, b) => b[1] - a[1])
                    .map(([material, quantity]) => `
                                <div class="bg-zinc-950 border border-zinc-900 rounded p-3 flex justify-between items-center">
                                    <span class="text-zinc-400 text-sm font-bold">${material}</span>
                                    <span class="text-purple-400 font-mono font-black">${quantity.toLocaleString('pt-BR')}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>` : `<div class="p-5 text-center text-zinc-600 text-xs italic">
                        Nenhum material coletado ainda
                    </div>`}
                </div>`;
    }).join('')}
        </div>
    </div>`;
}
