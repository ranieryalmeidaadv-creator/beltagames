import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check.js";

// Configuração do seu projeto (MANTIDA)
const firebaseConfig = {
  apiKey: "AIzaSyCERKownSh35zadwoGQR55HsNweLXMwMHQ",
  authDomain: "belta-games.firebaseapp.com",
  projectId: "belta-games",
  storageBucket: "belta-games.appspot.com",
  messagingSenderId: "77950108717",
  appId: "1:77950108717:web:201d41190f7c0bde5fe4a4",
  measurementId: "G-5E5K3WM1VK"
};

// 1. Inicializa o App
const app = initializeApp(firebaseConfig);

// 2. Inicializa o Segurança (App Check) - COLE SUA CHAVE DO SITE ABAIXO
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('SUA_CHAVE_DO_SITE_AQUI'), 
  isTokenAutoRefreshEnabled: true
});

// 3. Inicializa os Serviços
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

window.loginGoogle = async () => {
  try {
    const resultado = await signInWithPopup(auth, provider);
    return resultado.user;
  } catch (error) {
    console.error("Erro no login:", error);
    return null;
  }
};

window.logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro no logout:", error);
  }
};

window.observarUsuario = (callback) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        callback({ autenticado: true, user, perfil: userSnap.data(), isNovoUsuario: false });
      } else {
        callback({ autenticado: true, user, perfil: null, isNovoUsuario: true });
      }
    } else {
      callback({ autenticado: false, user: null, perfil: null, isNovoUsuario: false });
    }
  });
};

// ===== FUNÇÕES DE PERFIL =====

window.salvarNovoNickname = async (nickname) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("Usuário não logado!");
      return null;
    }

    const dados = {
      uid: user.uid,
      nickname: nickname.trim(),
      nomeReal: user.displayName,
      email: user.email,
      foto: user.photoURL,
      criadoEm: new Date().toISOString()
    };
    
    await setDoc(doc(db, "usuarios", user.uid), dados);
    return dados;
  } catch (error) {
    console.error("Erro ao salvar nick:", error);
    return null;
  }
};

// ===== FUNÇÕES DE RANKING =====

window.salvarPontos = async (nomeJogo, pontos) => {
  try {
    // Pequena espera para garantir que a sessão do usuário está ativa
    if (!auth.currentUser) {
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    const user = auth.currentUser;
    if (!user) {
      console.warn("⚠️ Falha ao detectar usuário no momento do salvamento.");
      return false;
    }

    // Busca o nickname
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    const nickname = userSnap.exists() ? userSnap.data().nickname : user.displayName;

    // Salva um NOVO documento para cada partida (conforme solicitado para testes)
    await addDoc(collection(db, "rankings"), {
      uid: user.uid,
      nickname: nickname,
      foto: user.photoURL,
      jogo: nomeJogo,
      pontos: pontos,
      data: new Date().toISOString()
    });
    
    console.log("✅ Pontuação salva com sucesso!");
    return true;
  } catch (error) {
    console.error("❌ Erro no Firestore:", error.code, error.message);
    return false;
  }
};

window.obterRanking = async (nomeJogo) => {
    try {
        const q = query(
            collection(db, "rankings"),
            where("jogo", "==", nomeJogo),
            orderBy("pontos", "desc"),
            limit(10)
        );
        const snap = await getDocs(q);
        return snap.docs.map((doc, index) => ({
            posicao: index + 1,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Erro ao buscar ranking:", error);
        return [];
    }
};
