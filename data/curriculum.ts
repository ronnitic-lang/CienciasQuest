import { Skill } from '../types';

export const SKILLS: Skill[] = [
  // 5th Grade Revision (for 6th graders)
  {
    id: 'EF05CI01',
    code: 'EF05CI01',
    description: 'Explorar fenômenos que evidenciem propriedades físicas dos materiais.',
    topic: 'Propriedades dos Materiais (Revisão)',
    grade: 6,
    isRevision: true
  },
  {
    id: 'EF05CI02',
    code: 'EF05CI02',
    description: 'Aplicar conhecimentos sobre as mudanças de estado físico da água.',
    topic: 'Ciclo da Água (Revisão)',
    grade: 6,
    isRevision: true
  },
  
  // 6th Grade
  {
    id: 'EF06CI01',
    code: 'EF06CI01',
    description: 'Classificar como homogênea ou heterogênea a mistura de dois ou mais materiais.',
    topic: 'Misturas e Substâncias',
    grade: 6
  },
  {
    id: 'EF06CI02',
    code: 'EF06CI02',
    description: 'Identificar evidências de transformações químicas.',
    topic: 'Transformações Químicas',
    grade: 6
  },
  {
    id: 'EF06CI05',
    code: 'EF06CI05',
    description: 'Explicar a organização básica das células e seu papel nos seres vivos.',
    topic: 'Célula como unidade da vida',
    grade: 6
  },

  // 7th Grade
  {
    id: 'EF07CI01',
    code: 'EF07CI01',
    description: 'Discutir a aplicação de máquinas simples no cotidiano.',
    topic: 'Máquinas Simples',
    grade: 7
  },
  {
    id: 'EF07CI07',
    code: 'EF07CI07',
    description: 'Caracterizar os principais ecossistemas brasileiros.',
    topic: 'Diversidade da Vida',
    grade: 7
  },

  // 8th Grade
  {
    id: 'EF08CI01',
    code: 'EF08CI01',
    description: 'Identificar e classificar diferentes fontes de energia.',
    topic: 'Fontes de Energia',
    grade: 8
  },

  // 9th Grade
  {
    id: 'EF09CI04',
    code: 'EF09CI04',
    description: 'Planejar e executar experimentos que evidenciem a emissão de radiações.',
    topic: 'Radiações',
    grade: 9
  },
  {
    id: 'EF09CI10',
    code: 'EF09CI10',
    description: 'Comparar as ideias evolucionistas de Lamarck e Darwin.',
    topic: 'Evolução',
    grade: 9
  }
];

export const getSkillsForGrade = (grade: number) => {
  return SKILLS.filter(s => s.grade === grade);
};