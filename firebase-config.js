import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check.js";

// Configuração do seu projeto
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

// 2. Inicializa o App Check
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LevOM8sAAAAACcl4iWmw7Lk8SILH4z08YNd1CuE'),
  isTokenAutoRefreshEnabled: true
});

// 3. Inicializa os Serviços
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const TIMEZONE_SP = "America/Sao_Paulo";

function getSaoPauloDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE_SP,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const map = {};
  parts.forEach((p) => {
    if (p.type !== "literal") map[p.type] = p.value;
  });

  return `${map.year}-${map.month}-${map.day}`;
}

function getSaoPauloNowText() {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIMEZONE_SP,
    dateStyle: "full",
    timeStyle: "medium"
  }).format(new Date());
}

function slugifyGameName(nome) {
  return String(nome || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function waitForCurrentUser(timeoutMs = 5000) {
  const start = Date.now();
  while (!auth.currentUser && Date.now() - start < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return auth.currentUser;
}

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
        callback({
          autenticado: true,
          user,
          perfil: userSnap.data(),
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

window.salvarNovoNickname = async (nickname) => {
  try {
    const user = await waitForCurrentUser();
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

// ===== FUNÇÃO PARA LIMITAR 1 JOGO POR DIA =====

window.getSaoPauloNowText = getSaoPauloNowText;

window.podeJogarHoje = async (nomeJogo) => {
  try {
    const user = await waitForCurrentUser();
    if (!user) {
      return { ok: false, motivo: "nao-logado" };
    }

    const dateSP = getSaoPauloDateKey();
    const playId = `${user.uid}_${slugifyGameName(nomeJogo)}_${dateSP}`;
    const playRef = doc(db, "dailyPlays", playId);
    const snap = await getDoc(playRef);

    if (snap.exists()) {
      return { ok: false, motivo: "ja-jogou", dateSP };
    }

    await setDoc(playRef, {
      uid: user.uid,
      jogo: nomeJogo,
      dateSP,
      criadoEmSP: getSaoPauloNowText(),
      createdAt: serverTimestamp()
    });

    return { ok: true, dateSP };
  } catch (error) {
    console.error("Erro ao verificar jogo diário:", error);
    return { ok: false, motivo: "erro" };
  }
};

// ===== FUNÇÕES DE RANKING =====

window.salvarPontos = async (nomeJogo, pontos) => {
  try {
    const user = await waitForCurrentUser();
    if (!user) {
      console.warn("⚠️ Falha ao detectar usuário no momento do salvamento.");
      return false;
    }

    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    const nickname = userSnap.exists() ? userSnap.data().nickname : user.displayName;

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
