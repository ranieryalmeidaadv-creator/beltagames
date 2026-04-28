import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// IMPORTANTE: Importando o App Check
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check.js";

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

// ATIVANDO O APP CHECK (Substitua pela sua CHAVE DO SITE do reCAPTCHA v3)
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LevOM8sAAAAACcl4iWmw7Lk8SILH4z08YNd1CuE'), 
  isTokenAutoRefreshEnabled: true
});

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
  try { await signOut(auth); } catch (error) { console.error("Erro no logout:", error); }
};

window.observarUsuario = (callback) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);
      callback({ 
        autenticado: true, 
        user, 
        perfil: userSnap.exists() ? userSnap.data() : null,
        isNovoUsuario: !userSnap.exists() 
      });
    } else {
      callback({ autenticado: false, user: null, perfil: null, isNovoUsuario: false });
    }
  });
};

// ===== FUNÇÕES DE PERFIL =====
window.salvarNovoNickname = async (nickname) => {
  try {
    const user = auth.currentUser;
    if (!user) return null;
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

// ===== FUNÇÕES DE RANKING (MANTENDO GRAVAÇÃO DE TODAS AS PARTIDAS) =====
window.salvarPontos = async (nomeJogo, pontos) => {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    // Busca o nickname para salvar junto com o ponto
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    const nickname = userSnap.exists() ? userSnap.data().nickname : user.displayName;

    // MANTIDO: addDoc cria um NOVO registro toda vez (ótimo para fase de teste)
    await addDoc(collection(db, "rankings"), {
      uid: user.uid,
      nickname: nickname,
      foto: user.photoURL,
      jogo: nomeJogo,
      pontos: pontos,
      data: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar pontos:", error);
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
