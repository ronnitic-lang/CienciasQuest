import React, { useState, useEffect } from 'react';
import { UserRole, StudentProfile, TeacherProfile, AvatarConfig, Skill } from './types';
import AvatarMaker from './components/AvatarMaker';
import Lesson from './components/Lesson';
import { SKILLS, getSkillsForGrade } from './data/curriculum';
import { generateFinalTest } from './services/geminiService';

// --- Sub-components for Layout ---

const SkillNode: React.FC<{ 
  skill: Skill; 
  status: 'locked' | 'active' | 'completed'; 
  onClick: () => void;
  isTeacherUnlocked: boolean;
}> = ({ skill, status, onClick, isTeacherUnlocked }) => {
  // If teacher hasn't unlocked it, and it's not a revision skill, it appears different
  const visualStatus = !isTeacherUnlocked && !skill.isRevision ? 'locked_by_teacher' : status;

  let colorClass = "bg-gray-300 border-gray-400 text-gray-500";
  if (visualStatus === 'completed') colorClass = "bg-yellow-400 border-yellow-600 text-yellow-900";
  if (visualStatus === 'active') colorClass = "bg-brand border-brand-dark text-white";
  if (visualStatus === 'locked_by_teacher') colorClass = "bg-gray-800 border-gray-900 text-gray-400 opacity-70";

  return (
    <div className="flex flex-col items-center mb-8 relative z-10">
      <button 
        onClick={onClick}
        disabled={visualStatus.includes('locked')}
        className={`w-20 h-20 rounded-full border-b-8 flex items-center justify-center text-3xl shadow-xl transition-transform active:scale-95 ${colorClass}`}
      >
        {visualStatus === 'completed' ? '★' : visualStatus.includes('locked') ? '🔒' : '★'}
      </button>
      <span className={`mt-2 font-bold px-3 py-1 rounded-lg text-sm max-w-[150px] text-center ${visualStatus === 'active' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>
        {skill.topic}
      </span>
      {skill.isRevision && <span className="text-xs text-blue-500 font-bold mt-1 uppercase tracking-wide">Revisão</span>}
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'setup' | 'dashboard' | 'lesson' | 'test'>('login');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  // Student State
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: '', grade: 6, school: '', shift: 'Manhã', classId: 'A',
    avatar: { skinColor: '#f5d0b0', hairStyle: 'straight', hairColor: '#000', clothing: 'casual', accessory: 'none', backgroundColor: '#fff'},
    progress: {}, completedRevision: false
  });
  
  // Teacher State - Simulating a database of unlocked skills per class
  const [teacherUnlockedSkills, setTeacherUnlockedSkills] = useState<Record<string, string[]>>({
    '6A': ['EF06CI01', 'EF06CI02'], // Only these are unlocked by default
    '7A': ['EF07CI01']
  });

  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  // --- Auth & Setup ---
  
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentView(role === UserRole.STUDENT ? 'setup' : 'dashboard');
  };

  const handleStudentSetupComplete = (avatar: AvatarConfig, basicInfo: any) => {
    setStudentProfile(prev => ({ ...prev, ...basicInfo, avatar }));
    setCurrentView('dashboard');
  };

  // --- Student Dashboard Logic ---

  const getStudentSkills = () => {
    // 1. Revision Skills (Grade - 1) - Hardcoded for demo to be Grade 5 revision
    const revisionSkills = SKILLS.filter(s => s.isRevision && s.grade === studentProfile.grade);
    // 2. Current Grade Skills
    const gradeSkills = getSkillsForGrade(studentProfile.grade).filter(s => !s.isRevision);
    
    return [...revisionSkills, ...gradeSkills];
  };

  const handleSkillClick = (skill: Skill) => {
    setActiveSkill(skill);
    setCurrentView('lesson');
  };

  const handleLessonComplete = (score: number) => {
    if (activeSkill) {
      setStudentProfile(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          [activeSkill.id]: Math.max(prev.progress[activeSkill.id] || 0, score > 2 ? 3 : 1)
        }
      }));
    }
    setActiveSkill(null);
    setCurrentView('dashboard');
  };

  // --- Teacher Dashboard Logic ---

  const toggleSkillLock = (classId: string, skillId: string) => {
    setTeacherUnlockedSkills(prev => {
      const current = prev[classId] || [];
      const isUnlocked = current.includes(skillId);
      const updated = isUnlocked ? current.filter(id => id !== skillId) : [...current, skillId];
      return { ...prev, [classId]: updated };
    });
  };

  // --- Renderers ---

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
          <h1 className="text-4xl font-extrabold text-green-600 mb-2 tracking-tight">CienciasQuest</h1>
          <p className="text-gray-500 mb-8">Aprenda ciências explorando o mundo!</p>
          
          <div className="space-y-4">
            <button onClick={() => handleLogin(UserRole.STUDENT)} className="w-full py-4 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl text-lg shadow-b-md active:translate-y-1 transition-all">
              Sou Aluno
            </button>
            <button onClick={() => handleLogin(UserRole.TEACHER)} className="w-full py-4 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-lg shadow-sm active:translate-y-1 transition-all">
              Sou Professor
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'setup' && userRole === UserRole.STUDENT) {
    // Simplified setup step
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full md:w-1/2">
                <h2 className="text-xl font-bold mb-4">Seus Dados</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600">Nome</label>
                        <input type="text" className="w-full border p-2 rounded-lg" value={studentProfile.name} onChange={e => setStudentProfile({...studentProfile, name: e.target.value})} placeholder="Seu nome" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">Escola</label>
                        <input type="text" className="w-full border p-2 rounded-lg" value={studentProfile.school} onChange={e => setStudentProfile({...studentProfile, school: e.target.value})} placeholder="Nome da escola" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm text-gray-600">Ano</label>
                            <select className="w-full border p-2 rounded-lg" value={studentProfile.grade} onChange={e => setStudentProfile({...studentProfile, grade: Number(e.target.value)})}>
                                {[6,7,8,9].map(g => <option key={g} value={g}>{g}º Ano</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Turma</label>
                            <select className="w-full border p-2 rounded-lg" value={studentProfile.classId} onChange={e => setStudentProfile({...studentProfile, classId: e.target.value})}>
                                {['A','B','C','D'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm text-gray-600">Turno</label>
                         <select className="w-full border p-2 rounded-lg" value={studentProfile.shift} onChange={e => setStudentProfile({...studentProfile, shift: e.target.value as any})}>
                             <option>Manhã</option>
                             <option>Tarde</option>
                             <option>Integral</option>
                         </select>
                    </div>
                </div>
            </div>
            <AvatarMaker onSave={(avatar) => handleStudentSetupComplete(avatar, {})} />
        </div>
      </div>
    );
  }

  if (currentView === 'lesson' && activeSkill) {
      return <Lesson skill={activeSkill} grade={studentProfile.grade} onComplete={handleLessonComplete} onExit={() => setCurrentView('dashboard')} />
  }

  // --- Student Dashboard ---
  if (userRole === UserRole.STUDENT && currentView === 'dashboard') {
    const visibleSkills = getStudentSkills();
    const currentClassKey = `${studentProfile.grade}${studentProfile.classId}`; // e.g., 6A
    const unlockedByTeacher = teacherUnlockedSkills[currentClassKey] || [];

    // Check if finished all
    const allCompleted = visibleSkills.every(s => studentProfile.progress[s.id]);

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="bg-white border-r w-full md:w-64 p-6 hidden md:block">
            <h2 className="text-2xl font-bold text-green-600 mb-6">CienciasQuest</h2>
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-100 rounded-xl">
                 <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100">
                    {/* Tiny Avatar Preview */}
                    <div className="scale-50 origin-top-left w-20 h-20">
                         {/* We'd ideally reuse the SVG here, simplified for now */}
                         <div style={{backgroundColor: studentProfile.avatar.skinColor}} className="w-full h-full"></div>
                    </div>
                 </div>
                 <div>
                    <p className="font-bold text-sm">{studentProfile.name || 'Estudante'}</p>
                    <p className="text-xs text-gray-500">{studentProfile.grade}º Ano {studentProfile.classId}</p>
                 </div>
            </div>
            <nav className="space-y-2">
                <button className="w-full text-left p-3 rounded-xl bg-green-50 text-green-700 font-bold border border-green-200">Trilha</button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-gray-100 text-gray-600 font-bold">Conquistas</button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-gray-100 text-gray-600 font-bold">Perfil</button>
            </nav>
        </div>

        {/* Path Area */}
        <div className="flex-1 flex justify-center py-10 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
                <svg className="w-full h-full" patternUnits="userSpaceOnUse" width="100" height="100">
                    <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                         <circle cx="2" cy="2" r="1" fill="#000" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#pattern)" />
                </svg>
            </div>

            <div className="flex flex-col items-center max-w-md w-full relative">
                {visibleSkills.map((skill, index) => {
                    const isCompleted = !!studentProfile.progress[skill.id];
                    // Logic for unlocking: First one is active, or if previous is completed.
                    const isPrevCompleted = index === 0 || !!studentProfile.progress[visibleSkills[index-1].id];
                    const isUnlockedByTeacher = skill.isRevision || unlockedByTeacher.includes(skill.id);
                    
                    const status = isCompleted ? 'completed' : (isPrevCompleted ? 'active' : 'locked');

                    return (
                        <SkillNode 
                            key={skill.id} 
                            skill={skill} 
                            status={status} 
                            isTeacherUnlocked={isUnlockedByTeacher}
                            onClick={() => handleSkillClick(skill)}
                        />
                    );
                })}
                
                {allCompleted && (
                    <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-2xl text-center max-w-sm">
                        <h3 className="text-xl font-bold text-yellow-800 mb-2">Parabéns!</h3>
                        <p className="text-yellow-700 mb-4">Você completou a trilha do ano. Pronto para o desafio final PISA?</p>
                        <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl shadow-b-md active:translate-y-1">
                            Iniciar Teste Final
                        </button>
                    </div>
                )}

                {/* Mobile Bottom Nav */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-around z-50">
                    <span className="text-2xl">🗺️</span>
                    <span className="text-2xl opacity-50">🏆</span>
                    <span className="text-2xl opacity-50">👤</span>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- Teacher Dashboard ---
  if (userRole === UserRole.TEACHER && currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
         <header className="bg-white border-b p-4 shadow-sm flex justify-between items-center">
             <h1 className="text-xl font-bold text-gray-800">Painel do Professor</h1>
             <button onClick={() => setCurrentView('login')} className="text-sm text-red-500 font-bold">Sair</button>
         </header>

         <div className="max-w-4xl mx-auto p-6">
             <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                 <h2 className="text-lg font-bold mb-4">Gerenciar Conteúdo por Turma</h2>
                 <p className="text-gray-600 mb-4 text-sm">Selecione as habilidades que devem aparecer disponíveis para os alunos. Habilidades de revisão estão sempre disponíveis.</p>
                 
                 <div className="space-y-8">
                     {['6A', '7A', '8A', '9A'].map(classId => {
                         const grade = parseInt(classId[0]);
                         const skills = getSkillsForGrade(grade).filter(s => !s.isRevision);
                         
                         return (
                             <div key={classId} className="border rounded-lg p-4">
                                 <h3 className="font-bold text-lg text-blue-800 mb-3">Turma {classId} ({grade}º Ano)</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                     {skills.map(skill => {
                                         const isUnlocked = (teacherUnlockedSkills[classId] || []).includes(skill.id);
                                         return (
                                             <div key={skill.id} className={`flex items-center justify-between p-3 rounded-lg border ${isUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                                 <div>
                                                     <p className="font-bold text-sm text-gray-800">{skill.code}</p>
                                                     <p className="text-xs text-gray-600 line-clamp-1">{skill.topic}</p>
                                                 </div>
                                                 <button 
                                                    onClick={() => toggleSkillLock(classId, skill.id)}
                                                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${isUnlocked ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}
                                                 >
                                                     {isUnlocked ? 'Liberado' : 'Bloqueado'}
                                                 </button>
                                             </div>
                                         );
                                     })}
                                 </div>
                             </div>
                         );
                     })}
                 </div>
             </div>
         </div>
      </div>
    );
  }

  return <div>View not found</div>;
}