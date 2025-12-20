
import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType } from "../types";
import { PISA_EXAM_6, PISA_EXAM_7, PISA_EXAM_8 } from "../constants/pisaQuestions";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

  try {
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

    const jsonStr = response.text?.trim() || '[]';
    const data = JSON.parse(jsonStr);
    
    return data.map((q: any, i: number) => ({
      ...q,
      id: `gen-${Date.now()}-${i}`,
      type: QuestionType.MULTIPLE_CHOICE
    }));
  } catch (error) {
    console.error("Erro ao gerar questões:", error);
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
};

export const generateMascotImage = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          text: "A friendly, intelligent owl mascot for a science education app called CienciasQuest. The owl is wearing a small white lab coat and glasses, holding a glowing green test tube. Modern flat 2D vector style, vibrant blue and green colors, simple minimalist character design, isolated on a solid pure white background.",
        },
      ],
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return '';
  } catch (error) {
    console.error("Erro ao gerar mascote:", error);
    return ''; // Fallback para vazio ou ícone
  }
};
