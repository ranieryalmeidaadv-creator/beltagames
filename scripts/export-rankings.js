#!/usr/bin/env node
// Exporta todos os usuários e seus rankings do Firestore para CSV.
//
// Uso:
//   1. Baixe a chave de service account no Firebase Console:
//      Configurações do projeto > Contas de serviço > Gerar nova chave privada
//   2. Salve como scripts/serviceAccountKey.json (ou aponte GOOGLE_APPLICATION_CREDENTIALS)
//   3. npm install
//   4. npm run export        (ou: node scripts/export-rankings.js)
//
// Gera data/rankings.csv: uma linha por usuário, com os jogos em colunas
// (a melhor pontuação de cada usuário em cada jogo).
//
// Por padrão inclui apenas os jogos em JOGOS_PADRAO. Para outro subconjunto,
// passe os nomes como argumentos:
//   node scripts/export-rankings.js "Quiz - Empreendedorismo" "Tabuada"

const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

// Jogos a incluir no export (vira coluna no CSV). O banco tem outros jogos;
// apenas estes entram. Sobrescreva passando nomes via CLI:
//   node scripts/export-rankings.js "Quiz - Empreendedorismo" "Tabuada"
const JOGOS_PADRAO = ["Quiz - Educação Financeira", "Quiz - Empreendedorismo"];
const JOGOS_INCLUIDOS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : JOGOS_PADRAO;

const KEY_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(__dirname, "serviceAccountKey.json");

// Instruções para obter a chave (mostradas quando algo está errado).
function instrucoesObterChave() {
  console.error(
    "\n📄 Como gerar a chave de service account:\n" +
      "   1. https://console.firebase.google.com/project/belta-games/settings/serviceaccounts/adminsdk\n" +
      "   2. Clique em 'Gerar nova chave privada' > 'Gerar chave' (baixa um .json)\n" +
      `   3. Salve como: ${path.join(__dirname, "serviceAccountKey.json")}\n` +
      "      (ou aponte a variável GOOGLE_APPLICATION_CREDENTIALS para o arquivo)\n" +
      "   ⚠️  Trate o arquivo como senha: dá acesso total ao projeto Firebase.\n"
  );
}

if (!fs.existsSync(KEY_PATH)) {
  console.error(`❌ Chave não encontrada em: ${KEY_PATH}`);
  instrucoesObterChave();
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(KEY_PATH))
});

const db = admin.firestore();

// Preflight: confirma que a chave realmente dá acesso de leitura ao Firestore.
async function checarAcessoFirestore() {
  try {
    await db.collection("usuarios").limit(1).get();
  } catch (err) {
    console.error(
      `❌ Sem acesso ao Firestore: ${err.message}\n` +
        "   A chave pode estar inválida, revogada ou sem permissão."
    );
    instrucoesObterChave();
    process.exit(1);
  }
}

// Escapa um valor para CSV (RFC 4180).
function csvField(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCSV(headers, rows) {
  const lines = [headers.map(csvField).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvField(row[h])).join(","));
  }
  // BOM para abrir corretamente no Excel com acentos.
  return "﻿" + lines.join("\r\n");
}

async function main() {
  await checarAcessoFirestore();

  console.log("📥 Lendo coleções do Firestore...");

  const [usuariosSnap, rankingsSnap] = await Promise.all([
    db.collection("usuarios").get(),
    db.collection("rankings").get()
  ]);

  const usuarios = new Map();
  usuariosSnap.forEach((doc) => {
    usuarios.set(doc.id, doc.data());
  });

  const todasPontuacoes = rankingsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Mantém apenas os jogos do allow-list.
  const incluidos = new Set(JOGOS_INCLUIDOS);
  const rankings = todasPontuacoes.filter((r) => incluidos.has(r.jogo));

  console.log(
    `   ${usuarios.size} usuários, ${rankings.length} pontuações ` +
      `(de ${todasPontuacoes.length}) nos jogos: ${JOGOS_INCLUIDOS.join(", ")}.`
  );

  // ===== rankings.csv: uma linha por usuário, jogos em colunas =====
  // Colunas seguem a ordem do allow-list; só inclui jogos com pontuações.
  const jogos = JOGOS_INCLUIDOS.filter((j) => rankings.some((r) => r.jogo === j));

  // Melhor pontuação de cada usuário em cada jogo.
  const melhorPorUsuarioJogo = new Map(); // uid -> { jogo -> melhorPontos }
  for (const r of rankings) {
    if (!r.uid) continue;
    if (!melhorPorUsuarioJogo.has(r.uid)) melhorPorUsuarioJogo.set(r.uid, {});
    const porJogo = melhorPorUsuarioJogo.get(r.uid);
    const pts = Number(r.pontos) || 0;
    if (porJogo[r.jogo] === undefined || pts > porJogo[r.jogo]) {
      porJogo[r.jogo] = pts;
    }
  }

  // ===== Estatísticas de jogadores por jogo =====
  // Conjunto de uids distintos por jogo.
  const jogadoresPorJogo = new Map(jogos.map((j) => [j, new Set()]));
  for (const [uid, porJogo] of melhorPorUsuarioJogo) {
    for (const jogo of jogos) {
      if (porJogo[jogo] !== undefined) jogadoresPorJogo.get(jogo).add(uid);
    }
  }

  const conjuntos = jogos.map((j) => jogadoresPorJogo.get(j));
  const uniao = new Set(conjuntos.flatMap((s) => [...s]));
  const intersecao = conjuntos.length
    ? [...conjuntos[0]].filter((uid) => conjuntos.every((s) => s.has(uid)))
    : [];

  console.log("📊 Jogadores distintos por jogo:");
  for (const jogo of jogos) {
    console.log(`   ${jogo}: ${jogadoresPorJogo.get(jogo).size}`);
  }
  console.log(`   ∩ jogaram TODOS os ${jogos.length} jogos: ${intersecao.length}`);
  console.log(`   ∪ jogaram PELO MENOS 1: ${uniao.size}`);

  const headers = ["uid", "nickname", "nomeReal", "email", "criadoEm", ...jogos];

  // Inclui também usuários que aparecem só na coleção rankings.
  const todosUids = new Set([...usuarios.keys(), ...melhorPorUsuarioJogo.keys()]);

  const rows = [...todosUids]
    .filter((uid) => {
      // Mantém quem jogou PELO MENOS UM dos jogos do subconjunto.
      const porJogo = melhorPorUsuarioJogo.get(uid) || {};
      return jogos.some((jogo) => porJogo[jogo] !== undefined);
    })
    .map((uid) => {
      const u = usuarios.get(uid) || {};
      const porJogo = melhorPorUsuarioJogo.get(uid) || {};
      const row = {
        uid,
        nickname: u.nickname || "",
        nomeReal: u.nomeReal || "",
        email: u.email || "",
        criadoEm: u.criadoEm || ""
      };
      for (const jogo of jogos) {
        row[jogo] = porJogo[jogo] !== undefined ? porJogo[jogo] : "";
      }
      return row;
    });

  rows.sort((a, b) => (a.nickname || "").localeCompare(b.nickname || ""));

  const outDir = path.join(process.cwd(), "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "rankings.csv");
  fs.writeFileSync(outPath, toCSV(headers, rows));

  console.log(
    `✅ Gerado: ${outPath} (${rows.length} usuários com pontuação em ` +
      `pelo menos 1 dos ${jogos.length} jogos)`
  );

  lembreteRevogarChave();
}

// Lembra o usuário de remover a chave para não deixá-la "aberta" na máquina.
function lembreteRevogarChave() {
  // Não instrui a apagar se a chave veio de fora do repo (GOOGLE_APPLICATION_CREDENTIALS).
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return;

  console.log(
    "\n🔒 Terminou? Remova a chave para não deixá-la exposta:\n" +
      `   1. Apague o arquivo local:\n` +
      `      rm ${KEY_PATH}\n` +
      "   2. Revogue a chave no Google Cloud (invalida o arquivo de vez):\n" +
      "      https://console.cloud.google.com/iam-admin/serviceaccounts?project=belta-games\n" +
      "      > clique na service account > aba 'Chaves' > apague a chave gerada.\n"
  );
}

main().catch((err) => {
  console.error("❌ Erro:", err);
  process.exit(1);
});
