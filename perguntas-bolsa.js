// perguntas-bolsa.js
if (typeof window.questionBank === 'undefined') {
  window.questionBank = [
    // 1
    {
      q: "O que é educação financeira?",
      a: [
        "Saber ganhar dinheiro rapidamente",
        "Aprender a lidar melhor com dinheiro, consumo, planejamento e escolhas financeiras",
        "Comprar tudo o que deseja sem pensar nas consequências",
        "Investir apenas em ações"
      ],
      c: "Aprender a lidar melhor com dinheiro, consumo, planejamento e escolhas financeiras"
    },
    // 2
    {
      q: "Qual é a principal diferença entre desejo e necessidade?",
      a: [
        "Necessidade é algo essencial; desejo é algo que queremos, mas nem sempre precisamos",
        "Desejo é sempre mais importante que necessidade",
        "Necessidade é tudo aquilo que compramos por impulso",
        "Desejo e necessidade são a mesma coisa"
      ],
      c: "Necessidade é algo essencial; desejo é algo que queremos, mas nem sempre precisamos"
    },
    // 3
    {
      q: "O que significa fazer um orçamento pessoal?",
      a: [
        "Gastar primeiro e anotar depois",
        "Planejar receitas e despesas para controlar melhor o dinheiro",
        "Separar todo o dinheiro apenas para lazer",
        "Evitar olhar para os próprios gastos"
      ],
      c: "Planejar receitas e despesas para controlar melhor o dinheiro"
    },
    // 4
    {
      q: "Qual atitude representa melhor um bom planejamento financeiro?",
      a: [
        "Comprar por impulso quando aparece uma promoção",
        "Usar todo o dinheiro assim que receber",
        "Guardar uma parte do dinheiro e organizar os gastos antes de consumir",
        "Evitar pensar sobre despesas futuras"
      ],
      c: "Guardar uma parte do dinheiro e organizar os gastos antes de consumir"
    },
    // 5
    {
      q: "O que são juros?",
      a: [
        "Um desconto obrigatório em todas as compras",
        "Um valor cobrado ou recebido pelo uso do dinheiro ao longo do tempo",
        "Um tipo de imposto pago apenas por empresas",
        "Um prêmio recebido por gastar mais"
      ],
      c: "Um valor cobrado ou recebido pelo uso do dinheiro ao longo do tempo"
    },
    // 6
    {
      q: "O que acontece quando uma pessoa atrasa o pagamento de uma dívida?",
      a: [
        "A dívida desaparece automaticamente",
        "Ela pode pagar menos do que devia",
        "Podem ser cobrados juros, multas e encargos",
        "O banco é obrigado a perdoar a dívida"
      ],
      c: "Podem ser cobrados juros, multas e encargos"
    },
    // 7
    {
      q: "Qual é a melhor definição de investimento?",
      a: [
        "Aplicar ou guardar dinheiro com objetivo de gerar retorno no futuro",
        "Comprar qualquer coisa cara",
        "Gastar dinheiro em produtos da moda",
        "Usar o cartão de crédito sem controle"
      ],
      c: "Aplicar ou guardar dinheiro com objetivo de gerar retorno no futuro"
    },
    // 8
    {
      q: "O que significa poupar dinheiro?",
      a: [
        "Separar uma parte do dinheiro para usar no futuro",
        "Gastar tudo em compras pequenas",
        "Fazer empréstimos para comprar mais",
        "Comprar apenas quando está em promoção"
      ],
      c: "Separar uma parte do dinheiro para usar no futuro"
    },
    // 9
    {
      q: "Por que é importante ter uma reserva de emergência?",
      a: [
        "Para comprar produtos caros sem pensar",
        "Para lidar com imprevistos sem depender imediatamente de dívidas",
        "Para gastar em festas e viagens todo mês",
        "Para substituir completamente o trabalho"
      ],
      c: "Para lidar com imprevistos sem depender imediatamente de dívidas"
    },
    // 10
    {
      q: "O que é consumo consciente?",
      a: [
        "Comprar tudo que aparece nas redes sociais",
        "Consumir pensando na real necessidade, no impacto e na capacidade de pagamento",
        "Gastar mais para parecer bem-sucedido",
        "Evitar qualquer tipo de compra para sempre"
      ],
      c: "Consumir pensando na real necessidade, no impacto e na capacidade de pagamento"
    },
    // 11
    {
      q: "Qual alternativa representa um exemplo de renda?",
      a: [
        "Conta de luz",
        "Mensalidade da escola",
        "Salário, mesada ou pagamento recebido por um trabalho",
        "Compra no supermercado"
      ],
      c: "Salário, mesada ou pagamento recebido por um trabalho"
    },
    // 12
    {
      q: "Qual alternativa representa uma despesa?",
      a: [
        "Dinheiro recebido por um serviço",
        "Salário mensal",
        "Rendimento de investimento",
        "Pagamento de transporte, alimentação ou conta de internet"
      ],
      c: "Pagamento de transporte, alimentação ou conta de internet"
    },
    // 13
    {
      q: "O que é mercado financeiro?",
      a: [
        "Um local onde se vendem apenas alimentos",
        "Um sistema onde pessoas, empresas e governos movimentam dinheiro, crédito e investimentos",
        "Um tipo de loja online",
        "Um aplicativo usado apenas para compras"
      ],
      c: "Um sistema onde pessoas, empresas e governos movimentam dinheiro, crédito e investimentos"
    },
    // 14
    {
      q: "Qual é o papel de uma instituição financeira, como banco ou cooperativa?",
      a: [
        "Guardar, movimentar, emprestar dinheiro e oferecer produtos financeiros",
        "Criar jogos digitais para alunos",
        "Controlar todas as compras das pessoas sem autorização",
        "Distribuir dinheiro gratuitamente para todos"
      ],
      c: "Guardar, movimentar, emprestar dinheiro e oferecer produtos financeiros"
    },
    // 15
    {
      q: "Qual é uma atitude financeira responsável?",
      a: [
        "Gastar mais do que ganha todos os meses",
        "Comprar por impulso sem comparar preços",
        "Planejar gastos, evitar dívidas desnecessárias e guardar parte do dinheiro",
        "Usar empréstimos para qualquer compra pequena"
      ],
      c: "Planejar gastos, evitar dívidas desnecessárias e guardar parte do dinheiro"
    },
    // 16
    {
      q: "O que é crédito?",
      a: [
        "Dinheiro emprestado que deve ser pago depois, geralmente com condições combinadas",
        "Dinheiro recebido sem precisar devolver",
        "Um presente dado pelo banco",
        "Um tipo de desconto automático"
      ],
      c: "Dinheiro emprestado que deve ser pago depois, geralmente com condições combinadas"
    },
    // 17
    {
      q: "Qual cuidado é importante ao usar cartão de crédito?",
      a: [
        "Usar sem limite, porque o pagamento fica para depois",
        "Comprar apenas para acumular parcelas",
        "Acompanhar os gastos e pagar a fatura em dia",
        "Pagar sempre o valor mínimo da fatura"
      ],
      c: "Acompanhar os gastos e pagar a fatura em dia"
    },
    // 18
    {
      q: "O que significa pagar apenas o valor mínimo da fatura do cartão?",
      a: [
        "Quitar toda a dívida sem juros",
        "Adiar parte da dívida, normalmente com cobrança de juros altos",
        "Receber dinheiro de volta automaticamente",
        "Cancelar a fatura do mês seguinte"
      ],
      c: "Adiar parte da dívida, normalmente com cobrança de juros altos"
    },
    // 19
    {
      q: "O que é uma meta financeira?",
      a: [
        "Um objetivo relacionado ao uso do dinheiro, como guardar para uma viagem ou curso",
        "Uma compra feita sem planejamento",
        "Um imposto cobrado pelo governo",
        "Uma dívida que não precisa ser paga"
      ],
      c: "Um objetivo relacionado ao uso do dinheiro, como guardar para uma viagem ou curso"
    },
    // 20
    {
      q: "O que é inflação?",
      a: [
        "A redução de todos os preços ao mesmo tempo",
        "O aumento generalizado dos preços, que reduz o poder de compra do dinheiro",
        "Um tipo de investimento sem risco",
        "Um desconto dado nas compras à vista"
      ],
      c: "O aumento generalizado dos preços, que reduz o poder de compra do dinheiro"
    },
    // 21
    {
      q: "O que significa poder de compra?",
      a: [
        "A quantidade de coisas que o dinheiro consegue comprar",
        "A capacidade de pegar empréstimos sem pagar",
        "O limite máximo do cartão de crédito",
        "O valor que uma loja decide cobrar"
      ],
      c: "A quantidade de coisas que o dinheiro consegue comprar"
    },
    // 22
    {
      q: "Qual é a vantagem de comparar preços antes de comprar?",
      a: [
        "Comprar sempre o produto mais caro",
        "Evitar qualquer compra",
        "Tomar uma decisão mais consciente e economizar dinheiro",
        "Aumentar automaticamente a renda"
      ],
      c: "Tomar uma decisão mais consciente e economizar dinheiro"
    },
    // 23
    {
      q: "O que é risco em um investimento?",
      a: [
        "A possibilidade de o resultado ser diferente do esperado, inclusive com perdas",
        "A garantia de ganhar dinheiro sempre",
        "Um desconto aplicado no banco",
        "Um tipo de conta corrente"
      ],
      c: "A possibilidade de o resultado ser diferente do esperado, inclusive com perdas"
    },
    // 24
    {
      q: "Qual alternativa representa melhor a ideia de diversificação?",
      a: [
        "Colocar todo o dinheiro em uma única opção",
        "Dividir os investimentos em diferentes alternativas para reduzir riscos",
        "Gastar todo o dinheiro em compras parceladas",
        "Evitar qualquer planejamento financeiro"
      ],
      c: "Dividir os investimentos em diferentes alternativas para reduzir riscos"
    },
    // 25
    {
      q: "O que é liquidez?",
      a: [
        "A facilidade de transformar um investimento em dinheiro disponível",
        "O preço de um produto no supermercado",
        "A quantidade de juros de uma dívida atrasada",
        "A soma de todos os gastos do mês"
      ],
      c: "A facilidade de transformar um investimento em dinheiro disponível"
    },
    // 26
    {
      q: "O que significa renda fixa?",
      a: [
        "Um tipo de investimento em que as regras de remuneração são conhecidas previamente",
        "Uma renda que nunca muda na vida inteira",
        "Uma compra parcelada no cartão",
        "Um empréstimo feito sem contrato"
      ],
      c: "Um tipo de investimento em que as regras de remuneração são conhecidas previamente"
    },
    // 27
    {
      q: "O que significa renda variável?",
      a: [
        "Um investimento cujo retorno pode oscilar conforme o mercado",
        "Uma despesa que sempre tem o mesmo valor",
        "Um tipo de salário obrigatório",
        "Um pagamento sem risco algum"
      ],
      c: "Um investimento cujo retorno pode oscilar conforme o mercado"
    },
    // 28
    {
      q: "Qual é uma boa prática antes de investir?",
      a: [
        "Investir sem entender para ganhar rápido",
        "Pesquisar, entender os riscos e alinhar o investimento ao objetivo",
        "Seguir qualquer dica da internet",
        "Usar dinheiro reservado para despesas essenciais sem avaliar"
      ],
      c: "Pesquisar, entender os riscos e alinhar o investimento ao objetivo"
    },
    // 29
    {
      q: "O que é empreendedorismo financeiro?",
      a: [
        "Criar soluções ou negócios considerando custos, receitas, riscos e sustentabilidade",
        "Comprar sem planejar",
        "Guardar dinheiro sem nenhum objetivo",
        "Fazer dívidas para parecer empreendedor"
      ],
      c: "Criar soluções ou negócios considerando custos, receitas, riscos e sustentabilidade"
    },
    // 30
    {
      q: "Em um projeto ou negócio, por que é importante entender custos e receitas?",
      a: [
        "Para saber se a solução pode se sustentar financeiramente",
        "Para gastar mais sem controle",
        "Para evitar qualquer tipo de planejamento",
        "Para definir apenas o nome do projeto"
      ],
      c: "Para saber se a solução pode se sustentar financeiramente"
    }
  ];

  console.log("✅ Banco de perguntas criado:", window.questionBank.length, "perguntas");
} else {
  console.warn("⚠️ questionBank já foi definido anteriormente");
}
