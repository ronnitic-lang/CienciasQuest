
import { Question, QuestionType } from '../types';

export const PISA_EXAM_6: Omit<Question, 'id'>[] = [
  {
    text: "Na década de 50, o Seu Francisco usava uma alavanca de madeira para levantar pedras pesadas em sua comunidade quilombola (Vale do Ribeira-SP). A alavanca facilita o trabalho porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Elimina completamente o peso das pedras.",
      "Faz as pedras ficarem mais leves automaticamente.",
      "Diminui a força necessária para levantar objetos pesados.",
      "Transforma a pedra em um material mais fácil de carregar."
    ],
    correctAnswer: 2,
    explanation: "A alavanca é uma máquina simples que multiplica a força aplicada.",
    bnccCode: "EF07CI01"
  },
  {
    text: "Em uma aldeia Yanomami, as crianças perceberam que a panela de metal esquenta muito mais rápido que o cesto de palha perto da fogueira. Isso acontece porque o metal:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Reflete toda a luz da fogueira.",
      "Produz seu próprio calor internamente.",
      "Está sempre mais quente que outros materiais.",
      "Absorve mais calor e conduz melhor que a palha."
    ],
    correctAnswer: 3,
    explanation: "Metais são excelentes condutores térmicos.",
    bnccCode: "EF07CI03"
  },
  {
    text: "Carlos notou que ao sair do ar-condicionado (20°C) para a rua (40°C) em Floriano-PI, sente muito calor, mas a sensação diminui após alguns minutos. Isso ocorre porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "A temperatura do ar diminuiu rapidamente.",
      "A temperatura corporal aumenta para 40°C.",
      "O corpo se adapta à nova temperatura do ambiente.",
      "O ar-condicionado continua resfriando o corpo à distância."
    ],
    correctAnswer: 2,
    explanation: "O corpo humano possui mecanismos de termorregulação.",
    bnccCode: "EF06CI07"
  },
  {
    text: "Na feira de Caruaru-PE, Joana notou que o gelo derreteu mesmo dentro da caixa de isopor. Por que isso ocorreu?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "O isopor é um bom condutor de calor.",
      "A caixa de isopor produz calor internamente.",
      "O calor do ambiente passou para o interior da caixa.",
      "O peixe aqueceu o gelo até derreter completamente."
    ],
    correctAnswer: 2,
    explanation: "O isolamento térmico do isopor não é perfeito e permite a troca lenta de calor.",
    bnccCode: "EF07CI02"
  },
  {
    text: "Em Teresina-PI, de onde vem originalmente a água da chuva que cai na horta escolar?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Do subsolo que libera vapor naturalmente.",
      "Das montanhas distantes onde a neve derrete.",
      "Das nuvens pela evaporação das fontes de água.",
      "Das árvores da caatinga que produzem umidade."
    ],
    correctAnswer: 2,
    explanation: "A água evapora de rios e oceanos, condensa-se e cai como chuva.",
    bnccCode: "EF06CI13"
  },
  {
    text: "A diferença na duração dos dias entre verão e inverno em Porto Alegre-RS acontece por causa de:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Inclinação do eixo da Terra.",
      "O Sol se afastar da Terra no inverno.",
      "A Terra girar mais devagar no inverno.",
      "As nuvens bloquearem o Sol no inverno."
    ],
    correctAnswer: 0,
    explanation: "A inclinação do eixo terrestre causa a variação da luz solar nas estações.",
    bnccCode: "EF06CI14"
  },
  {
    text: "O fenômeno das marés, observado em Itacaré-BA, é causado principalmente pela:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Atração gravitacional da Lua.",
      "Temperatura da água do mar que varia.",
      "Força dos ventos que empurram a água.",
      "Translação do planeta Terra durante o ano."
    ],
    correctAnswer: 0,
    explanation: "A gravidade da Lua atrai as massas de água da Terra.",
    bnccCode: "EF08CI12"
  },
  {
    text: "Os planetas não piscam como as estrelas quando observados de Brasília-DF porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Não possuem luz própria.",
      "São feitos de materiais diferentes.",
      "Estão muito mais próximos da Terra que as estrelas.",
      "A atmosfera terrestre afeta menos a luz refletida por eles."
    ],
    correctAnswer: 3,
    explanation: "A proximidade faz com que a luz dos planetas sofra menos distorção atmosférica.",
    bnccCode: "EF09CI14"
  }
];

export const PISA_EXAM_7: Omit<Question, 'id'>[] = [
  {
    text: "Na queima da lenha em comunidades rurais da Bahia, ocorre uma transformação química porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "O fogo aquece a panela sem alterar a lenha.",
      "A lenha produz apenas calor sem liberar material.",
      "A lenha apenas muda de forma sem gerar novas substâncias.",
      "A lenha se transforma em cinzas, fumaça e gases."
    ],
    correctAnswer: 3,
    explanation: "Reações químicas geram novas substâncias.",
    bnccCode: "EF06CI02"
  },
  {
    text: "Pilhas usadas não devem ser jogadas no lixo comum porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Todas as pilhas são recarregáveis.",
      "O lixo comum é o local ideal para eletrônicos.",
      "Contêm metais pesados que contaminam o solo e a água.",
      "São leves e não causam impacto ambiental."
    ],
    correctAnswer: 2,
    explanation: "Metais pesados são altamente poluentes e tóxicos.",
    bnccCode: "EF09CI13"
  },
  {
    text: "O disjuntor desarma em São Paulo quando ligamos chuveiro e micro-ondas juntos porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "A voltagem da rua diminui à noite.",
      "O chuveiro e o micro-ondas usam a mesma tomada.",
      "A corrente total ultrapassa a capacidade do disjuntor.",
      "O disjuntor está sempre com defeito."
    ],
    correctAnswer: 2,
    explanation: "O disjuntor é um dispositivo de segurança contra sobrecarga.",
    bnccCode: "EF08CI02"
  },
  {
    text: "A mistura de vinagre e bicarbonato produzindo bolhas de gás é um exemplo de:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Fusão do líquido com o sólido.",
      "Transformação química com liberação de gás.",
      "Fenômeno físico sem mudança de matéria.",
      "Mudança física de estado."
    ],
    correctAnswer: 1,
    explanation: "A liberação de gás indica uma reação química.",
    bnccCode: "EF09CI02"
  },
  {
    text: "As capivaras no Pantanal passam muito tempo na água para:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Evitar a luz solar intensa.",
      "Fugir de predadores terrestres.",
      "Regular a temperatura corporal.",
      "Capturar peixes para se alimentar."
    ],
    correctAnswer: 2,
    explanation: "A água ajuda na regulação térmica do animal.",
    bnccCode: "EF09CI11"
  }
];

export const PISA_EXAM_8: Omit<Question, 'id'>[] = [
  {
    text: "O uso de painéis solares em assentamentos no Acre é sustentável porque a energia solar:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Exige queimadas para funcionar.",
      "Substitui a necessidade de água potável.",
      "É renovável e não polui durante o uso.",
      "Funciona melhor em regiões frias."
    ],
    correctAnswer: 2,
    explanation: "Energia solar é limpa e inesgotável.",
    bnccCode: "EF08CI01"
  },
  {
    text: "Subir ou descer um ou dois andares de escada em vez de usar o elevador ajuda a:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Instalar um gerador a diesel.",
      "Gastar mais energia do prédio.",
      "Usar energia de forma mais consciente.",
      "Pedir para o síndico desligar as luzes."
    ],
    correctAnswer: 2,
    explanation: "Pequenas mudanças de hábito reduzem o consumo elétrico.",
    bnccCode: "EF08CI05"
  },
  {
    text: "Deixar o carregador de celular na tomada sem o aparelho:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Não gasta nenhuma energia.",
      "Aumenta a velocidade da internet.",
      "Carrega baterias invisíveis.",
      "Consome energia desnecessariamente."
    ],
    correctAnswer: 3,
    explanation: "Mesmo sem o aparelho, o transformador interno consome energia.",
    bnccCode: "EF08CI05"
  },
  {
    text: "Substituir lâmpadas comuns por LEDs é uma ação de uso consciente porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Lâmpadas LED são mais eficientes e econômicas.",
      "Lâmpadas LED custam menos para fabricar.",
      "Lâmpadas fluorescentes são melhores que LEDs.",
      "LEDs iluminam menos que lâmpadas comuns."
    ],
    correctAnswer: 0,
    explanation: "O LED converte mais energia em luz e menos em calor.",
    bnccCode: "EF08CI05"
  },
  {
    text: "O selo Procel A em eletrodomésticos indica que:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "O aparelho é mais eficiente e gasta menos energia.",
      "O aparelho gasta mais eletricidade.",
      "O congelador deve ficar na parte inferior.",
      "O ar frio é menos denso que o ar quente."
    ],
    correctAnswer: 0,
    explanation: "A classificação A é a mais eficiente em consumo elétrico.",
    bnccCode: "EF08CI05"
  }
];
