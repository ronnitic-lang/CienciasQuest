
import { Question, QuestionType } from '../types';

export const REVISION_5TH_GRADE_BANK: Omit<Question, 'id'>[] = [
  {
    text: "(EF05CI01) Qual destes materiais é atraído por um ímã devido à sua propriedade magnética?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Um clipe de ferro", "Uma caneta de plástico", "Um lápis de madeira", "Uma borracha escolar"],
    correctAnswer: 0,
    explanation: "Metais como o ferro possuem propriedades magnéticas e são atraídos por ímãs.",
    bnccCode: "EF05CI01"
  },
  {
    // Fix: Using single quotes for the outer string to avoid syntax error with internal double quotes
    text: '(EF05CI02) Quando a água das poças "some" após um dia de sol forte, que mudança de estado ocorreu?',
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Evaporação", "Solidificação", "Fusão", "Condensação"],
    correctAnswer: 0,
    explanation: "A evaporação é a passagem da água do estado líquido para o vapor devido ao calor.",
    bnccCode: "EF05CI02"
  },
  {
    text: "(EF05CI03) Por que a cobertura vegetal (plantas e árvores) é importante para evitar a erosão do solo?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["As raízes seguram a terra no lugar", "As folhas pintam o chão de verde", "As plantas impedem a chuva de cair", "As árvores bebem toda a água da chuva"],
    correctAnswer: 0,
    explanation: "As raízes das plantas formam uma rede que segura as partículas do solo, evitando que a chuva as leve.",
    bnccCode: "EF05CI03"
  },
  {
    text: "(EF05CI04) Qual atitude ajuda a usar a água de forma sustentável no dia a dia?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Fechar a torneira ao escovar os dentes", "Lavar a calçada com mangueira todos os dias", "Tomar banhos muito longos e quentes", "Deixar torneiras pingando sem consertar"],
    correctAnswer: 0,
    explanation: "Economizar água em tarefas simples garante que esse recurso não falte no futuro.",
    bnccCode: "EF05CI04"
  },
  {
    text: "(EF05CI05) O que devemos fazer com garrafas plásticas vazias para praticar o consumo consciente?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Encaminhar para a reciclagem", "Jogar no rio mais próximo", "Queimar no quintal de casa", "Enterrar no jardim da escola"],
    correctAnswer: 0,
    explanation: "A reciclagem transforma o lixo em novos produtos, reduzindo a poluição do planeta.",
    bnccCode: "EF05CI05"
  },
  {
    text: "(EF05CI06) Qual órgão do sistema respiratório é responsável por levar o oxigênio para dentro do corpo?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Pulmão", "Estômago", "Intestino", "Coração"],
    correctAnswer: 0,
    explanation: "Os pulmões realizam as trocas gasosas, absorvendo oxigênio e eliminando gás carbônico.",
    bnccCode: "EF05CI06"
  },
  {
    text: "(EF05CI07) Qual é a principal função do coração no sistema circulatório?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Bombear o sangue para o corpo todo", "Digerir os alimentos que comemos", "Limpar as mãos e a pele", "Produzir o ar que respiramos"],
    correctAnswer: 0,
    explanation: "O coração funciona como uma bomba que mantém o sangue circulando para levar nutrientes a todas as células.",
    bnccCode: "EF05CI07"
  },
  {
    text: "(EF05CI08) Para um cardápio ser considerado equilibrado e saudável, ele deve conter principalmente:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Variedade de frutas, verduras e legumes", "Apenas doces, bolos e chocolates", "Somente salgadinhos e refrigerantes", "Apenas massas e alimentos gordurosos"],
    correctAnswer: 0,
    explanation: "Uma dieta equilibrada precisa de diferentes grupos de nutrientes encontrados em vegetais e frutas.",
    bnccCode: "EF05CI08"
  },
  {
    text: "(EF05CI09) O hábito de comer muitos alimentos ultraprocessados e não fazer exercícios pode causar:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Obesidade e problemas de saúde", "Crescimento de superpoderes", "Melhora na visão noturna", "Fortalecimento automático dos ossos"],
    correctAnswer: 0,
    explanation: "A má alimentação aliada ao sedentarismo é a principal causa de distúrbios nutricionais como a obesidade.",
    bnccCode: "EF05CI09"
  },
  {
    text: "(EF05CI10) Qual constelação é muito famosa no Brasil e serve para identificar a direção Sul?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Cruzeiro do Sul", "Ursa Maior", "Três Marias", "Estrela Dalva"],
    correctAnswer: 0,
    explanation: "O Cruzeiro do Sul é visível no Hemisfério Sul e ajuda na orientação geográfica.",
    bnccCode: "EF05CI10"
  },
  {
    text: "(EF05CI11) O movimento que a Terra faz em torno de si mesma e que gera o dia e a noite chama-se:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Rotação", "Translação", "Eclipse", "Estação"],
    correctAnswer: 0,
    explanation: "A rotação é o giro da Terra em seu próprio eixo, levando cerca de 24 horas.",
    bnccCode: "EF05CI11"
  },
  {
    text: "(EF05CI12) Aproximadamente, quanto tempo dura o ciclo completo das fases da Lua?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Cerca de 29 dias", "Apenas 7 dias", "Exatos 365 dias", "Apenas 24 horas"],
    correctAnswer: 0,
    explanation: "O ciclo lunar (de uma Lua Nova até a próxima) leva aproximadamente um mês (29,5 dias).",
    bnccCode: "EF05CI12"
  },
  {
    text: "(EF05CI13) Qual instrumento é usado para observar objetos muito distantes, como planetas e estrelas?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: ["Telescópio ou Luneta", "Microscópio", "Lupa", "Espelho de bolso"],
    correctAnswer: 0,
    explanation: "Telescópios e lunetas são dispositivos ópticos projetados para visualização à longa distância.",
    bnccCode: "EF05CI13"
  }
];
