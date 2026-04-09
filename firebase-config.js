import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// COLE AQUI OS DADOS QUE VOCÊ COPIOU DO FIREBASE NO PASSO 1
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

// FUNÇÕES QUE O SITE VAI USAR
window.loginGoogle = () => signInWithPopup(auth, provider);
window.logout = () => signOut(auth);
window.observarUsuario = (callback) => onAuthStateChanged(auth, callback);

// Verifica e cria o Nickname (SÓ NO PRIMEIRO ACESSO)
window.verificarOuCriarPerfil = async (user) => {
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        return null; // Usuário novo, precisa de Nickname
    }
};

window.salvarNovoNickname = async (nickname) => {
    const user = auth.currentUser;
    const dados = {
        uid: user.uid,
        nickname: nickname,
        nomeReal: user.displayName,
        foto: user.photoURL,
        criadoEm: new Date()
    };
    await setDoc(doc(db, "usuarios", user.uid), dados);
    return dados;
};

// Salva pontuação usando o Nickname imutável
window.salvarPontos = async (nomeJogo, pontos) => {
   const user = auth.currentUser;
    if (!user) return;
    
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    const nick = userSnap.exists() ? userSnap.data().nickname : "Anônimo";

    await addDoc(collection(db, "rankings"), {
        uid: user.uid,
        nickname: nick,
        foto: user.photoURL,
        jogo: nomeJogo,
        pontos: pontos,
        data: new Date()
    });
   if (!nomeJogo || typeof pontos !== 'number') {
        throw new Error("Parâmetros inválidos");
    }
  try {
    } catch (error) {
        console.error("Erro ao salvar pontos:", error);
        throw error;
    }  
};

// Busca o Top 10 para o Ranking
window.obterRanking = async (nomeJogo) => {
    const q = query(
        collection(db, "rankings"),
        where("jogo", "==", nomeJogo),
        orderBy("pontos", "desc"),
        limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data());
};
