import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCERKownSh35zadwoGQR55HsNweLXMwMHQ",
  authDomain: "belta-games.firebaseapp.com",
  projectId: "belta-games",
  storageBucket: "belta-games.appspot.com",
  messagingSenderId: "belta-games",
  appId: "77950108717"
};

// Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// --- FUNÇÕES EXPOSTAS PARA O SITE ---

// 1. Fazer Login
window.loginGoogle = () => signInWithPopup(auth, provider);

// 2. Fazer Logout
window.logout = () => signOut(auth);

// 3. Monitorar usuário (vê se ele entrou ou saiu)
window.observarUsuario = (callback) => {
    onAuthStateChanged(auth, callback);
};

// 4. Salvar Pontuação no Ranking
window.salvarPontos = async (nomeJogo, pontos) => {
    const user = auth.currentUser;
    if (user) {
        await addDoc(collection(db, "rankings"), {
            uid: user.uid,
            nome: user.displayName,
            foto: user.photoURL,
            jogo: nomeJogo,
            pontos: pontos,
            data: new Date()
        });
    }
};

// 5. Buscar Ranking Top 10
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
