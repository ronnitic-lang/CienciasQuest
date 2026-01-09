
import { Question, QuestionType } from '../types';

export const PISA_EXAM_6: Omit<Question, 'id'>[] = [
  // ... (mantido conforme bancos anteriores) ...
  {
    text: "Na década de 50, o Seu Francisco usava uma alavanca de madeira para levantar pedras pesadas em sua comunidade quilombola. A alavanca facilita o trabalho porque:",
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
  }
];

export const PISA_EXAM_7: Omit<Question, 'id'>[] = [
    // ... (mantido conforme bancos anteriores) ...
];

export const PISA_EXAM_8: Omit<Question, 'id'>[] = [
    // ... (mantido conforme bancos anteriores) ...
];

export const PISA_EXAM_9: Omit<Question, 'id'>[] = [
  {
    text: "1. Em uma comunidade interiorana, os moradores usam fogão à lenha para cozinhar. Ao queimar a lenha, ocorre uma transformação química porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "o fogo aquece a panela uniformemente, mas não altera a lenha.",
      "a lenha muda apenas de forma, sem gerar novas substâncias.",
      "a lenha se transforma em cinzas, fumaça e gases, formando novas substâncias.",
      "a lenha vai produzir calor e luminosidade, condições essenciais."
    ],
    correctAnswer: 2,
    explanation: "A combustão é uma reação química onde a matéria original se transforma em novos produtos (cinzas, CO2, etc).",
    bnccCode: "EF06CI02"
  },
  {
    text: "2. Em uma escola de São Paulo-SP, os alunos aprenderam que pilhas usadas não devem ser jogadas no lixo comum. Isso ocorre porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "pilhas são leves e não causam impacto ambiental.",
      "pilhas contêm metais pesados que podem contaminar o solo e a água.",
      "todas as pilhas são recarregáveis e nunca se estragam.",
      "o lixo comum é o local ideal para descarte de eletrônicos."
    ],
    correctAnswer: 1,
    explanation: "Metais como mercúrio, chumbo e cádmio são tóxicos e exigem descarte especializado (Logística Reversa).",
    bnccCode: "EF09CI13"
  },
  {
    text: "3. Na zona rural de Juazeiro do Norte-CE, Dona Lúcia usa panela de pressão para cozinhar feijão mais rápido. Isso acontece porque, dentro da panela:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "a pressão aumenta e a água ferve a uma temperatura mais alta.",
      "o fogo fica mais forte automaticamente.",
      "o feijão perde toda a água e cozinha sozinho.",
      "a panela impede a entrada de oxigênio, acelerando a cocção."
    ],
    correctAnswer: 0,
    explanation: "Sob maior pressão, o ponto de ebulição da água sobe acima de 100°C, transferindo calor mais rapidamente ao alimento.",
    bnccCode: "EF07CI02"
  },
  {
    text: "4. Em uma feira de ciências em Belém-PA, um grupo demonstrou que misturar vinagre e bicarbonato de sódio produz gás carbônico. Essa reação é um exemplo de:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "mudança física, pois não há formação de novas substâncias.",
      "transformação química com liberação de gás.",
      "fusão de dois líquidos.",
      "evaporação acelerada."
    ],
    correctAnswer: 1,
    explanation: "A efervescência indica uma reação ácido-base que gera um novo produto gasoso (CO2).",
    bnccCode: "EF09CI02"
  },
  {
    text: "5. Em Teresina-PI, durante o verão, os raios UV são mais intensos. Isso ocorre principalmente porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "o Sol está mais próximo da Terra nessa época.",
      "a inclinação do eixo terrestre faz os raios solares incidirem mais diretamente.",
      "as nuvens bloqueiam menos a luz artificial.",
      "o calor do asfalto reflete radiação UV."
    ],
    correctAnswer: 1,
    explanation: "As estações do ano e a intensidade solar dependem da inclinação da Terra em relação ao plano orbital.",
    bnccCode: "EF08CI13"
  },
  {
    text: "6. Na comunidade pesqueira de Cananéia-SP, os pescadores observam que a maré alta ocorre duas vezes por dia. Esse fenômeno é causado principalmente pela:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "rotação da Terra e pela gravidade da Lua.",
      "pelo fenômeno oriundo da Deriva Continental.",
      "poluição dos rios que deságuam no oceano.",
      "força dos ventos alísios."
    ],
    correctAnswer: 0,
    explanation: "As marés são resultado da atração gravitacional lunar combinada com o movimento de rotação do nosso planeta.",
    bnccCode: "EF08CI12"
  },
  {
    text: "7. Durante uma noite clara no sertão de Pernambuco, os estudantes viram a Via Láctea. Ela é visível nessa região porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "há pouca poluição luminosa.",
      "o céu é mais escuro devido à altitude.",
      "as estrelas brilham mais no Nordeste.",
      "a Lua está sempre ausente no sertão."
    ],
    correctAnswer: 0,
    explanation: "A ausência de luzes artificiais intensas permite a observação do brilho tênue das estrelas e da nossa galáxia.",
    bnccCode: "EF09CI14"
  },
  {
    text: "8. Em uma aldeia indígena no Acre, os mais velhos ensinam que certas constelações indicam a chegada do período de chuvas. Esse conhecimento tradicional está relacionado ao(a):",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "movimento aparente das estrelas causado pela rotação da Terra.",
      "distância das estrelas em relação ao Sol.",
      "cor das estrelas, que muda com o clima.",
      "brilho das estrelas, que aumenta com a umidade."
    ],
    correctAnswer: 0,
    explanation: "A posição aparente das estrelas no céu muda ao longo do ano devido à órbita da Terra, servindo como calendário natural.",
    bnccCode: "EF09CI15"
  },
  {
    text: "9. No Jardim Botânico do RJ, os alunos conheceram a Drosera (orvalhinha), que captura insetos com folhas pegajosas. Essa adaptação evolutiva é útil porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "protege a planta contra o ataque de fungos.",
      "ajuda a planta a realizar fotossíntese mais rápido.",
      "permite que a planta obtenha nutrientes como nitrogênio em solos pobres.",
      "atrai polinizadores maiores."
    ],
    correctAnswer: 2,
    explanation: "Plantas carnívoras vivem em solos deficientes; a digestão de animais supre a carência de minerais essenciais.",
    bnccCode: "EF09CI11"
  },
  {
    text: "10. No Pantanal-MS, durante a cheia, muitos peixes entram nas matas para se alimentar e reproduzir. Esse comportamento é uma adaptação ao:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "predatismo constante nas matas.",
      "ciclo sazonal de inundação e seca.",
      "aumento da temperatura da água.",
      "crescimento de algas nos rios."
    ],
    correctAnswer: 1,
    explanation: "Muitas espécies pantaneiras evoluíram para aproveitar os recursos das áreas alagadas sazonalmente.",
    bnccCode: "EF08CI16"
  },
  {
    text: "11. Em uma comunidade no Pará, o desmatamento próximo ao rio causou aumento da temperatura da água e morte de peixes. Isso demonstra que:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "árvores não têm relação com rios.",
      "o sombreamento das árvores ajuda a regular a temperatura aquática.",
      "peixes preferem água quente e morreram por acidente.",
      "o desmatamento melhora a qualidade da água."
    ],
    correctAnswer: 1,
    explanation: "A vegetação ciliar protege os rios contra a radiação direta, mantendo o equilíbrio térmico necessário à vida aquática.",
    bnccCode: "EF08CI16"
  },
  {
    text: "12. Na Caatinga, o mandacaru tem espinhos e armazena água no caule. Essas características são exemplos de:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "mutações aleatórias sem função.",
      "adaptações ao ambiente árido.",
      "doenças causadas pela seca.",
      "competição com animais domésticos."
    ],
    correctAnswer: 1,
    explanation: "O mandacaru é uma planta xerófila, com morfologia especializada para resistir a longos períodos sem chuva.",
    bnccCode: "EF09CI11"
  },
  {
    text: "13. Uma cidade em Minas Gerais debate a construção de uma usina solar. Um benefício ambiental dessa fonte de energia é que ela:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "emite grandes quantidades de CO2.",
      "não polui o ar durante a geração de eletricidade.",
      "consome muita água para funcionar.",
      "depende de combustíveis fósseis."
    ],
    correctAnswer: 1,
    explanation: "A energia fotovoltaica é considerada limpa pois não queima combustíveis nem emite gases de efeito estufa.",
    bnccCode: "EF08CI01"
  },
  {
    text: "14. Jovens Guarani usam um aplicativo para identificar plantas medicinais. Esse uso da tecnologia pode:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "substituir totalmente os saberes tradicionais.",
      "valorizar e documentar conhecimentos ancestrais.",
      "provar que os remédios caseiros não funcionam.",
      "tornar as plantas invisíveis no mato."
    ],
    correctAnswer: 1,
    explanation: "Ferramentas digitais podem atuar na preservação da memória e cultura de comunidades tradicionais.",
    bnccCode: "EF09CI05"
  },
  {
    text: "15. Eleitores em Fortaleza devem avaliar criticamente uma proposta de usina de incineração. Um ponto a considerar é:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "incineração elimina 100% dos resíduos sem impacto.",
      "a queima de lixo pode liberar substâncias tóxicas no ar.",
      "essa tecnologia não existe no Brasil.",
      "lixo orgânico vira energia limpa automaticamente."
    ],
    correctAnswer: 1,
    explanation: "A queima de resíduos requer filtragem rigorosa para evitar a emissão de dioxinas e metais pesados na atmosfera.",
    bnccCode: "EF09CI13"
  },
  {
    text: "16. Um biodigestor em uma comunidade carente transforma restos de comida em biogás. Essa tecnologia é sustentável porque:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "aumenta a poluição do solo.",
      "gera energia renovável a partir de resíduos orgânicos.",
      "exige carvão vegetal para funcionar.",
      "só funciona em grandes cidades."
    ],
    correctAnswer: 1,
    explanation: "O biogás aproveita o metano que seria perdido no lixo, gerando combustível e reduzindo o efeito estufa.",
    bnccCode: "EF08CI06"
  },
  {
    text: "17. Alunos em Porto Alegre testam se o sal afeta a ebulição da água. O que deve ser mantido IGUAL (controle), exceto a quantidade de sal?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "Volume de água, tipo de panela e fonte de calor.",
      "Cor da água e temperatura ambiente.",
      "Marca do sal e nome dos alunos.",
      "Horário do almoço."
    ],
    correctAnswer: 0,
    explanation: "Em um experimento controlado, apenas a variável independente (sal) deve mudar; as demais devem ser constantes.",
    bnccCode: "EF07CI04"
  },
  {
    text: "18. Júlia notou que o leite azeda mais rápido no verão. A hipótese científica mais adequada é:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "leite estraga mais rápido no calor porque microrganismos se reproduzem mais rapidamente.",
      "leite de vaca não gosta de calor.",
      "o verão tem mais moscas, e elas estragam o leite.",
      "as embalagens de leite derretem no verão."
    ],
    correctAnswer: 0,
    explanation: "O calor acelera o metabolismo bacteriano, provocando a fermentação ácida do leite mais cedo.",
    bnccCode: "EF09CI01"
  },
  {
    text: "19. Alunos em Salvador mediram o pH da chuva e obtiveram valor 5,2. Isso indica que a chuva é:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "neutra, como a água pura.",
      "básica, por causa do mar.",
      "ácida, possivelmente por poluentes atmosféricos.",
      "salgada, por influência do oceano."
    ],
    correctAnswer: 2,
    explanation: "Um pH abaixo de 7 indica acidez. Gases de combustão industrial podem tornar a chuva ácida (pH < 5,6).",
    bnccCode: "EF07CI13"
  },
  {
    text: "20. Para provar cientificamente que 'Plantas crescem melhor com música', um aluno em Recife deve:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "tocar música para uma planta e acreditar que cresceu mais.",
      "comparar plantas com e sem música, mantendo iguais luz, água e solo.",
      "perguntar aos professores o que eles acham.",
      "usar apenas plantas artificiais."
    ],
    correctAnswer: 1,
    explanation: "O método científico exige um grupo de controle para validar a influência de um único fator testado.",
    bnccCode: "EF07CI15"
  },
  {
    text: "21. A eliminação de criadouros de mosquitos em Manaus-AM para evitar a dengue é um exemplo de:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "tratamento de doenças crônicas.",
      "prevenção de doenças infecciosas.",
      "cura por remédios caseiros.",
      "vacinação obrigatória."
    ],
    correctAnswer: 1,
    explanation: "Combater o vetor (Aedes aegypti) é a principal medida de profilaxia contra arboviroses.",
    bnccCode: "EF07CI09"
  },
  {
    text: "22. Qual a atitude mais responsável diante da afirmação 'alho cura a COVID-19'?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "compartilhar imediatamente com todos.",
      "consumir grandes quantidades de alho todos os dias.",
      "buscar informações em fontes científicas confiáveis.",
      "acreditar porque foi postado por um parente."
    ],
    correctAnswer: 2,
    explanation: "O pensamento crítico e a verificação de fontes oficiais evitam riscos à saúde pública.",
    bnccCode: "EF07CI09"
  },
  {
    text: "23. Cidadãos em Goiás notam uma fábrica despejando resíduos no rio. Como moradores conscientes, devem:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "ignorar o problema para não causar conflito.",
      "consumir os alimentos sem se preocupar.",
      "denunciar o despejo aos órgãos ambientais.",
      "beber mais água do rio para testar."
    ],
    correctAnswer: 2,
    explanation: "A fiscalização participativa é um dever cidadão para a proteção dos bens comuns ambientais.",
    bnccCode: "EF08CI16"
  },
  {
    text: "24. Discutir fake news sobre vacinas na escola mostra a importância de:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "acreditar em tudo que é divulgado por celebridades.",
      "buscar informações em fontes confiáveis e científicas.",
      "parar de usar redes sociais.",
      "substituir vacinas por chás medicinais."
    ],
    correctAnswer: 1,
    explanation: "As vacinas passam por rigorosos testes clínicos antes de serem liberadas à população.",
    bnccCode: "EF07CI10"
  },
  {
    text: "25. No Amazonas, agrotóxicos contaminam peixes. Uma solução sustentável seria:",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "continuar usando agrotóxicos em maior quantidade.",
      "substituir agrotóxicos por controle biológico e práticas agroecológicas.",
      "pescar mais peixes para compensar.",
      "desmatar mais áreas para ampliar lavouras."
    ],
    correctAnswer: 1,
    explanation: "A agroecologia busca o equilíbrio produtivo sem degradar os ecossistemas circundantes.",
    bnccCode: "EF09CI13"
  },
  {
    text: "26. Por que a frase 'energia elétrica não se gasta, só se transforma' está correta?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [
      "a energia pode ser criada e destruída livremente.",
      "a energia se conserva, mas pode se transformar em formas menos úteis (calor).",
      "aparelhos desligados continuam consumindo muito.",
      "energia elétrica desaparece quando a luz é apagada."
    ],
    correctAnswer: 1,
    explanation: "Pela Primeira Lei da Termodinâmica, a energia total de um sistema isolado é constante.",
    bnccCode: "EF08CI03"
  }
];
