
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateQuestions } from '../services/geminiService';
import { Question, QuestionType } from '../types';
import { MOCK_UNITS } from '../constants';
import { ArrowRight, CheckCircle, XCircle, RefreshCw, Trophy, BrainCircuit, Zap, Users, Timer } from 'lucide-react';
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
  
  // Gincana States
  const [teamScoreA, setTeamScoreA] = useState(0);
  const [teamScoreB, setTeamScoreB] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const unit = MOCK_UNITS.find(u => u.id === unitId);
  const isPisa = unit?.type === 'exam';
  const isReview = unit?.type === 'review';
  const isGincana = unit?.type === 'gincana';

  useEffect(() => {
    const loadQuiz = async () => {
      if (unit) {
        setLoading(true);
        // Busca questões baseadas no tipo e código BNCC (IA ou Banco Fixo)
        const rawQuestions = await generateQuestions(
            unit.description, 
            unit.grade, 
            unit.type || 'standard',
            unit.title.startsWith('EF') ? unit.title : undefined 
        );
        
        // Aplica embaralhamento de alternativas para cada questão (Anti-Cola)
        const shuffled = rawQuestions.map(q => shuffleOptions(q));
        
        setQuestions(shuffled);
        setLoading(false);
      }
    };
    loadQuiz();
  }, [unit]);

  // Timer para Gincana
  useEffect(() => {
      if (isGincana && !isAnswered && !loading && !showResult) {
          const timer = setInterval(() => {
              setTimeLeft(prev => {
                  if (prev <= 1) {
                      handleCheck(); // Autocheck se o tempo acabar
                      return 30;
                  }
                  return prev - 1;
              });
          }, 1000);
          return () => clearInterval(timer);
      }
  }, [isGincana, isAnswered, loading, showResult]);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleCheck = () => {
    if (selectedOption === null && isGincana) {
        setIsAnswered(true);
        setTeamScoreB(prev => prev + 10); // Adversário ganha pontos se você não responder
        return;
    }
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    if (selectedOption === questions[currentIdx].correctAnswer) {
        setScore(prev => prev + 1);
        if (isGincana) setTeamScoreA(prev => prev + 15);
    } else {
        if (isGincana) setTeamScoreB(prev => prev + 10);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      setShowResult(true);
      const finalXp = score * (isPisa ? 20 : isGincana ? 15 : 10);
      addXp(finalXp);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className={`animate-bounce p-4 rounded-full ${isGincana ? 'bg-purple-100' : 'bg-blue-100'}`}>
            {isGincana ? <Zap size={80} className="text-purple-600" fill="currentColor"/> : <BrainCircuit size={80} className="text-primary"/>}
        </div>
        <p className="text-xl font-black text-gray-700 text-center px-4 uppercase tracking-tighter">
          {isPisa ? 'Preparando Simulado PISA...' : isReview ? 'Iniciando Revisão do 5º Ano...' : isGincana ? 'AQUECENDO PARA A GINCANA!' : `Carregando Atividade: ${unit?.title}`}
        </p>
      </div>
    );
  }

  if (showResult) {
     const performance = (score / questions.length) * 100;
     const userWonGincana = teamScoreA >= teamScoreB;

     return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${performance >= 70 ? 'bg-yellow-100 text-yellow-500' : 'bg-blue-100 text-primary'}`}>
                {performance >= 70 ? <Trophy size={48} /> : <CheckCircle size={48} />}
            </div>
            
            <h2 className="text-4xl font-black text-gray-800 px-4">
                {isGincana ? (userWonGincana ? 'VITÓRIA DA EQUIPE ÁTOMO!' : 'EQUIPE CÉLULA VENCEU!') : 'Atividade Concluída!'}
            </h2>
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-gray-100 w-full max-w-md space-y-4 mx-4">
                {isGincana && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
                            <p className="text-[10px] font-black text-blue-400">EQUIPE ÁTOMO</p>
                            <p className="text-3xl font-black text-primary">{teamScoreA}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-100">
                            <p className="text-[10px] font-black text-red-400">EQUIPE CÉLULA</p>
                            <p className="text-3xl font-black text-red-500">{teamScoreB}</p>
                        </div>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <span className="font-black text-gray-400 uppercase text-xs tracking-widest">Seus Acertos</span>
                    <span className="font-black text-2xl text-primary">{score}/{questions.length}</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: `${performance}%` }} />
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-black text-gray-400 uppercase text-xs tracking-widest">XP Ganho</span>
                    <span className="font-black text-2xl text-yellow-500">+{score * (isPisa ? 20 : isGincana ? 15 : 10)} XP</span>
                </div>
            </div>

            <button 
               onClick={() => navigate('/dashboard')}
               className="w-full max-w-md bg-secondary hover:bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-green-700 transition-all active:translate-y-1 mx-4"
            >
                VOLTAR PARA O MAPA
            </button>
        </div>
     );
  }

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <div className={`max-w-2xl mx-auto pb-32 px-4 ${isGincana ? 'bg-purple-50/30 rounded-[3rem] p-4' : ''}`}>
      {/* Gincana Placar Superior */}
      {isGincana && (
          <div className="flex justify-between items-center bg-purple-600 text-white p-6 rounded-[2rem] shadow-xl mb-8 border-b-8 border-purple-800 animate-float">
             <div className="flex items-center gap-3">
                 <div className="bg-white/20 p-2 rounded-xl"><Users size={24}/></div>
                 <div>
                     <p className="text-[10px] font-black opacity-80 uppercase">Átomo (Você)</p>
                     <p className="text-2xl font-black">{teamScoreA}</p>
                 </div>
             </div>
             <div className="bg-white/20 p-4 rounded-full flex flex-col items-center">
                 <Timer size={20} className={timeLeft < 10 ? 'text-red-300 animate-pulse' : ''}/>
                 <p className="font-black text-xl">{timeLeft}s</p>
             </div>
             <div className="flex items-center gap-3 text-right">
                 <div>
                     <p className="text-[10px] font-black opacity-80 uppercase">Célula (IA)</p>
                     <p className="text-2xl font-black">{teamScoreB}</p>
                 </div>
                 <div className="bg-white/20 p-2 rounded-xl"><Zap size={24}/></div>
             </div>
          </div>
      )}

      {/* Progress Bar (Standard) */}
      {!isGincana && (
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 font-black text-sm">SAIR</button>
            <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden border border-gray-100">
                <div className="bg-secondary h-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-black text-gray-400 text-sm">{currentIdx + 1}/{questions.length}</span>
          </div>
      )}

      <div className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 animate-fade-in ${isGincana ? 'ring-4 ring-purple-100' : ''}`}>
        <div className="flex flex-wrap gap-2 mb-4">
            {isPisa && <span className="bg-accent/20 text-yellow-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Simulado PISA</span>}
            {isReview && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Revisão</span>}
            {isGincana && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Gincana Bimestral</span>}
            {currentQ.bnccCode && <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{currentQ.bnccCode}</span>}
        </div>
        <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-8 leading-tight">{currentQ.text}</h2>
        
        <div className="space-y-4">
          {currentQ.options.map((option, idx) => {
             let stateClass = "border-gray-100 hover:bg-gray-50 bg-white";
             const letters = ['A', 'B', 'C', 'D'];
             
             if (selectedOption === idx) {
                 stateClass = isGincana ? "border-purple-500 bg-purple-50 text-purple-700" : "border-primary bg-blue-50 text-blue-700";
             }

             if (isAnswered) {
                 if (idx === currentQ.correctAnswer) stateClass = "border-secondary bg-green-50 text-secondary ring-4 ring-green-100";
                 else if (idx === selectedOption) stateClass = "border-red-500 bg-red-50 text-red-600";
                 else stateClass = "border-gray-50 opacity-40 grayscale";
             }

             return (
                <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`w-full p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center gap-4 ${stateClass}`}
                >
                    <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-black text-sm border-2 ${selectedOption === idx ? 'bg-current text-white' : 'bg-gray-50 text-gray-400'}`}>
                        {letters[idx]}
                    </span>
                    <span className="flex-1 leading-tight">{option}</span>
                </button>
             );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 border-t bg-white/90 backdrop-blur-md z-50 transition-all duration-300 ${isAnswered ? 'h-52 md:h-28' : 'h-24'}`}>
         <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {isAnswered && (
                <div className={`flex-1 w-full p-4 rounded-2xl animate-fade-in ${selectedOption === currentQ.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        {selectedOption === currentQ.correctAnswer ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        <span className="font-black uppercase text-[10px] tracking-widest">
                            {selectedOption === currentQ.correctAnswer ? 'Incrível! Ponto para sua equipe!' : 'Ponto para o adversário!'}
                        </span>
                    </div>
                    {currentQ.explanation && <p className="text-[10px] font-bold opacity-80 leading-tight">{currentQ.explanation}</p>}
                </div>
            )}
            
            <button
                onClick={isAnswered ? handleNext : handleCheck}
                disabled={selectedOption === null && !isAnswered}
                className={`w-full md:w-auto px-12 py-5 rounded-2xl font-black text-white shadow-xl border-b-8 transition-all active:translate-y-1 active:border-b-4
                    ${isAnswered 
                        ? (selectedOption === currentQ.correctAnswer ? 'bg-secondary border-green-700' : 'bg-red-500 border-red-700') 
                        : (isGincana ? 'bg-purple-600 border-purple-800' : 'bg-primary border-blue-700')
                    }
                `}
            >
                {isAnswered ? (currentIdx === questions.length - 1 ? 'RESULTADO FINAL' : 'PRÓXIMA RODADA') : 'RESPONDER'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default Quiz;
