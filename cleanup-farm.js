// FUNÇÃO EMERGENCIAL: Limpar dados corrompidos de Farm
async function cleanupFarmData() {
    if (!confirm('⚠️ ATENÇÃO!\n\nIsso vai LIMPAR TODOS os dados de Farm corrompidos.\n\nDeseja continuar?')) {
        return;
    }

    // Limpar routesLog
    state.routesLog = [];

    // Resetar contagem de routes de cada membro
    for (const member of state.members) {
        member.routes = 0;
        await updateMemberInFirestore(member.id, { routes: 0 });
    }

    await saveFinancialData();
    alert('✅ Dados de Farm limpos! Agora você pode registrar normalmente.');
    renderApp();
}

// Adicionar botão de limpeza (só para admin)
function addCleanupButton() {
    const currentUserEmail = state.currentUser?.email || '';
    const isSuperAdmin = currentUserEmail === 'alexcastrocutrim@gmail.com';

    if (isSuperAdmin && state.activeTab === 'farm') {
        setTimeout(() => {
            const header = document.querySelector('#appContent h2');
            if (header && !document.getElementById('cleanupBtn')) {
                const btn = document.createElement('button');
                btn.id = 'cleanupBtn';
                btn.className = 'bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-bold uppercase ml-4';
                btn.textContent = '🧹 Limpar Dados Corrompidos';
                btn.onclick = cleanupFarmData;
                header.appendChild(btn);
            }
        }, 100);
    }
}

// Hook para adicionar botão quando renderizar
const originalRenderApp = renderApp;
renderApp = function () {
    originalRenderApp();
    addCleanupButton();
};
