import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType } from "../types";
import { PISA_EXAM_6, PISA_EXAM_7, PISA_EXAM_8 } from "../constants/pisaQuestions";

const cleanJson = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const generateQuestions = async (topic: string, grade: number, isExam: boolean = false): Promise<Question[]> => {
  if (isExam) {
    let bank: Omit<Question, 'id'>[] = [];
    if (grade === 6) bank = PISA_EXAM_6;
    else if (grade === 7) bank = PISA_EXAM_7;
    else if (grade === 8) bank = PISA_EXAM_8;
    else bank = PISA_EXAM_8;

    return bank.map((q, i) => ({
      ...q,
      id: `pisa-${grade}-${i}`
    }));
  }

  // O Vite substituirá process.env.API_KEY pelo valor real durante o build
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API_KEY não encontrada. Usando questões de demonstração.");
    return [
      {
        id: 'mock-1',
        text: 'Qual é a unidade básica estrutural de todos os seres vivos?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Átomo', 'Célula', 'Órgão', 'Tecido'],
        correctAnswer: 1,
        explanation: 'A célula é a unidade fundamental da vida, capaz de realizar todas as funções vitais.'
      }
    ];
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Como um especialista em pedagogia de Ciências, crie 5 questões de múltipla escolha sobre ${topic} para alunos do ${grade}º ano. Siga rigorosamente a BNCC e retorne em formato JSON.`;

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

    const data = JSON.parse(cleanJson(response.text || '[]'));
    return data.map((q: any, i: number) => ({
      ...q,
      id: `gen-${Date.now()}-${i}`,
      type: QuestionType.MULTIPLE_CHOICE
    }));
  } catch (error) {
    console.error("Erro ao gerar questões:", error);
    return [];
  }
};