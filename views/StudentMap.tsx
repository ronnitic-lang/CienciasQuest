
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Lock, Play, RefreshCw, Award, Zap } from 'lucide-react';
import { MOCK_UNITS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Unit } from '../types';

const StudentMap: React.FC = () => {
  const navigate = useNavigate();
  const { user, unlockedUnitIds } = useAuth();

  // Filter units for the student's grade
  const gradeUnits = useMemo(() => {
    return MOCK_UNITS.filter(u => u.grade === (user?.grade || 6));
  }, [user?.grade]);

  const handleUnitClick = (unit: Unit, isLocked: boolean) => {
    if (isLocked) return;
    navigate(`/quiz/${unit.id}`);
  };

  return (
    <div className="flex flex-col items-center pb-20">
      
      {/* Header Stats */}
      <div className="w-full flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                <Star fill="currentColor" size={20} />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400">TOTAL XP</p>
                <p className="font-extrabold text-xl text-yellow-600">{user?.xp || 0}</p>
            </div>
        </div>
        <div className="text-center hidden sm:block">
           <p className="text-xs font-bold text-gray-400">TURMA</p>
           <p className="font-extrabold text-xl text-primary">{user?.grade || 6}º {user?.classId}</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
               <span className="font-black">🔥</span>
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400">OFENSIVA</p>
                <p className="font-extrabold text-xl text-red-600">{user?.streak || 0} dias</p>
            </div>
        </div>
      </div>

      <div className="mb-4 text-center">
        <h2 className="text-2xl font-extrabold text-gray-700">Trilha do Conhecimento</h2>
        <p className="text-gray-500 font-medium text-sm">Escola: {user?.school}</p>
      </div>

      {/* Path */}
      <div className="flex flex-col gap-10 w-full max-w-sm relative px-4">
        {/* SVG Line Background */}
        <div className="absolute left-1/2 top-4 bottom-0 w-3 bg-gray-200 -ml-1.5 -z-10 rounded-full opacity-50"></div>

        {gradeUnits.map((unit, index) => {
          // Check dynamic lock status from context/teacher settings
          const isLocked = !unlockedUnitIds.includes(unit.id);

          // Stagger the buttons left and right for "Standard" units
          let alignment = '';
          if (unit.type === 'review' || unit.type === 'exam') {
            alignment = 'items-center';
          } else {
            alignment = index % 2 === 0 ? 'items-end pr-12' : 'items-start pl-12';
          }
          
          // Icon selection
          const Icon = unit.type === 'review' ? RefreshCw : (unit.type === 'exam' ? Award : unit.type === 'gincana' ? Zap : Play);
          const size = unit.type === 'exam' ? 'w-28 h-28' : 'w-24 h-24';
          const iconSize = unit.type === 'exam' ? 48 : 32;

          return (
            <div key={unit.id} className={`flex flex-col ${alignment} relative w-full`}>
              <button
                onClick={() => handleUnitClick(unit, isLocked)}
                className={`${size} rounded-full flex items-center justify-center border-b-[6px] transition-all transform active:scale-95 shadow-xl z-10 relative group
                  ${isLocked 
                    ? 'bg-gray-200 border-gray-300 cursor-not-allowed text-gray-400' 
                    : `${unit.color} border-black/20 hover:brightness-110 text-white`
                  }`}
              >
                {isLocked ? (
                  <Lock size={32} />
                ) : (
                  <Icon size={iconSize} fill={unit.type !== 'review' ? "currentColor" : "none"} strokeWidth={3} />
                )}
                
                {/* Tooltip on Hover */}
                {!isLocked && (
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs py-1 px-3 rounded-lg whitespace-nowrap pointer-events-none">
                        Começar
                    </div>
                )}
              </button>
              
              {/* Label */}
              <div className={`mt-3 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-center max-w-[200px] z-20 ${
                  unit.type === 'review' ? 'border-yellow-400 border-2' : ''
              }`}>
                {unit.title.startsWith('EF') ? (
                   <span className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1">{unit.title}</span>
                ) : (
                   <span className="block text-xs font-black text-yellow-600 uppercase tracking-wider mb-1">
                       {unit.type === 'review' ? 'REVISÃO' : unit.type === 'gincana' ? 'DESAFIO GINCANA' : 'TESTE FINAL'}
                   </span>
                )}
                <h3 className="font-bold text-gray-800 text-sm leading-tight">{unit.description}</h3>
              </div>
            </div>
          );
        })}
        
        {/* End of Path Decoration */}
        <div className="h-20"></div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="w-full text-center p-8 text-gray-400 text-xs border-t mt-auto">
        <p className="font-bold mb-1">Baseado na BNCC, DCRC e Currículo Municipal de Caucaia-CE</p>
        <p>Desenvolvido por: Ciências Online 2026</p>
      </footer>
    </div>
  );
};

export default StudentMap;
