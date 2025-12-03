import { GoogleGenAI, Type } from "@google/genai";
import { LessonContent, QuestionType, Skill, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLessonContent = async (skill: Skill, userGrade: number): Promise<LessonContent> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Crie uma atividade educativa curta para alunos do ${userGrade}º ano do ensino fundamental no Brasil.
    Habilidade BNCC: ${skill.code} - ${skill.description}.
    Tópico: ${skill.topic}.
    
    A atividade deve ter:
    1. Uma introdução curta e divertida (máx 200 caracteres) explicando o conceito.
    2. 4 questões objetivas variadas (Múltipla escolha ou Verdadeiro/Falso).
    
    O tom deve ser encorajador e gamificado, similar ao Duolingo.
    Adapte a linguagem para ser acessível e inclusiva.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intro: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: [QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE] },
                  text: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "type", "text", "correctAnswer", "explanation"]
              }
            }
          },
          required: ["intro", "questions"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as LessonContent;
    }
    throw new Error("No content generated");
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback content in case of API failure or quota limits
    return {
      intro: "Ops! Não conseguimos conectar com o laboratório de IA agora. Tente novamente mais tarde.",
      questions: [
        {
          id: "error-1",
          type: QuestionType.MULTIPLE_CHOICE,
          text: "Qual é a capital do Brasil? (Pergunta de teste devido a erro)",
          options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
          correctAnswer: "Brasília",
          explanation: "Brasília é a capital federal."
        }
      ]
    };
  }
};

export const generateFinalTest = async (grade: number): Promise<Question[]> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Crie um teste final com 10 questões para alunos do ${grade}º ano de Ciências.
    Estilo: PISA (foco em interpretação de texto, gráficos hipotéticos e aplicação do conhecimento).
    Abrangendo todo o currículo do ${grade}º ano de Ciências da Natureza BNCC.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, enum: [QuestionType.MULTIPLE_CHOICE] },
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["id", "type", "text", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Question[];
    }
    throw new Error("No test generated");
  } catch (error) {
    console.error(error);
    return [];
  }
};