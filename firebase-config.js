import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCERKownSh35zadwoGQR55HsNweLXMwMHQ",
  authDomain: "belta-games.firebaseapp.com",
  projectId: "belta-games",
  storageBucket: "belta-games.appspot.com",
  messagingSenderId: "77950108717",
  appId: "1:77950108717:web:201d41190f7c0bde5fe4a4",
  measurementId: "G-5E5K3WM1VK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

// Fazer login com Google
window.loginGoogle = async () => {
  try {
    const resultado = await signInWithPopup(auth, provider);
    return resultado.user;
  } catch (error) {
    console.error("Erro no login:", error);
    return null;
  }
};

// Fazer logout
window.logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro no logout:", error);
  }
};

// Observar mudanças no estado de autenticação
window.observarUsuario = (callback) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Verifica se tem perfil
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        // Corrige nickname duplicado se necessário
        const perfilCorrigido = await corrigirNicknameDuplicado(user.uid, userSnap.data());
        callback({
          autenticado: true,
          user,
          perfil: perfilCorrigido,
          isNovoUsuario: false
        });
      } else {
        callback({ 
          autenticado: true, 
          user, 
          perfil: null,
          isNovoUsuario: true 
        });
      }
    } else {
      callback({ 
        autenticado: false, 
        user: null, 
        perfil: null,
        isNovoUsuario: false 
      });
    }
  });
};

// ===== FUNÇÕES DE PERFIL =====

// Verifica se um nickname já está em uso (por outro usuário)
async function nicknameEmUso(nickname, uidAtual) {
  const q = query(
    collection(db, "usuarios"),
    where("nickname", "==", nickname.trim())
  );
  const snap = await getDocs(q);
  return snap.docs.some(d => d.id !== uidAtual);
}

// Expõe para o index.html poder verificar em tempo real
window.verificarNickname = async (nickname) => {
  const user = auth.currentUser;
  if (!user) return false;
  return await nicknameEmUso(nickname, user.uid);
};

// Salvar novo nickname (primeiro acesso) — rejeita duplicatas
window.salvarNovoNickname = async (nickname) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Erro: usuário não está logado!");
      return null;
    }

    const nick = nickname.trim();
    if (await nicknameEmUso(nick, user.uid)) {
      alert("❌ Esse nickname já está em uso! Escolha outro.");
      return null;
    }

    const dados = {
      uid: user.uid,
      nickname: nick,
      nomeReal: user.displayName,
      email: user.email,
      foto: user.photoURL,
      criadoEm: new Date().toISOString(),
      ultimoAcesso: new Date().toISOString()
    };

    await setDoc(doc(db, "usuarios", user.uid), dados);
    console.log("✅ Nickname salvo para:", user.email);
    return dados;
  } catch (error) {
    console.error("❌ Erro ao salvar nickname:", error);
    alert("Erro ao salvar nickname. Tente novamente.");
    return null;
  }
};

// Corrige nicknames duplicados existentes (roda no login)
async function corrigirNicknameDuplicado(uid, perfilAtual) {
  const nick = perfilAtual.nickname;
  const q = query(
    collection(db, "usuarios"),
    where("nickname", "==", nick)
  );
  const snap = await getDocs(q);

  // Se só existe um, está tudo certo
  if (snap.docs.length <= 1) return perfilAtual;

  // Ordena por data de criação — o mais antigo mantém o nome original
  const ordenados = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.criadoEm || '').localeCompare(b.criadoEm || ''));

  // Se este usuário é o mais antigo, não precisa mudar
  if (ordenados[0].id === uid) return perfilAtual;

  // Encontra um sufixo disponível
  let sufixo = 2;
  let novoNick = `${nick}${sufixo}`;
  while (await nicknameEmUso(novoNick, uid)) {
    sufixo++;
    novoNick = `${nick}${sufixo}`;
  }

  // Atualiza no Firestore
  const dadosAtualizados = { ...perfilAtual, nickname: novoNick };
  await setDoc(doc(db, "usuarios", uid), dadosAtualizados);
  console.log(`⚠️ Nickname duplicado corrigido: "${nick}" → "${novoNick}"`);
  return dadosAtualizados;
};

// Alterar nickname (com verificação de unicidade)
window.alterarNickname = async (novoNickname) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Erro: usuário não está logado!");
      return null;
    }

    const nick = novoNickname.trim();
    if (nick.length < 3) {
      alert("❌ O nickname precisa ter pelo menos 3 letras!");
      return null;
    }

    if (await nicknameEmUso(nick, user.uid)) {
      alert("❌ Esse nickname já está em uso! Escolha outro.");
      return null;
    }

    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;

    const dadosAtualizados = { ...userSnap.data(), nickname: nick };
    await setDoc(userRef, dadosAtualizados);
    console.log(`✅ Nickname alterado para: ${nick}`);
    return dadosAtualizados;
  } catch (error) {
    console.error("❌ Erro ao alterar nickname:", error);
    alert("Erro ao alterar nickname. Tente novamente.");
    return null;
  }
};

// Sinaliza que o módulo Firebase está pronto
window.firebaseReady = true;

// Função auxiliar para aguardar o Firebase carregar
window.aguardarFirebase = () => {
  return new Promise((resolve) => {
    if (window.firebaseReady) return resolve();
    const check = setInterval(() => {
      if (window.firebaseReady) { clearInterval(check); resolve(); }
    }, 100);
  });
};

// ===== FUNÇÕES DE RANKING =====

// Salvar pontuação do jogo
window.salvarPontos = async (nomeJogo, pontos) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn("⚠️ Usuário não logado. Pontos não salvos.");
      return false;
    }

    // Busca o nickname do usuário
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    const nickname = userSnap.exists() ? userSnap.data().nickname : user.displayName;

    // Salva a pontuação
    await addDoc(collection(db, "rankings"), {
      uid: user.uid,
      nickname: nickname,
      foto: user.photoURL,
      jogo: nomeJogo,
      pontos: pontos,
      data: new Date().toISOString()
    });
    
    console.log(`✅ Pontos salvos: ${nickname} - ${nomeJogo} - ${pontos}`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao salvar pontos:", error);
    return false;
  }
};

// Obter Top 10 de um jogo
window.obterRanking = async (nomeJogo) => {
    console.log(`🔍 Buscando ranking para: "${nomeJogo}"`);
    
    try {
        // TENTATIVA 1: Query otimizada com índice (se existir)
        const q = query(
            collection(db, "rankings"),
            where("jogo", "==", nomeJogo),
            orderBy("pontos", "desc"),
            limit(10)
        );
        
        const snap = await getDocs(q);
        console.log(`✅ Query otimizada: ${snap.docs.length} resultados`);
        
        // Se funcionou, retorna
        if (snap.docs.length > 0) {
            return snap.docs.map((doc, index) => ({
                posicao: index + 1,
                id: doc.id,
                ...doc.data()
            }));
        }
        
        // TENTATIVA 2: Busca geral e filtro local
        console.log("🔄 Nenhum resultado, tentando busca geral...");
        const allQuery = query(
            collection(db, "rankings"),
            orderBy("pontos", "desc")
        );
        
        const allSnap = await getDocs(allQuery);
        const allData = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filtra pelo jogo
        const filtered = allData
            .filter(item => item.jogo === nomeJogo)
            .slice(0, 10)
            .map((item, index) => ({
                posicao: index + 1,
                ...item
            }));
        
        console.log(`✅ Busca geral + filtro: ${filtered.length} resultados`);
        return filtered;
        
    } catch (error) {
        console.error(`❌ ERRO:`, error);
        
        // Se for erro de índice, usa fallback
        if (error.code === 'failed-precondition') {
            console.log("⚠️ Índice não encontrado, usando fallback...");
            return await obterRankingFallback(nomeJogo);
        }
        
        return [];
    }
};

// Função fallback que não precisa de índice
async function obterRankingFallback(nomeJogo) {
    try {
        // Busca TUDO
        const allQuery = collection(db, "rankings");
        const allSnap = await getDocs(allQuery);
        
        const allData = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filtra e ordena localmente
        const filtered = allData
            .filter(item => item.jogo === nomeJogo)
            .sort((a, b) => b.pontos - a.pontos)
            .slice(0, 10)
            .map((item, index) => ({
                posicao: index + 1,
                ...item
            }));
        
        console.log(`✅ Fallback para "${nomeJogo}": ${filtered.length} resultados`);
        return filtered;
        
    } catch (error) {
        console.error("❌ Erro no fallback:", error);
        return [];
    }
};
