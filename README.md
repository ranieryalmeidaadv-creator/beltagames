# Beltagames
Projeto de jogos criado com IA.

## Exportar rankings (CSV)

Script Node que exporta os usuários e suas pontuações do Firestore para
`data/rankings.csv` (uma linha por usuário, jogos em colunas com a melhor
pontuação de cada um).

### Pré-requisitos

1. Gerar a chave de service account no Firebase Console:
   [Contas de serviço](https://console.firebase.google.com/project/belta-games/settings/serviceaccounts/adminsdk)
   → **Gerar nova chave privada** → **Gerar chave** (baixa um `.json`).
2. Salvar como `scripts/serviceAccountKey.json`
   (ou apontar a variável `GOOGLE_APPLICATION_CREDENTIALS` para o arquivo).

> ⚠️ A chave dá acesso total ao projeto Firebase. Está no `.gitignore` e
> **não** deve ser commitada.

### Rodar

```bash
npm install
npm run export
```

Subconjunto de jogos diferente do padrão (passe os nomes como argumentos):

```bash
node scripts/export-rankings.js "Quiz - Empreendedorismo" "Tabuada"
```

A saída vai para `data/rankings.csv` (pasta ignorada pelo git). O script
também imprime, no console, quantos jogadores distintos cada jogo teve, a
interseção (jogaram todos) e a união (jogaram pelo menos um).

### Ao terminar: remover a chave

Para não deixar a credencial exposta na máquina:

```bash
rm scripts/serviceAccountKey.json
```

E revogue a chave no Google Cloud (invalida o arquivo de vez):
[Service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=belta-games)
→ selecione a conta → aba **Chaves** → apague a chave gerada.
