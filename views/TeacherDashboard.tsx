
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, BookOpen, AlertCircle, Building, Check, PlusCircle, GraduationCap, X, Trophy, RefreshCw, Search, ChevronRight, Trash2, ToggleLeft, ToggleRight, Clock } from 'lucide-react';
import { MOCK_UNITS, CLASSES, SHIFTS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Classroom } from '../types';
import Avatar from '../components/Avatar';

const TeacherDashboard: React.FC = () => {
  const { 
    user, allUsers, unlockedUnitIds, toggleUnitLock, activeClassrooms, 
    addClassroom, removeClassroom, addSchool, switchActiveSchool, 
    removeSchoolFromTeacher 
  } = useAuth();
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = (searchParams.get('tab') as 'overview' | 'curriculum' | 'classrooms') || 'overview';

  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showAddClassroom, setShowAddClassroom] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  
  // States para nova turma
  const [newGrade, setNewGrade] = useState<number>(6);
  const [newClassId, setNewClassId] = useState('');
  const [newShift, setNewShift] = useState('');

  const [showSavedToast, setShowSavedToast] = useState(false);
  const [tempSelectedSchool, setTempSelectedSchool] = useState<string>(user?.school || '');
  const [isSwitching, setIsSwitching] = useState(false);
  const [curriculumSearch, setCurriculumSearch] = useState('');
  
  const [selectedClassRoster, setSelectedClassRoster] = useState<Classroom | null>(null);

  const myUnits = useMemo(() => MOCK_UNITS.filter(u => u.grade === (user?.grade || 6)), [user?.grade]);
  
  const filteredCurriculum = useMemo(() => {
    return myUnits.filter(u => 
        u.title.toLowerCase().includes(curriculumSearch.toLowerCase()) || 
        u.description.toLowerCase().includes(curriculumSearch.toLowerCase())
    );
  }, [myUnits, curriculumSearch]);

  const schoolRanking = useMemo(() => {
    return allUsers
      .filter(u => u.role === 'STUDENT' && u.school === user?.school)
      .sort((a, b) => (b.xp || 0) - (a.xp || 0));
  }, [allUsers, user?.school]);

  const criticalStudents = useMemo(() => {
      return schoolRanking.filter(s => (s.xp || 0) < 300).slice(0, 5);
  }, [schoolRanking]);

  const classRosterStudents = useMemo(() => {
    if (!selectedClassRoster) return [];
    return allUsers.filter(u => 
      u.role === 'STUDENT' && 
      u.school === selectedClassRoster.school &&
      u.grade === selectedClassRoster.grade &&
      u.classId === selectedClassRoster.classId &&
      u.shift === selectedClassRoster.shift
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [allUsers, selectedClassRoster]);

  const viewClassrooms = useMemo(() => {
    return activeClassrooms.filter(c => c.teacherId === user?.id && c.school === tempSelectedSchool);
  }, [activeClassrooms, user?.id, tempSelectedSchool]);

  const getBarColor = (value: number) => {
    if (value >= 90) return '#4A90E2'; 
    if (value >= 70) return '#7ED321'; 
    if (value >= 50) return '#F5A623'; 
    if (value >= 40) return '#FFC107'; 
    return '#D0021B'; 
  };

  const chartData = useMemo(() => {
      return myUnits.filter(u => u.type === 'standard').slice(0, 6).map(u => ({
          skill: u.title,
          average: Math.floor(Math.random() * 60) + 35 
      }));
  }, [myUnits]);

  const teacherSchools = user?.teacherSchools || (user?.school ? [user.school] : []);

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

  const handleAddClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempSelectedSchool && newClassId && newShift) {
        addClassroom({
            school: tempSelectedSchool,
            grade: newGrade,
            classId: newClassId,
            shift: newShift,
            teacherId: user?.id || ''
        });
        setShowAddClassroom(false);
        setNewClassId('');
        setNewShift('');
        triggerToast();
    }
  };

  return (
    <div className="pb-20">
      {/* Toast Notification */}
      {showSavedToast && (
          <div className="fixed top-20 right-4 z-[120] bg-secondary text-white px-6 py-3 rounded-2xl shadow-xl border-b-4 border-green-700 animate-bounce-in flex items-center gap-2 font-black uppercase text-xs">
              <Check size={18} /> Alteração Salva!
          </div>
      )}

      {/* MODAL: Lista de Chamada da Turma */}
      {selectedClassRoster && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                  <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl text-primary"><GraduationCap size={24} /></div>
                      <div>
                          <h3 className="font-black text-gray-800">Lista de Chamada</h3>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mt-1">
                            {selectedClassRoster.grade}º {selectedClassRoster.classId} • {selectedClassRoster.shift}
                          </p>
                      </div>
                  </div>
                  <button onClick={() => setSelectedClassRoster(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={20} />
                  </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-3 bg-white custom-scrollbar flex-1">
                  {classRosterStudents.map((s, idx) => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl border-2 border-gray-50 bg-gray-50/30 hover:bg-blue-50/50 hover:border-blue-100 transition-all">
                          <div className="flex items-center gap-3">
                              <div className="text-[10px] font-black text-gray-300 w-4">{idx + 1}º</div>
                              {s.avatarConfig && <Avatar config={s.avatarConfig} size={42} />}
                              <div>
                                  <p className="font-black text-gray-700 text-sm leading-none mb-1">{s.name}</p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">{s.email}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-sm font-black text-primary leading-none">{s.xp || 0} XP</p>
                              <p className="text-[8px] font-black text-secondary uppercase">ATIVO</p>
                          </div>
                      </div>
                  ))}
                  {classRosterStudents.length === 0 && (
                      <div className="text-center py-16">
                          <Users size={48} className="mx-auto text-gray-200 mb-2" />
                          <p className="text-gray-400 font-bold italic">Nenhum aluno matriculado nesta turma ainda.</p>
                      </div>
                  )}
              </div>
           </div>
        </div>
      )}

      {/* Header Dashboard */}
      <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight uppercase">
            {currentTab === 'overview' ? 'Monitoramento' : currentTab === 'curriculum' ? 'Currículo BNCC' : 'Escolas e Turmas'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
             <Building size={16} className="text-primary" />
             <p className="text-gray-500 font-bold">{user?.school} • Gestão {user?.grade}º Ano</p>
          </div>
      </div>

      {currentTab === 'overview' && (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-2xl text-primary"><Users size={28} /></div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Alunos na Escola</p>
                            <p className="text-3xl font-black text-gray-800">{schoolRanking.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-2xl text-secondary"><BookOpen size={28} /></div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Módulos Ativos</p>
                            <p className="text-3xl font-black text-gray-800">{myUnits.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-100 p-3 rounded-2xl text-red-500"><AlertCircle size={28} /></div>
                        <div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Engajamento Crítico</p>
                            <p className="text-3xl font-black text-gray-800">{criticalStudents.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-gray-800 leading-tight">Média de Acertos (%)</h2>
                        <div className="hidden sm:flex gap-3 text-[8px] font-black uppercase">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#4A90E2]"></div> Azul (90%+)</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#7ED321]"></div> Verde (70%+)</span>
                        </div>
                    </div>
                    <div className="h-72 w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="skill" tick={{fill: '#888', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fill: '#888', fontSize: 10}} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                                <Bar dataKey="average" radius={[8, 8, 0, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getBarColor(entry.average)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Trophy size={14} className="text-accent" /> Hall da Fama - Unidade
                    </h2>
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {schoolRanking.map((s, idx) => (
                            <div key={s.id} className="flex items-center justify-between group bg-gray-50/50 p-2 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all">
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 text-center font-black text-xs ${idx === 0 ? 'text-yellow-500' : 'text-gray-300'}`}>
                                        {idx + 1}º
                                    </div>
                                    <div className="scale-75 origin-left">
                                      {s.avatarConfig && <Avatar config={s.avatarConfig} size={42} />}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-gray-700 leading-none mb-1">{s.name.split(' ')[0]}</p>
                                        <p className="text-[8px] font-black text-gray-400 uppercase">{s.grade}º {s.classId}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-primary">{s.xp || 0}</p>
                                    <p className="text-[7px] font-black text-gray-300 uppercase tracking-tighter">PONTOS</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
      )}

      {currentTab === 'curriculum' && (
          <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div>
                          <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
                             <BookOpen className="text-primary" /> Controle de Habilidades
                          </h2>
                          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Libere ou bloqueie módulos para seus alunos do {user?.grade}º ano</p>
                      </div>
                      <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Buscar BNCC ou tema..." 
                            value={curriculumSearch}
                            onChange={(e) => setCurriculumSearch(e.target.value)}
                            className="pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-primary outline-none font-bold w-full md:w-64 transition-all"
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                      {filteredCurriculum.map((unit) => {
                          const isUnlocked = unlockedUnitIds.includes(unit.id);
                          const isReview = unit.type === 'review';

                          return (
                            <div key={unit.id} className={`p-5 rounded-3xl border-2 transition-all flex items-center justify-between gap-4 ${
                                isUnlocked ? 'bg-white border-blue-50 shadow-sm' : 'bg-gray-50/50 border-gray-50 opacity-60'
                            }`}>
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xs ${unit.color}`}>
                                        {unit.type === 'review' ? <RefreshCw size={20} /> : unit.title.replace('EF', '')}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{unit.title}</span>
                                            {isReview && <span className="text-[8px] font-black bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md">PADRÃO</span>}
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-sm leading-tight">{unit.description}</h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className={`hidden sm:block text-right ${isUnlocked ? 'text-secondary' : 'text-gray-400'}`}>
                                        <p className="text-[9px] font-black uppercase tracking-widest">{isUnlocked ? 'Liberado' : 'Bloqueado'}</p>
                                        <p className="text-[8px] font-bold opacity-60 leading-none">Status na Trilha</p>
                                    </div>
                                    <button 
                                        onClick={() => { toggleUnitLock(unit.id); triggerToast(); }}
                                        disabled={isReview} // Revisão é liberada por padrão
                                        className={`p-1 rounded-full transition-all ${
                                            isUnlocked ? 'text-secondary' : 'text-gray-300'
                                        } ${isReview ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
                                    >
                                        {isUnlocked ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
                                    </button>
                                </div>
                            </div>
                          );
                      })}
                      {filteredCurriculum.length === 0 && (
                          <div className="text-center py-16">
                              <Search size={48} className="mx-auto text-gray-100 mb-2" />
                              <p className="text-gray-400 font-bold italic">Nenhum módulo encontrado para "{curriculumSearch}"</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {currentTab === 'classrooms' && (
          <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
                         <Building className="text-accent" /> Gestão Escolar
                      </h2>
                      <div className="flex gap-2">
                        <button onClick={() => { setShowAddSchool(!showAddSchool); setShowAddClassroom(false); }} className="bg-primary/10 text-primary font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-primary hover:text-white transition-all">
                            <PlusCircle size={16} /> Nova Escola
                        </button>
                      </div>
                  </div>

                  {showAddSchool && (
                      <form onSubmit={(e) => { e.preventDefault(); if (newSchoolName.trim()) { addSchool(newSchoolName.trim()); setNewSchoolName(''); setShowAddSchool(false); triggerToast(); } }} className="mb-8 bg-blue-50/50 p-6 rounded-3xl border-2 border-dashed border-blue-200 flex flex-col sm:flex-row gap-4 animate-bounce-in">
                          <input required type="text" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} placeholder="Nome da instituição..." className="flex-1 p-4 rounded-2xl border-2 border-white font-bold focus:border-primary outline-none shadow-sm" />
                          <button type="submit" className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl border-b-4 border-blue-700 uppercase text-xs tracking-widest">CADASTRAR ESCOLA</button>
                      </form>
                  )}

                  <div className="flex flex-wrap gap-3 mb-10">
                      {teacherSchools.map(s => (
                          <div key={s} className="relative group/chip">
                            <button 
                               onClick={() => setTempSelectedSchool(s)}
                               className={`pl-5 pr-12 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 border-2 ${
                                   tempSelectedSchool === s 
                                   ? 'bg-blue-50 border-primary text-primary shadow-sm' 
                                   : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                               }`}
                            >
                               {s}
                               {user?.school === s && <div className="w-2 h-2 bg-secondary rounded-full"></div>}
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeSchoolFromTeacher(s); triggerToast(); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/chip:opacity-100"
                            >
                              <X size={18} />
                            </button>
                          </div>
                      ))}
                  </div>

                  <div className="flex justify-center md:justify-end pt-6 border-t border-gray-100">
                      <button 
                         onClick={handleSwitchSchool}
                         disabled={isSwitching || !tempSelectedSchool || tempSelectedSchool === user?.school}
                         className={`font-black px-10 py-5 rounded-2xl shadow-xl border-b-8 flex items-center gap-3 transition-all active:translate-y-1 ${
                            tempSelectedSchool === user?.school || !tempSelectedSchool
                            ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed border-b-0 translate-y-2 shadow-none'
                            : 'bg-primary text-white border-blue-700 hover:brightness-105'
                         }`}
                      >
                         {isSwitching ? <RefreshCw className="animate-spin" /> : <RefreshCw size={20} />} 
                         SELECIONAR PARA GESTÃO
                      </button>
                  </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <GraduationCap size={14} /> Turmas Ativas em: {tempSelectedSchool || 'Nenhuma'}
                    </h2>
                    {tempSelectedSchool && (
                        <button onClick={() => setShowAddClassroom(!showAddClassroom)} className="text-secondary font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:brightness-110">
                            <PlusCircle size={14} /> Nova Turma
                        </button>
                    )}
                  </div>

                  {showAddClassroom && (
                    <form onSubmit={handleAddClassroom} className="mb-8 p-6 bg-green-50/50 rounded-3xl border-2 border-dashed border-green-200 grid grid-cols-1 md:grid-cols-4 gap-4 animate-bounce-in">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Ano</label>
                            <select value={newGrade} onChange={e => setNewGrade(Number(e.target.value))} className="w-full p-4 rounded-2xl border-2 border-white font-bold outline-none shadow-sm">
                                {[6,7,8,9].map(g => <option key={g} value={g}>{g}º Ano</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Turma</label>
                            <select required value={newClassId} onChange={e => setNewClassId(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-white font-bold outline-none shadow-sm">
                                <option value="">Selecionar...</option>
                                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Turno</label>
                            <select required value={newShift} onChange={e => setNewShift(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-white font-bold outline-none shadow-sm">
                                <option value="">Selecionar...</option>
                                {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full bg-secondary text-white font-black py-4 rounded-2xl shadow-lg border-b-4 border-green-700 uppercase text-[10px] tracking-widest">ADICIONAR</button>
                        </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {viewClassrooms.map(room => (
                          <div 
                            key={room.id} 
                            onClick={() => setSelectedClassRoster(room)}
                            className="p-6 rounded-3xl bg-gray-50 border-2 border-transparent hover:border-primary hover:bg-white cursor-pointer transition-all flex justify-between items-center group shadow-sm active:scale-[0.98]"
                          >
                              <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                      <GraduationCap size={30} />
                                  </div>
                                  <div>
                                      <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-black text-gray-800 group-hover:text-primary transition-colors">{room.grade}º {room.classId}</h3>
                                        <span className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase bg-gray-100 px-2 py-1 rounded-lg">
                                            <Clock size={10} /> {room.shift}
                                        </span>
                                      </div>
                                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">CLIQUE PARA VER ALUNOS</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4">
                                  <ChevronRight size={24} className="text-gray-300 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-2" />
                                  <button onClick={(e) => { e.stopPropagation(); removeClassroom(room.id); triggerToast(); }} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                     <Trash2 size={22} />
                                  </button>
                              </div>
                          </div>
                      ))}
                      {viewClassrooms.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-bold italic">Nenhuma turma cadastrada para esta escola.</p>
                        </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
