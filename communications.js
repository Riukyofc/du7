// Sistema de Comunicação
function renderCommunications() {
    const currentUserEmail = state.currentUser?.email || '';
    const isAdmin = currentUserEmail === 'alexcastrocutrim@gmail.com';

    const communications = (state.communications || []).filter(c => !c.archived);
    const userId = state.currentUser?.uid || '';

    return `<div class="space-y-8">
        <div class="flex justify-between items-center animate-slideUp">
            <div>
                <h2 class="text-3xl font-black text-white uppercase italic">Central de <span class="text-purple-500">Comunicação</span></h2>
                <p class="text-zinc-500 text-xs uppercase tracking-widest mt-1 font-bold">Avisos e Comunic ados Internos</p>
            </div>
            ${isAdmin ? `
                <button onclick="openCreateCommModal()" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2">
                    <i data-lucide="megaphone" class="w-4 h-4"></i>Novo Comunicado
                </button>
            ` : ''}
        </div>

        <!-- Lista de Comunicados -->
        <div class="space-y-4 animate-slideUp">
            ${communications.length === 0 ? `
                <div class="bg-black border border-zinc-900 rounded-xl p-12 text-center">
                    <i data-lucide="inbox" class="w-16 h-16 mx-auto mb-4 text-zinc-700"></i>
                    <p class="text-zinc-500 text-lg font-bold">Nenhum comunicado ainda</p>
                    <p class="text-zinc-600 text-sm mt-2">Os comunicados importantes aparecerão aqui.</p>
                </div>
            ` : communications.map(comm => {
        const isRead = comm.readBy?.includes(userId);
        const priorityColors = {
            important: 'border-red-500 bg-red-900/10',
            normal: 'border-purple-500 bg-purple-900/10',
            info: 'border-blue-500 bg-blue-900/10'
        };
        const priorityIcons = {
            important: 'alert-triangle',
            normal: 'info',
            info: 'lightbulb'
        };

        return `
                    <div class="bg-black border-2 rounded-xl p-6 ${priorityColors[comm.priority] || priorityColors.normal} relative">
                        ${!isRead ? `
                            <div class="absolute top-4 right-4">
                                <span class="bg-purple-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase">NÃO LIDO</span>
                            </div>
                        ` : ''}
                        
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-lg flex items-center justify-center ${comm.priority === 'important' ? 'bg-red-900/30' : comm.priority === 'info' ? 'bg-blue-900/30' : 'bg-purple-900/30'}">
                                <i data-lucide="${priorityIcons[comm.priority]}" class="w-6 h-6 ${comm.priority === 'important' ? 'text-red-400' : comm.priority === 'info' ? 'text-blue-400' : 'text-purple-400'}"></i>
                            </div>
                            
                            <div class="flex-1">
                                <div class="flex items-start justify-between mb-2">
                                    <h3 class="text-xl font-black text-white uppercase italic">${comm.title}</h3>
                                    ${isAdmin ? `
                                        <div class="flex gap-2">
                                            <button onclick="archiveCommunication('${comm.id}')" class="text-zinc-500 hover:text-zinc-300" title="Arquivar">
                                                <i data-lucide="archive" class="w-4 h-4"></i>
                                            </button>
                                            <button onclick="deleteCommunication('${comm.id}')" class="text-red-500 hover:text-red-300" title="Deletar">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>
                                
                                <p class="text-zinc-300 mb-3">${comm.message}</p>
                                
                                <div class="flex items-center justify-between">
                                    <div class="text-xs text-zinc-500">
                                        <span class="font-bold">${comm.author}</span> • ${new Date(comm.createdAt).toLocaleDateString('pt-BR')}
                                    </div>
                                    ${!isRead ? `
                                        <button onclick="markAsRead('${comm.id}')" class="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase">
                                            Marcar como Lido
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    </div>`;
}

// Modal criar comunicado
function openCreateCommModal() {
    const modal = document.createElement('div');
    modal.id = 'createCommModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-black border-2 border-zinc-900 w-full max-w-2xl rounded-lg animate-scaleIn overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)]">
            <div class="flex justify-between items-center p-5 border-b border-zinc-900 bg-zinc-950">
                <h3 class="text-xl font-black text-white uppercase italic flex items-center">
                    <i data-lucide="megaphone" class="mr-2 text-purple-400"></i> Novo Comunicado
                </h3>
                <button onclick="document.getElementById('createCommModal').remove()" class="text-zinc-500 hover:text-red-500 transition-colors">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="p-6 space-y-5">
                <div>
                    <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Título</label>
                    <input id="commTitle" type="text" placeholder="Ex: Reunião Importante Hoje" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none">
                </div>
                <div>
                    <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Mensagem</label>
                    <textarea id="commMessage" rows="5" placeholder="Escreva a mensagem..." class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white focus:border-purple-400 outline-none resize-none"></textarea>
                </div>
                <div>
                    <label class="block text-xs text-purple-400 uppercase font-bold mb-2 tracking-widest">Prioridade</label>
                    <select id="commPriority" class="w-full bg-zinc-950 border border-zinc-800 rounded p-4 text-white font-bold focus:border-purple-400 outline-none">
                        <option value="info">Informação</option>
                        <option value="normal">Normal</option>
                        <option value="important">Importante</option>
                    </select>
                </div>
                <button onclick="saveNewCommunication()" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95">
                    PUBLICAR COMUNICADO
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    lucide.createIcons();
}

// Salvar comunicado
async function saveNewCommunication() {
    const title = document.getElementById('commTitle').value.trim();
    const message = document.getElementById('commMessage').value.trim();
    const priority = document.getElementById('commPriority').value;

    if (!title || !message) {
        alert('Preencha título e mensagem!');
        return;
    }

    const newComm = {
        id: 'comm_' + Date.now(),
        title,
        message,
        priority,
        author: state.currentUser.displayName || 'Admin',
        authorId: state.currentUser.uid,
        createdAt: new Date().toISOString(),
        readBy: [],
        archived: false
    };

    if (!state.communications) state.communications = [];
    state.communications.unshift(newComm);

    logAction('Comunicado Criado', `"${title}" - Prioridade: ${priority}`, state.currentUser.displayName);

    await saveFinancialData();
    document.getElementById('createCommModal').remove();
    alert('✅ Comunicado publicado!');
    renderApp();
}

// Marcar como lido
async function markAsRead(commId) {
    const comm = state.communications.find(c => c.id === commId);
    const userId = state.currentUser.uid;

    if (!comm.readBy) comm.readBy = [];
    if (!comm.readBy.includes(userId)) {
        comm.readBy.push(userId);
    }

    await saveFinancialData();
    renderApp();
}

// Arquivar comunicado
async function archiveCommunication(commId) {
    const comm = state.communications.find(c => c.id === commId);
    comm.archived = true;

    logAction('Comunicado Arquivado', `"${comm.title}"`, state.currentUser.displayName);

    await saveFinancialData();
    alert('✅ Comunicado arquivado!');
    renderApp();
}

// Deletar comunicado
async function deleteCommunication(commId) {
    const comm = state.communications.find(c => c.id === commId);

    if (!confirm(`Deletar comunicado "${comm.title}"?`)) return;

    state.communications = state.communications.filter(c => c.id !== commId);

    logAction('Comunicado Deletado', `"${comm.title}"`, state.currentUser.displayName);

    await saveFinancialData();
    alert('✅ Comunicado deletado!');
    renderApp();
}
