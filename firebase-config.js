window.salvarPontos = async (nomeJogo, pontos) => {
  try {
    // Aguarda um instante para garantir que o Auth carregou
    const user = auth.currentUser;
    
    if (!user) {
      console.error("DEBUG: Usuário não encontrado. Tentando recuperar...");
      // Força uma pequena espera se o user for null
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!auth.currentUser) return false;
    }

    const currentUser = auth.currentUser;
    const userRef = doc(db, "usuarios", currentUser.uid);
    const userSnap = await getDoc(userRef);
    const nickname = userSnap.exists() ? userSnap.data().nickname : currentUser.displayName;

    await addDoc(collection(db, "rankings"), {
      uid: currentUser.uid,
      nickname: nickname,
      foto: currentUser.photoURL,
      jogo: nomeJogo,
      pontos: pontos,
      data: new Date().toISOString()
    });
    
    console.log("✅ Sucesso no salvamento!");
    return true;
  } catch (error) {
    console.error("❌ Erro detalhado:", error.code, error.message);
    return false;
  }
};
