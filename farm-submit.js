// REFORMULAÇÃO COMPLETA: submitRoute
async function submitRoute() {
    const memberId = state.routeForm.memberId;
    const material = state.routeForm.material;
    const quantity = parseInt(state.routeForm.quantity);

    // Validações
    if (!memberId) {
        alert("❌ Selecione um membro!");
        return;
    }
    if (!quantity || quantity <= 0) {
        alert("❌ Insira uma quantidade válida!");
        return;
    }

    // Buscar membro
    const member = state.members.find(m => m.id === memberId);
    if (!member) {
        alert("❌ Membro não encontrado!");
        return;
    }

    // Atualizar contagem de farms do membro
    member.routes = (member.routes || 0) + 1;
    await updateMemberInFirestore(memberId, { routes: member.routes });

    // Criar timestamp
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    // ESTRUTURA LIMPA E COMPLETA
    const farmEntry = {
        memberId: memberId,
        memberName: member.name,
        memberGameId: member.gameId,
        material: material,
        quantity: quantity,  // SEMPRE quantity, não qty
        timestamp: now.toISOString(),
        date: dateStr
    };

    // Adicionar ao log
    state.routesLog.unshift(farmEntry);

    // Salvar no Firebase
    await saveFinancialData();

    // Registrar no audit log
    logAction(
        'Farm Registrado',
        `${member.name} farmou ${quantity}x ${material}`,
        member.name
    );

    // Resetar formulário COMPLETAMENTE
    state.routeForm = {
        memberId: '',
        material: 'Metal',
        quantity: ''
    };

    alert(`✅ Farm registrado!\n${member.name}: ${quantity}x ${material}`);
    renderApp();
}
