
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, BookOpen, AlertCircle, Lock, Unlock, Plus, Trash2, Building, Check, Save, PlusCircle, GraduationCap, X, Zap, Trophy, RefreshCw, Star } from 'lucide-react';
import { MOCK_UNITS, CLASSES, SHIFTS } from '../constants';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard: React.FC = () => {
  const { 
    user, allUsers, unlockedUnitIds, toggleUnitLock, activeClassrooms, 
    addClassroom, removeClassroom, addSchool, switchActiveSchool, 
    removeSchoolFromTeacher 
  } = useAuth();
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = (searchParams.get('tab') as 'overview' | 'curriculum' | 'classrooms') || 'overview';

  const [newGrade, setNewGrade] = useState<number>(user?.grade || 6);
  const [newClassId, setNewClassId] = useState('A');
  const [newShift, setNewShift] = useState('Manhã');
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [sentIncentives, setSentIncentives] = useState<string[]>([]);
  const [tempSelectedSchool, setTempSelectedSchool] = useState<string>(user?.school || '');
  const [isSwitching, setIsSwitching] = useState(false);

  const myUnits = useMemo(() => MOCK_UNITS.filter(u => u.grade === (user?.grade || 6)), [user?.grade]);
  
  // Sincronização: Alunos Ativos do Professor na Unidade Ativa
  const myStudents = useMemo(() => {
    return allUsers.filter(u => 
        u.role === 'STUDENT' && 
        u.teacherId === user?.id &&
        u.school === user?.school
    ).sort((a, b) => (b.xp || 0) - (a.xp || 0));
  }, [allUsers, user]);

  const viewClassrooms = useMemo(() => {
    return activeClassrooms.filter(c => c.teacherId === user?.id && c.school === tempSelectedSchool);
  }, [activeClassrooms, user?.id, tempSelectedSchool]);

  const criticalStudents = useMemo(() => {
      return myStudents.filter(s => (s.xp || 0) < 300).slice(0, 5);
  }, [myStudents]);

  // Lógica de cores dinâmicas para o gráfico
  const getBarColor = (value: number) => {
    if (value >= 90) return '#4A90E2'; // Azul
    if (value >= 70) return '#7ED321'; // Verde
    if (value >= 50) return '#F5A623'; // Laranja
    if (value >= 40) return '#FFC107'; // Amarelo
    return '#D0021B'; // Vermelho
  };

  const chartData = useMemo(() => {
      // Simulação de dados baseada nas habilidades do ano
      return myUnits.filter(u => u.type === 'standard').slice(0, 6).map(u => ({
          skill: u.title,
          average: Math.floor(Math.random() * 70) + 30 // Simulação realista
      }));
  }, [myUnits]);

  const teacherSchools = user?.teacherSchools || (user?.school ? [user.school] : []);

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSchoolName.trim()) {
      addSchool(newSchoolName.trim());
      setTempSelectedSchool(newSchoolName.trim());
      setNewSchoolName('');
      setShowAddSchool(false);
      triggerToast();
    }
  };

  const handleAddClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !tempSelectedSchool) return;
    addClassroom({
      school: tempSelectedSchool,
      grade: newGrade,
      classId: newClassId,
      shift: newShift,
      teacherId: user.id
    });
    triggerToast();
  };

  const triggerToast = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleSwitchSchool = () => {
    if (tempSelectedSchool && tempSelectedSchool !== user?.school) {
      setIsSwitching(true);
      setTimeout(() => {
        switchActiveSchool(tempSelectedSchool);
        setIsSwitching(false);
        triggerToast();
      }, 400);
    }
  };

  const handleRemoveSchool = (e: React.MouseEvent, schoolName: string) => {
    e.stopPropagation();
    if (confirm(`Deseja remover a escola "${schoolName}" da sua rede?`)) {
      removeSchoolFromTeacher(schoolName);
      if (tempSelectedSchool === schoolName) {
        setTempSelectedSchool('');
      }
      triggerToast();
    }
  };

  const sendIncentive = (studentId: string) => {
      setSentIncentives(prev => [...prev, studentId]);
  };

  return (
    <div className="pb-20">
      {showSavedToast && (
        <div className="fixed top-24 right-4 z-[100] bg-secondary text-white px-6 py-3 rounded-2xl shadow-2xl border-b-4 border-green-700 animate-bounce-in flex items-center gap-2">
            <Check size={20} /> <span className="font-black text-sm uppercase tracking-widest">Sincronizado!</span>
        </div>
      )}

      <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight uppercase">
            {currentTab === 'overview' ? 'Visão Geral' : currentTab === 'curriculum' ? 'Gestão do Currículo' : 'Minhas Turmas'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
             <Building size={16} className="text-primary" />
             <p className="text-gray-500 font-bold">{user?.school || 'Nenhuma unidade'} • {user?.grade || 'N/A'}º Ano</p>
          </div>
      </div>

      {currentTab === 'overview' && (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ALUNOS ATIVOS - Dados Reais */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-100 p-3 rounded-2xl text-primary"><Users size={28} /></div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">ALUNOS ATIVOS</p>
                            <p className="text-3xl font-black text-gray-800">{myStudents.length}</p>
                        </div>
                    </div>
                    <div className="space-y-2 border-t pt-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Ranking da Turma</p>
                        {myStudents.map((s, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs font-bold mb-1">
                                <span className="text-gray-600 truncate flex items-center gap-2">
                                    <span className="w-4 text-gray-400">{idx + 1}º</span>
                                    {s.name}
                                </span>
                                <span className="text-primary font-black">{s.xp} XP</span>
                            </div>
                        ))}
                        {myStudents.length === 0 && <p className="text-xs text-gray-400 italic">Nenhum aluno cadastrado nesta unidade.</p>}
                    </div>
                </div>

                {/* ATIVIDADES - Sincronizado com o Ano */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-green-100 p-3 rounded-2xl text-secondary"><BookOpen size={28} /></div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">ATIVIDADES</p>
                            <p className="text-3xl font-black text-gray-800">{myUnits.length}</p>
                        </div>
                    </div>
                    <div className="space-y-2 border-t pt-4 text-[11px] font-bold text-gray-500">
                        <div className="flex justify-between">
                            <span>Módulos de Revisão:</span>
                            <span className="text-gray-800">01</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tópicos BNCC ({user?.grade}º Ano):</span>
                            <span className="text-gray-800">{myUnits.filter(u => u.type === 'standard').length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Simulados PISA:</span>
                            <span className="text-gray-800">01</span>
                        </div>
                    </div>
                </div>

                {/* ATENÇÃO - Sincronizado com Baixo Desempenho */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-100 p-3 rounded-2xl text-red-500"><AlertCircle size={28} /></div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">ATENÇÃO</p>
                            <p className="text-3xl font-black text-gray-800">{criticalStudents.length}</p>
                        </div>
                    </div>
                    <div className="space-y-3 border-t pt-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Engajamento Crítico</p>
                        {criticalStudents.map(s => (
                            <div key={s.id} className="flex items-center justify-between group bg-gray-50 p-2 rounded-xl border border-gray-100">
                                <span className="text-[11px] font-bold text-gray-600 truncate max-w-[100px]">{s.name}</span>
                                <button 
                                    onClick={() => sendIncentive(s.id)}
                                    disabled={sentIncentives.includes(s.id)}
                                    className={`flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg border-b-2 transition-all active:translate-y-0.5 ${
                                        sentIncentives.includes(s.id) 
                                        ? 'bg-gray-200 text-gray-400 border-gray-300' 
                                        : 'bg-accent text-yellow-900 border-yellow-600 hover:brightness-105'
                                    }`}
                                >
                                    <Zap size={10} fill="currentColor" /> {sentIncentives.includes(s.id) ? 'ENVIADO' : 'ESTIMULAR'}
                                </button>
                            </div>
                        ))}
                        {criticalStudents.length === 0 && <p className="text-xs text-gray-400 italic">Todos os alunos estão engajados!</p>}
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Média de Acertos por Habilidade (%)</h2>
                    <div className="flex gap-2 text-[8px] font-black">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#4A90E2]"></div> AZUL (90%+)</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#7ED321]"></div> VERDE (70%+)</span>
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="skill" tick={{fill: '#888', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fill: '#888', fontSize: 10}} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                            <Bar dataKey="average" radius={[6, 6, 0, 0]} barSize={45}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getBarColor(entry.average)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>
      )}

      {/* Outras Abas (Currículo e Minhas Turmas) permanecem as mesmas... */}
      {currentTab === 'curriculum' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
              <div className="mb-6 text-center">
                  <h2 className="text-2xl font-black text-gray-800">Liberar Habilidades BNCC</h2>
                  <p className="text-gray-500 font-bold">Gerenciamento pedagógico para {user?.school}.</p>
              </div>
              <div className="space-y-3">
                  {myUnits.map((unit) => {
                      const isUnlocked = unlockedUnitIds.includes(unit.id);
                      return (
                        <div key={unit.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${isUnlocked ? 'border-secondary bg-green-50 shadow-sm' : 'border-gray-100 bg-gray-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-colors ${isUnlocked ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    {isUnlocked ? <Unlock size={20} /> : <Lock size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-gray-800">{unit.title}</h3>
                                    <p className="text-xs text-gray-600 font-bold uppercase opacity-60 tracking-wider">{unit.description}</p>
                                </div>
                            </div>
                            <button onClick={() => { toggleUnitLock(unit.id); triggerToast(); }} className={`px-4 py-2 rounded-xl font-black text-xs shadow-sm transition-transform active:scale-95 border-b-4 ${isUnlocked ? 'bg-red-100 text-red-600 border-red-300' : 'bg-primary text-white border-blue-700'}`}>
                                {isUnlocked ? 'BLOQUEAR' : 'LIBERAR'}
                            </button>
                        </div>
                      );
                  })}
              </div>
          </div>
      )}

      {currentTab === 'classrooms' && (
          <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                         <Building className="text-accent" /> Rede Escolar Ativa
                      </h2>
                      <button onClick={() => setShowAddSchool(!showAddSchool)} className="text-primary font-black text-sm flex items-center gap-1 hover:underline">
                         <PlusCircle size={16} /> Nova Unidade
                      </button>
                  </div>

                  {showAddSchool && (
                      <form onSubmit={handleCreateSchool} className="mb-6 bg-accent/5 p-4 rounded-2xl border-2 border-dashed border-accent/30 flex gap-2 animate-bounce-in">
                          <input required type="text" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} placeholder="Nome da nova escola..." className="flex-1 p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-accent outline-none" />
                          <button type="submit" className="bg-accent text-dark font-black px-6 py-3 rounded-xl shadow-lg border-b-4 border-yellow-600 uppercase text-xs">ADICIONAR</button>
                      </form>
                  )}

                  <div className="flex flex-wrap gap-2 mb-8">
                      {teacherSchools.map(s => (
                          <div key={s} className="relative group/chip">
                            <button 
                               onClick={() => setTempSelectedSchool(s)}
                               className={`pl-4 pr-10 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border-2 ${
                                   tempSelectedSchool === s 
                                   ? 'bg-blue-50 border-primary text-primary shadow-sm' 
                                   : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                               }`}
                            >
                               {s}
                               {user?.school === s && <Check size={14} className="text-secondary" />}
                            </button>
                            <button 
                              onClick={(e) => handleRemoveSchool(e, s)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/chip:opacity-100"
                            >
                              <X size={16} />
                            </button>
                          </div>
                      ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-50 items-center gap-4">
                      <button 
                         onClick={handleSwitchSchool}
                         disabled={isSwitching || !tempSelectedSchool || tempSelectedSchool === user?.school}
                         className={`font-black px-8 py-4 rounded-2xl shadow-xl border-b-8 flex items-center gap-2 transition-all active:translate-y-1 ${
                            tempSelectedSchool === user?.school || !tempSelectedSchool
                            ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed shadow-none border-b-0'
                            : 'bg-primary text-white border-blue-700 hover:brightness-105'
                         }`}
                      >
                         {isSwitching ? <RefreshCw className="animate-spin" /> : <RefreshCw size={20} />} 
                         ALTERNAR UNIDADE
                      </button>
                  </div>
              </div>

              {/* Lista de Turmas na Unidade */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-widest text-[10px] opacity-60">Turmas na Unidade: {tempSelectedSchool || 'Nenhuma'}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {viewClassrooms.map(room => (
                          <div key={room.id} className="p-6 rounded-2xl bg-gray-50 border-2 border-gray-100 flex justify-between items-center group hover:border-primary/20 transition-all">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-primary">
                                      <GraduationCap size={24} />
                                  </div>
                                  <div>
                                      <h3 className="text-2xl font-black text-primary">{room.grade}º {room.classId}</h3>
                                      <p className="text-gray-400 font-black text-xs uppercase tracking-widest">{room.shift}</p>
                                  </div>
                              </div>
                              <button onClick={() => { removeClassroom(room.id); triggerToast(); }} className="p-3 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                 <Trash2 size={24} />
                              </button>
                          </div>
                      ))}
                      {viewClassrooms.length === 0 && <p className="col-span-2 text-center py-10 text-gray-400 font-bold italic">Nenhuma turma cadastrada nesta unidade.</p>}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
