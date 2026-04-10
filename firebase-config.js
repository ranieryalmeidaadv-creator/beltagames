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
    const user = resultado.user;
    console.log("Usuário logado:", user.displayName);
    
    // Verifica se é primeiro acesso
    const perfil = await verificarOuCriarPerfil(user);
    if (!perfil) {
      console.log("Novo usuário - solicitar nickname");
      return { isNovoUsuario: true, user };
    }
    return { isNovoUsuario: false, user, perfil };
  } catch (error) {
    console.error("Erro no login:", error.message);
    throw error;
  }
};

// Fazer logout
window.logout = async () => {
  try {
    await signOut(auth);
    console.log("Desconectado com sucesso");
  } catch (error) {
    console.error("Erro ao desconectar:", error.message);
    throw error;
  }
};

// Observar mudanças no estado de autenticação
window.observarUsuario = (callback) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const perfil = await verificarOuCriarPerfil(user);
      callback({ autenticado: true, user, perfil });
    } else {
      callback({ autenticado: false, user: null, perfil: null });
    }
  });
};

// ===== FUNÇÕES DE PERFIL =====

// Verifica se o usuário já tem perfil cadastrado
const verificarOuCriarPerfil = async (user) => {
  try {
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null; // Usuário novo
  } catch (error) {
    console.error("Erro ao verificar perfil:", error.message);
    return null;
  }
};

// Salvar novo nickname (primeiro acesso)
window.salvarNovoNickname = async (nickname) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");
    if (!nickname || nickname.trim().length === 0) throw new Error("Nickname inválido");
    
    const dados = {
      uid: user.uid,
      nickname: nickname.trim(),
      nomeReal: user.displayName,
      foto: user.photoURL,
      criadoEm: new Date().toISOString()
    };
    
    await setDoc(doc(db, "usuarios", user.uid), dados);
    console.log("Nickname salvo:", nickname);
    return dados;
  } catch (error) {
    console.error("Erro ao salvar nickname:", error.message);
    throw error;
  }
};

// ===== FUNÇÕES DE RANKING E PONTOS =====

// Salvar pontuação do jogo
window.salvarPontos = async (nomeJogo, pontos) => {
  try {
    // Validações
    if (!nomeJogo || typeof nomeJogo !== 'string') throw new Error("Nome do jogo inválido");
    if (typeof pontos !== 'number' || pontos < 0) throw new Error("Pontuação deve ser um número positivo");
    
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");
    
    // Busca o nickname do usuário
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    const nickname = userSnap.exists() ? userSnap.data().nickname : user.displayName || "Anônimo";

    // Salva a pontuação
    await addDoc(collection(db, "rankings"), {
      uid: user.uid,
      nickname: nickname,
      foto: user.photoURL,
      jogo: nomeJogo.trim(),
      pontos: Math.floor(pontos),
      data: new Date().toISOString()
    });
    
    console.log(`Pontos salvos: ${nomeJogo} - ${pontos}`);
    return { sucesso: true, mensagem: "Pontuação salva!" };
  } catch (error) {
    console.error("Erro ao salvar pontos:", error.message);
    throw error;
  }
};

// Obter Top 10 de um jogo
window.obterRanking = async (nomeJogo) => {
  try {
    if (!nomeJogo || typeof nomeJogo !== 'string') throw new Error("Nome do jogo inválido");
    
    const q = query(
      collection(db, "rankings"),
      where("jogo", "==", nomeJogo.trim()),
      orderBy("pontos", "desc"),
      limit(10)
    );
    
    const snap = await getDocs(q);
    const ranking = snap.docs.map((doc, index) => ({
      posicao: index + 1,
      ...doc.data()
    }));
    
    console.log("Ranking obtido:", ranking);
    return ranking;
  } catch (error) {
    console.error("Erro ao obter ranking:", error.message);
    throw error;
  }
};
