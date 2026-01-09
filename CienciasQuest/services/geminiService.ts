
import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType } from "../types";
import { PISA_EXAM_6, PISA_EXAM_7, PISA_EXAM_8, PISA_EXAM_9 } from "../constants/pisaQuestions";
import { REVISION_5TH_GRADE_BANK, REVISION_6TH_GRADE_BANK, REVISION_7TH_GRADE_BANK, REVISION_8TH_GRADE_BANK } from "../constants/revisionQuestions";
import { GRADE_6_BANK } from "../constants/grade6Questions";
import { GRADE_7_BANK } from "../constants/grade7Questions";
import { GRADE_8_BANK } from "../constants/grade8Questions";
import { GRADE_9_BANK } from "../constants/grade9Questions";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Updated type parameter to include 'gincana'
export const generateQuestions = async (topic: string, grade: number, type: 'review' | 'standard' | 'exam' | 'gincana', bnccCode?: string): Promise<Question[]> => {
  // 1. Caso seja a Revisão Inicial
  if (type === 'review') {
    if (grade === 6) {
        return REVISION_5TH_GRADE_BANK.map((q, i) => ({ ...q, id: `rev-5g-${i}` }));
    }
    if (grade === 7) {
        return REVISION_6TH_GRADE_BANK.map((q, i) => ({ ...q, id: `rev-6g-${i}` }));
    }
    if (grade === 8) {
        return REVISION_7TH_GRADE_BANK.map((q, i) => ({ ...q, id: `rev-7g-${i}` }));
    }
    if (grade === 9) {
        return REVISION_8TH_GRADE_BANK.map((q, i) => ({ ...q, id: `rev-8g-${i}` }));
    }
  }

  // 2. Caso seja Simulado PISA (Exames)
  if (type === 'exam') {
    let bank: Omit<Question, 'id'>[] = [];
    if (grade === 6) bank = PISA_EXAM_6;
    else if (grade === 7) bank = PISA_EXAM_7;
    else if (grade === 8) bank = PISA_EXAM_8;
    else if (grade === 9) bank = PISA_EXAM_9;
    else bank = PISA_EXAM_9;

    return bank.map((q, i) => ({
      ...q,
      id: `pisa-${grade}-${i}`
    }));
  }

  // 3. Casos de Banco Fixo por Série e Habilidade
  if (bnccCode) {
    let specificBank: Record<string, Omit<Question, 'id'>[]> | null = null;
    
    if (grade === 6) specificBank = GRADE_6_BANK;
    else if (grade === 7) specificBank = GRADE_7_BANK;
    else if (grade === 8) specificBank = GRADE_8_BANK;
    else if (grade === 9) specificBank = GRADE_9_BANK;

    if (specificBank && specificBank[bnccCode]) {
      return specificBank[bnccCode].map((q, i) => ({
        ...q,
        id: `g${grade}-fixed-${bnccCode}-${i}`
      }));
    }
  }

  // 4. Caso padrão: Gerar via IA Gemini (usado para 'standard' e 'gincana')
  try {
    const prompt = `Como um especialista em pedagogia de Ciências da Natureza, crie 10 questões de múltipla escolha fáceis (objetivas, 4 alternativas) sobre a habilidade BNCC ${bnccCode || topic} para alunos do ${grade}º ano. O objetivo é preparar o aluno para a aula do dia seguinte. Retorne em formato JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.NUMBER },
              explanation: { type: Type.STRING }
            },
            required: ["text", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const jsonStr = response.text?.trim() || '[]';
    const data = JSON.parse(jsonStr);
    
    return data.map((q: any, i: number) => ({
      ...q,
      id: `gen-${Date.now()}-${i}`,
      type: QuestionType.MULTIPLE_CHOICE,
      bnccCode: bnccCode
    }));
  } catch (error) {
    console.error("Erro ao gerar questões:", error);
    return [
      {
        id: 'mock-1',
        text: 'Qual é a unidade fundamental da vida?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Átomo', 'Célula', 'Órgão', 'Molécula'],
        correctAnswer: 1,
        explanation: 'A célula é a menor unidade funcional dos seres vivos.'
      }
    ];
  }
};
