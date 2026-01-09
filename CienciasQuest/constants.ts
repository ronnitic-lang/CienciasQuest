
import { Unit, AvatarConfig } from './types';

// Palette for units
const COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500'
];

export const CLASSES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
export const SHIFTS = ['Manhã', 'Tarde', 'Integral'];

export const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const BRAZIL_CITIES: Record<string, string[]> = {
  'CE': ['Caucaia', 'Fortaleza', 'Maracanaú', 'Sobral', 'Juazeiro do Norte'],
  'SP': ['São Paulo', 'Campinas', 'Santos'],
  'RJ': ['Rio de Janeiro', 'Niterói'],
};

export const MOCK_SCHOOLS = [
  'Escola Municipal Paulo Freire',
  'Colégio Estadual Tiradentes',
  'Centro Educacional Inovação',
  'Escola Cora Coralina'
];

const getCurriculum = (): Unit[] => {
  const units: Unit[] = [];
  const addGrade = (grade: number, reviewDesc: string, topics: { code: string, title: string }[]) => {
    units.push({
      id: `g${grade}-rev`,
      title: 'Revisão Inicial',
      description: reviewDesc,
      grade: grade,
      bnccCodes: [],
      isLocked: false,
      color: 'bg-yellow-500',
      type: 'review'
    });

    topics.forEach((topic, index) => {
      // Adiciona Gincana a cada bimestre (estimado por blocos de 4-5 habilidades)
      if (index > 0 && index % 5 === 0) {
          const bimester = Math.ceil(index / 5) as 1 | 2 | 3 | 4;
          if (bimester <= 4) {
            units.push({
              id: `g${grade}-gincana-${bimester}`,
              title: `GINCANA ${bimester}º BIMESTRE`,
              description: `Desafio Passa ou Repassa: Matéria, Vida e Universo!`,
              grade: grade,
              bnccCodes: [],
              isLocked: true,
              color: 'bg-purple-600',
              type: 'gincana',
              bimester
            });
          }
      }

      units.push({
        id: `g${grade}-${topic.code}`,
        title: topic.code,
        description: topic.title,
        grade: grade,
        bnccCodes: [topic.code],
        isLocked: true,
        color: COLORS[index % COLORS.length],
        type: 'standard'
      });
    });

    units.push({
        id: `g${grade}-final`,
        title: 'Desafio Final',
        description: `Teste PISA - ${grade}º Ano`,
        grade: grade,
        bnccCodes: [],
        isLocked: true,
        color: 'bg-red-600',
        type: 'exam'
    });
  };

  addGrade(6, 'Revisão de habilidades do 5º Ano (EF05CI01 a EF05CI13)', [
    { code: 'EF06CI01', title: 'Tipos de misturas' },
    { code: 'EF06CI02', title: 'Reações químicas' },
    { code: 'EF06CI03', title: 'Separação de misturas' },
    { code: 'EF06CI04', title: 'Materiais sintéticos' },
    { code: 'EF06CI05', title: 'Teoria celular' },
    { code: 'EF06CI06', title: 'Níveis de organização' },
    { code: 'EF06CI07', title: 'Sistema nervoso' },
    { code: 'EF06CI08', title: 'Visão humana' },
    { code: 'EF06CI09', title: 'Sistema muscular e esquelético' },
    { code: 'EF06CI10', title: 'Drogas' },
    { code: 'EF06CI11', title: 'Camadas da Terra' },
    { code: 'EF06CI12', title: 'Tipos de rochas' },
    { code: 'EF06CI13', title: 'Esfericidade da Terra' },
    { code: 'EF06CI14', title: 'Movimentos da Terra' },
    { code: 'EF06CI15CA', title: 'Importância do solo' },
    { code: 'EF06CI16CA', title: 'Hidrosfera' },
    { code: 'EF06CI17CA', title: 'Biosfera' },
    { code: 'EF06CI18CA', title: 'Estações de tratamento de água e esgoto' },
  ]);

  addGrade(7, 'Revisão de habilidades do 6º Ano', [
    { code: 'EF07CI01', title: 'Máquinas simples' },
    { code: 'EF07CI02', title: 'Temperatura e calor' },
    { code: 'EF07CI03', title: 'Formas de propagação de calor' },
    { code: 'EF07CI04', title: 'Equilíbrio termodinâmico' },
    { code: 'EF07CI05', title: 'Tipos de combustíveis e máquinas' },
    { code: 'EF07CI06', title: 'Modos de produção' },
    { code: 'EF07CI07', title: 'Biomas brasileiros' },
    { code: 'EF07CI08', title: 'Catástrofes naturais' },
    { code: 'EF07CI09', title: 'Condições de saúde' },
    { code: 'EF07CI10', title: 'História da vacina' },
    { code: 'EF07CI11', title: 'História da Tecnologia' },
    { code: 'EF07CI12', title: 'Atmosfera terrestre' },
    { code: 'EF07CI13', title: 'Efeito estufa' },
    { code: 'EF07CI14', title: 'Camada de ozônio' },
    { code: 'EF07CI15', title: 'Fenômenos naturais' },
    { code: 'EF07CI16', title: 'Deriva continental' },
    { code: 'EF07CI17CA', title: 'Os cinco reinos' },
  ]);

  addGrade(8, 'Revisão de habilidades do 7º Ano', [
    { code: 'EF08CI01', title: 'Fontes de energias' },
    { code: 'EF08CI02', title: 'Circuitos elétricos' },
    { code: 'EF08CI03', title: 'Transformações da energia' },
    { code: 'EF08CI04', title: 'Consumo da energia elétrica' },
    { code: 'EF08CI05', title: 'Uso consciente da energia elétrica' },
    { code: 'EF08CI06', title: 'Meios de produção de energia elétrica' },
    { code: 'EF08CI07', title: 'Tipos de reprodução' },
    { code: 'EF08CI08', title: 'Sexualidade' },
    { code: 'EF08CI09', title: 'Saúde reprodutiva' },
    { code: 'EF08CI10', title: 'ISTs' },
    { code: 'EF08CI11', title: 'Diversidade sexual' },
    { code: 'EF08CI12', title: 'Os eclipses' },
    { code: 'EF08CI13', title: 'Movimentos da Terra' },
    { code: 'EF08CI14', title: 'Oscilações climáticas' },
    { code: 'EF08CI15', title: 'Previsão do tempo' },
    { code: 'EF08CI16', title: 'Equilíbrio ambiental e mudanças climáticas' },
    { code: 'EF08CI17CE', title: 'Saúde individual e coletiva' },
  ]);

  addGrade(9, 'Revisão de habilidades do 8º Ano', [
    { code: 'EF09CI01', title: 'Mudanças dos estados físicos' },
    { code: 'EF09CI02', title: 'Tipos de reações químicas' },
    { code: 'EF09CI03', title: 'O átomo' },
    { code: 'EF09CI04', title: 'Composição da luz branca' },
    { code: 'EF09CI05', title: 'Meios de comunicação' },
    { code: 'EF09CI06', title: 'Uso da radiação eletromagnética' },
    { code: 'EF09CI07', title: 'A radiação medicinal' },
    { code: 'EF09CI08', title: 'A descoberta dos gametas' },
    { code: 'EF09CI09', title: 'Leis da hereditariedade' },
    { code: 'EF09CI10', title: 'Evolução' },
    { code: 'EF09CI11', title: 'Adaptação e Seleção Natural' },
    { code: 'EF09CI12', title: 'Unidades de conservação' },
    { code: 'EF09CI13', title: 'Consumo consciente e sustentabilidade' },
    { code: 'EF09CI14', title: 'Composição e localização dos astros celestiais' },
    { code: 'EF09CI15', title: 'A história da astronomia' },
    { code: 'EF09CI16', title: 'Vida humana fora da Terra' },
    { code: 'EF09CI17', title: 'O ciclo de vida do Sol e de outras estrelas' },
    { code: 'EF09CI18CE', title: '1ª Lei de Newton e a Gravidade' },
    { code: 'EF09CI19CE', title: 'Biotecnologia' },
  ]);

  return units;
};

export const MOCK_UNITS: Unit[] = getCurriculum();

export const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: '#F5D0C5',
  accessory: 'none',
  clothing: 'tshirt',
  hairColor: '#4A4A4A',
  hairStyle: 'short',
  headwear: 'none'
};
