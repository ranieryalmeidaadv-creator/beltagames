// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCERKownSh35zadwoGQR55HsNweLXMwMHQ",
  authDomain: "belta-games.firebaseapp.com",
  projectId: "belta-games",
  storageBucket: "belta-games.appspot.com",
  messagingSenderId: "belta-games",
  appId: "77950108717"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para salvar a pontuação
window.salvarPontuacao = async (nomeJogo, pontos) => {
    let nomeUsuario = localStorage.getItem("belta_user") || "Jogador Anônimo";
    try {
        await addDoc(collection(db, "rankings"), {
            usuario: nomeUsuario,
            jogo: nomeJogo,
            score: pontos,
            data: new Date()
        });
        console.log("Pontuação salva!");
    } catch (e) {
        console.error("Erro ao salvar: ", e);
    }
};

// Função para buscar o Top 5 de um jogo
window.buscarTopScores = async (nomeJogo) => {
    const q = query(
        collection(db, "rankings"), 
        orderBy("score", "desc"), 
        limit(5)
    );
    // Filtragem simples via código para facilitar (já que você é iniciante)
    const querySnapshot = await getDocs(q);
    let resultados = [];
    querySnapshot.forEach((doc) => {
        let dados = doc.data();
        if(dados.jogo === nomeJogo) resultados.push(dados);
    });
    return resultados;
};
