import React, { useState, useEffect } from 'react';
import { generateLessonContent } from '../services/geminiService';
import { Skill, LessonContent, Question } from '../types';

interface LessonProps {
  skill: Skill;
  grade: number;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const Lesson: React.FC<LessonProps> = ({ skill, grade, onComplete, onExit }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const data = await generateLessonContent(skill, grade);
      setContent(data);
      setLoading(false);
    };
    fetchContent();
  }, [skill, grade]);

  const handleCheck = () => {
    if (!content || !selectedOption) return;
    const currentQ = content.questions[currentQuestionIndex];
    const correct = selectedOption === currentQ.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (!content) return;
    if (currentQuestionIndex < content.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // Finished
      onComplete(score);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 space-y-4">
        <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">O Laboratório de IA está preparando sua missão...</p>
      </div>
    );
  }

  if (!content) return <div>Erro ao carregar.</div>;

  const currentQ = content.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / content.questions.length) * 100;

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b">
        <button onClick={onExit} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
           <div className="h-full bg-brand transition-all duration-500" style={{width: `${progress}%`}}></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {currentQuestionIndex === 0 && !selectedOption && !showFeedback && (
            <div className="mb-6 bg-blue-50 p-4 rounded-xl text-blue-800 border border-blue-100 shadow-sm">
                <h3 className="font-bold mb-1">Missão: {skill.topic}</h3>
                <p>{content.intro}</p>
            </div>
        )}

        <h2 className="text-xl font-bold text-gray-800 mb-6">{currentQ.text}</h2>

        <div className="space-y-3">
            {currentQ.options?.map((opt, idx) => (
                <button
                    key={idx}
                    onClick={() => !showFeedback && setSelectedOption(opt)}
                    disabled={showFeedback}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                        selectedOption === opt 
                            ? showFeedback 
                                ? isCorrect ? 'bg-green-100 border-green-500 text-green-900' : 'bg-red-100 border-red-500 text-red-900'
                                : 'bg-blue-100 border-blue-500 text-blue-900'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {opt}
                </button>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-6 border-t ${showFeedback ? (isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200') : 'bg-white'}`}>
        {showFeedback ? (
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    {isCorrect 
                        ? <span className="text-green-700 font-bold text-lg">Correto!</span> 
                        : <span className="text-red-700 font-bold text-lg">Ops, não foi dessa vez.</span>
                    }
                </div>
                {!isCorrect && (
                     <div className="text-red-800 text-sm bg-white/50 p-2 rounded">
                        <span className="font-semibold">Resposta correta:</span> {currentQ.correctAnswer}
                        <p className="mt-1">{currentQ.explanation}</p>
                     </div>
                )}
            </div>
        ) : null}
        
        <button 
            onClick={showFeedback ? handleNext : handleCheck}
            disabled={!selectedOption}
            className={`w-full py-3 rounded-xl font-bold text-lg shadow-b-md transition-all active:translate-y-1 ${
                selectedOption 
                    ? showFeedback
                        ? isCorrect ? 'bg-green-500 hover:bg-green-600 text-white border-green-600 border-b-4' : 'bg-red-500 hover:bg-red-600 text-white border-red-600 border-b-4'
                        : 'bg-brand hover:bg-brand-dark text-white border-brand-dark border-b-4' 
                    : 'bg-gray-200 text-gray-400 border-gray-300 border-b-4 cursor-not-allowed'
            }`}
        >
            {showFeedback ? (currentQuestionIndex === content.questions.length - 1 ? 'Finalizar' : 'Continuar') : 'Verificar'}
        </button>
      </div>
    </div>
  );
};

export default Lesson;