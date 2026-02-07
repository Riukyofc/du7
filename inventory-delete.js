// Função para deletar item do estoque
async function deleteInventoryItem(id) {
    const item = state.inventory.find(i => i.id === id);
    if (!item) return;

    if (confirm(`⚠ TEM CERTEZA que deseja REMOVER "${item.item}" do estoque?\n\nEsta ação não pode ser desfeita!`)) {
        // Registrar no log de auditoria
        logAction(
            'Item de Estoque Removido',
            `"${item.item}" (${item.category}) deletado do estoque`,
            null
        );

        // Remover do array
        state.inventory = state.inventory.filter(i => i.id !== id);

        await saveFinancialData();
        alert(`✅ "${item.item}" foi removido do estoque!`);
        renderApp();
    }
}
