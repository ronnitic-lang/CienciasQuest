
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateQuestions } from '../services/geminiService';
import { Question, QuestionType } from '../types';
import { MOCK_UNITS } from '../constants';
import { ArrowRight, CheckCircle, XCircle, RefreshCw, Trophy, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Mascot from '../components/Mascot';

// Função para embaralhar alternativas e retornar novo índice correto
const shuffleOptions = (question: Question): Question => {
    const options = [...question.options];
    const correctText = options[question.correctAnswer as number];
    
    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    const newCorrectIdx = options.findIndex(opt => opt === correctText);
    
    return {
        ...question,
        options,
        correctAnswer: newCorrectIdx
    };
};

const Quiz: React.FC = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const { addXp, user } = useAuth();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const unit = MOCK_UNITS.find(u => u.id === unitId);
  const isPisa = unit?.type === 'exam';
  const isReview = unit?.type === 'review';

  useEffect(() => {
    const loadQuiz = async () => {
      if (unit) {
        setLoading(true);
        // Busca questões baseadas no tipo (IA, Banco PISA ou Banco de Revisão)
        const rawQuestions = await generateQuestions(unit.description, unit.grade, unit.type || 'standard');
        
        // Aplica embaralhamento de alternativas para cada questão (Anti-Cola)
        const shuffled = rawQuestions.map(q => shuffleOptions(q));
        
        setQuestions(shuffled);
        setLoading(false);
      }
    };
    loadQuiz();
  }, [unit]);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === questions[currentIdx].correctAnswer) {
        setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      const finalXp = score * (isPisa ? 20 : 10); // Prova PISA dá o dobro de XP
      addXp(finalXp);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Mascot size={200} />
        <p className="text-xl font-black text-gray-700">
          {isPisa ? 'Carregando Simulado PISA 2025...' : isReview ? 'Preparando revisão do 5º Ano...' : 'A Coruja está preparando suas questões...'}
        </p>
        <p className="text-sm text-gray-400 font-bold max-w-xs text-center">
            {isPisa ? 'Prepare-se! Este teste avalia habilidades complexas de interpretação científica.' : isReview ? 'Vamos relembrar os conceitos fundamentais para começar o 6º ano com tudo!' : 'Usando IA para gerar conteúdo único baseado na BNCC.'}
        </p>
      </div>
    );
  }

  if (showResult) {
     const performance = (score / questions.length) * 100;
     return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${performance >= 70 ? 'bg-yellow-100 text-yellow-500' : 'bg-blue-100 text-primary'}`}>
                {performance >= 70 ? <Trophy size={48} /> : <CheckCircle size={48} />}
            </div>
            
            <h2 className="text-4xl font-black text-gray-800">
                {isPisa ? 'Simulado PISA Concluído!' : isReview ? 'Revisão Finalizada!' : 'Missão Cumprida!'}
            </h2>
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-gray-100 w-full max-w-md space-y-4">
                <div className="flex justify-between items-center">
                    <span className="font-black text-gray-400 uppercase text-xs tracking-widest">Desempenho</span>
                    <span className="font-black text-2xl text-primary">{score}/{questions.length}</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: `${performance}%` }} />
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-black text-gray-400 uppercase text-xs tracking-widest">XP de Recompensa</span>
                    <span className="font-black text-2xl text-yellow-500">+{score * (isPisa ? 20 : 10)} XP</span>
                </div>
            </div>

            <button 
               onClick={() => navigate('/dashboard')}
               className="w-full max-w-md bg-secondary hover:bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-green-700 transition-all active:translate-y-1"
            >
                VOLTAR PARA A TRILHA
            </button>
        </div>
     );
  }

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto pb-32">
      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 font-black text-sm">SAIR</button>
        <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden border border-gray-100">
            <div 
                className="bg-secondary h-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
            />
        </div>
        <span className="font-black text-gray-400 text-sm">{currentIdx + 1}/{questions.length}</span>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 animate-fade-in">
        <div className="flex flex-wrap gap-2 mb-4">
            {isPisa && <span className="inline-block bg-accent/20 text-yellow-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Simulado PISA</span>}
            {isReview && <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Revisão Inicial</span>}
            {currentQ.bnccCode && <span className="inline-block bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{currentQ.bnccCode}</span>}
        </div>
        <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-8 leading-tight">{currentQ.text}</h2>
        
        <div className="space-y-4">
          {currentQ.options.map((option, idx) => {
             let stateClass = "border-gray-100 hover:bg-gray-50 bg-white";
             const letters = ['A', 'B', 'C', 'D'];
             
             if (selectedOption === idx) {
                 stateClass = "border-primary bg-blue-50 text-blue-700 ring-2 ring-primary/20";
             }

             if (isAnswered) {
                 if (idx === currentQ.correctAnswer) {
                     stateClass = "border-secondary bg-green-50 text-secondary ring-2 ring-secondary/20";
                 } else if (idx === selectedOption) {
                     stateClass = "border-red-500 bg-red-50 text-red-600 ring-2 ring-red-500/20";
                 } else {
                     stateClass = "border-gray-50 opacity-40 grayscale pointer-events-none";
                 }
             }

             return (
                <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center gap-4 ${stateClass}`}
                >
                    <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-black text-sm border-2 ${selectedOption === idx ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                        {letters[idx]}
                    </span>
                    <span className="flex-1">{option}</span>
                </button>
             );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 border-t bg-white/80 backdrop-blur-md z-50 transition-all duration-300 ${isAnswered ? 'h-48' : 'h-24'}`}>
         <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {isAnswered && (
                <div className={`flex-1 w-full p-4 rounded-2xl animate-fade-in ${selectedOption === currentQ.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        {selectedOption === currentQ.correctAnswer ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        <span className="font-black uppercase text-xs tracking-widest">
                            {selectedOption === currentQ.correctAnswer ? 'Excelente!' : 'Não foi dessa vez'}
                        </span>
                    </div>
                    {currentQ.explanation && <p className="text-[11px] font-bold opacity-80 leading-tight">{currentQ.explanation}</p>}
                </div>
            )}
            
            <button
                onClick={isAnswered ? handleNext : handleCheck}
                disabled={selectedOption === null}
                className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black text-white shadow-xl border-b-8 transition-all active:translate-y-1 active:border-b-4
                    ${isAnswered 
                        ? (selectedOption === currentQ.correctAnswer ? 'bg-secondary border-green-700' : 'bg-red-500 border-red-700') 
                        : 'bg-primary border-blue-700 disabled:opacity-50 disabled:grayscale'
                    }
                `}
            >
                {isAnswered ? (currentIdx === questions.length - 1 ? 'FINALIZAR' : 'PRÓXIMA') : 'VERIFICAR'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default Quiz;
