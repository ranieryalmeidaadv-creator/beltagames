# BeLTA Games

Portal de jogos educativos com Firebase Auth + Firestore, deploy via GitHub Pages.

## Convenções

- Mensagens de commit em **PT-BR**
- Código e comentários em português
- Nomes de variáveis/funções em português (camelCase)

## Stack

- HTML/CSS/JS vanilla (sem frameworks)
- Firebase 10.7.1 (Auth + Firestore) via CDN ESM
- GitHub Pages (branch main)

## Estrutura

- `index.html` — portal principal com login Google e seleção de jogos
- `firebase-config.js` — módulo Firebase (auth, perfil, ranking)
- `perguntas.js` / `palavras.js` — bancos de dados de conteúdo
- `*.html` — cada jogo é um arquivo HTML standalone
- `ranking.html` — página de rankings global

## Firebase

- Coleção `usuarios` — perfil do jogador (uid, nickname, foto)
- Coleção `rankings` — pontuações (uid, nickname, jogo, pontos, data)
- Nicknames são únicos; duplicatas existentes são corrigidas com sufixo numérico no login
