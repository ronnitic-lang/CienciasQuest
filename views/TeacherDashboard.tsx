
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// Add missing Mail and Phone icons to the imports
import { 
  Users, BookOpen, AlertCircle, Building, Check, PlusCircle, 
  GraduationCap, X, Trophy, RefreshCw, Search, ChevronRight, 
  Trash2, ToggleLeft, ToggleRight, Clock, Edit3, Save, Zap,
  Mail, Phone
} from 'lucide-react';
import { MOCK_UNITS, CLASSES, SHIFTS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { Classroom } from '../types';
import Avatar from '../components/Avatar';

const TeacherDashboard: React.FC = () => {
  const { 
    user, allUsers, unlockedUnitIds, toggleUnitLock, activeClassrooms, 
    addClassroom, updateClassroom, removeClassroom, addSchool, switchActiveSchool, 
    removeSchoolFromTeacher, renameSchool, updateUser
  } = useAuth();
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentTab = (searchParams.get('tab') as 'overview' | 'curriculum' | 'classrooms') || 'overview';

  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showAddClassroom, setShowAddClassroom] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  
  // States para Formulários
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newGrade, setNewGrade] = useState<number>(6);
  const [newClassId, setNewClassId] = useState('');
  const [newShift, setNewShift] = useState('');

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

  const teacherSchools = useMemo(() => user?.teacherSchools || (user?.school ? [user.school] : []), [user]);

  const handleSwitchSchool = (schoolName: string) => {
    setTempSelectedSchool(schoolName);
    if (schoolName !== user?.school) {
      setIsSwitching(true);
      setTimeout(() => {
        switchActiveSchool(schoolName);
        setIsSwitching(false);
      }, 300);
    }
  };

  const handleAddSchool = (e: React.FormEvent) => {
      e.preventDefault();
      if (newSchoolName.trim()) {
          const name = newSchoolName.trim();
          addSchool(name); // Adiciona na lista global
          
          // Vincula ao professor
          const updatedSchools = Array.from(new Set([...teacherSchools, name]));
          updateUser(user!.id, { 
              teacherSchools: updatedSchools, 
              school: name // Muda automaticamente para a nova
          });
          
          setTempSelectedSchool(name);
          setNewSchoolName('');
          setShowAddSchool(false);
      }
  };

  const handleRenameSchool = (oldName: string) => {
      const newName = prompt("Informe o novo nome para esta unidade escolar:", oldName);
      if (newName && newName !== oldName) {
          renameSchool(oldName, newName);
          if (tempSelectedSchool === oldName) setTempSelectedSchool(newName);
      }
  };

  const handleDeleteSchool = (schoolName: string) => {
      if (confirm(`Deseja desvincular a escola "${schoolName}" de sua área de trabalho?`)) {
          removeSchoolFromTeacher(schoolName);
          if (tempSelectedSchool === schoolName) setTempSelectedSchool('');
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
    }
  };

  const handleEditClassroom = (classroom: Classroom) => {
    setEditingClassId(classroom.id);
    setNewGrade(classroom.grade);
    setNewClassId(classroom.classId);
    setNewShift(classroom.shift);
    setShowAddClassroom(true);
  };

  const handleUpdateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClassId) {
      updateClassroom(editingClassId, {
        grade: newGrade,
        classId: newClassId,
        shift: newShift
      });
      setEditingClassId(null);
      setShowAddClassroom(false);
      setNewClassId('');
    }
  };

  return (
    <div className="pb-20">
      {/* MODAL: Lista de Chamada */}
      {selectedClassRoster && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                  <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl text-primary shadow-sm"><GraduationCap size={24} /></div>
                      <div>
                          <h3 className="font-black text-gray-800">Lista de Presença</h3>
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">
                            {selectedClassRoster.grade}º {selectedClassRoster.classId} • {selectedClassRoster.shift}
                          </p>
                      </div>
                  </div>
                  <button onClick={() => setSelectedClassRoster(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-3 bg-white custom-scrollbar flex-1">
                  {classRosterStudents.map((s, idx) => (
                      <div key={s.id} className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-50 bg-gray-50/30 hover:border-blue-100 transition-all">
                          <div className="flex items-center gap-4">
                              <div className="text-[10px] font-black text-gray-300 w-4">{idx + 1}º</div>
                              {s.avatarConfig && <Avatar config={s.avatarConfig} size={42} />}
                              <div>
                                  <p className="font-black text-gray-700 text-sm leading-none mb-1">{s.name}</p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                      <Mail size={8}/> {s.email}
                                  </p>
                                  {s.whatsapp && (
                                      <p className="text-[9px] font-bold text-green-500 uppercase flex items-center gap-1 mt-1">
                                          <Phone size={8}/> {s.whatsapp}
                                      </p>
                                  )}
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-xs font-black text-primary leading-none">{s.xp || 0} XP</p>
                          </div>
                      </div>
                  ))}
                  {classRosterStudents.length === 0 && (
                      <div className="text-center py-20">
                          <Users size={56} className="mx-auto text-gray-100 mb-4" />
                          <p className="text-gray-400 font-black italic text-sm uppercase tracking-tighter">Aguardando matrículas nesta turma.</p>
                      </div>
                  )}
              </div>
           </div>
        </div>
      )}

      {/* Header Dashboard */}
      <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight uppercase leading-none">
            {currentTab === 'overview' ? 'Monitoramento' : currentTab === 'curriculum' ? 'Módulos BNCC' : 'Escolas & Turmas'}
          </h1>
          <div className="flex items-center gap-2 mt-2">
             <Building size={16} className="text-primary" />
             <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">{user?.school || 'Sem escola ativa'}</p>
          </div>
      </div>

      {currentTab === 'overview' && (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="bg-blue-100 p-4 rounded-2xl text-primary shadow-inner"><Users size={32} /></div>
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Alunos Ativos</p>
                        <p className="text-3xl font-black text-gray-800">{schoolRanking.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="bg-green-100 p-4 rounded-2xl text-secondary shadow-inner"><BookOpen size={32} /></div>
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Habilidades</p>
                        <p className="text-3xl font-black text-gray-800">{myUnits.length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
                    <h2 className="text-lg font-black text-gray-800 mb-8 flex items-center gap-3">
                        <AlertCircle className="text-primary" size={24} /> Performance por Habilidade (%)
                    </h2>
                    <div className="h-full w-full">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={myUnits.filter(u => u.type === 'standard').slice(0, 7).map(u => ({ skill: u.title, average: Math.floor(Math.random() * 50) + 40 }))}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                                <XAxis dataKey="skill" tick={{fill: '#999', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fill: '#999', fontSize: 10}} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
                                <Bar dataKey="average" radius={[12, 12, 0, 0]} barSize={35} fill="#4A90E2" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <Trophy size={16} className="text-accent" /> Medalhistas da Unidade
                    </h2>
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {schoolRanking.map((s, idx) => (
                            <div key={s.id} className="flex items-center justify-between group bg-gray-50/40 p-3 rounded-2xl border-2 border-transparent hover:border-blue-100 hover:bg-white transition-all cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-yellow-100 text-yellow-600 shadow-sm' : 'text-gray-300'}`}>
                                        {idx + 1}º
                                    </div>
                                    <div className="scale-90 origin-left">
                                      {s.avatarConfig && <Avatar config={s.avatarConfig} size={42} />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-700 leading-none mb-1">{s.name.split(' ')[0]}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{s.grade}º {s.classId}</p>
                                    </div>
                                </div>
                                <p className="text-xs font-black text-primary bg-white px-3 py-1 rounded-full shadow-sm">{s.xp || 0} XP</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
      )}

      {currentTab === 'curriculum' && (
          <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div>
                          <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
                             <BookOpen className="text-primary" size={28} /> Planejamento Pedagógico
                          </h2>
                          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Controle a liberação das habilidades BNCC</p>
                      </div>
                      <div className="relative">
                          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                          <input 
                            type="text" 
                            placeholder="Filtrar habilidade..." 
                            value={curriculumSearch}
                            onChange={(e) => setCurriculumSearch(e.target.value)}
                            className="pl-14 pr-6 py-4 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-primary outline-none font-bold w-full md:w-80 transition-all shadow-sm"
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                      {filteredCurriculum.map((unit) => {
                          const isUnlocked = unlockedUnitIds.includes(unit.id);
                          const isReview = unit.type === 'review';
                          const isGincana = unit.type === 'gincana';

                          return (
                            <div key={unit.id} className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between gap-4 ${
                                isUnlocked ? 'bg-white border-blue-50 shadow-md' : 'bg-gray-50/50 border-gray-100 opacity-60'
                            }`}>
                                <div className="flex items-center gap-5 flex-1">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm ${unit.color}`}>
                                        {isReview ? <RefreshCw size={24} /> : isGincana ? <Zap size={24} fill="currentColor"/> : unit.title.replace('EF', '')}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{unit.title}</span>
                                            {isGincana && <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-3 py-0.5 rounded-full border border-purple-200">GINCANA</span>}
                                        </div>
                                        <h3 className="font-bold text-gray-700 text-base leading-tight mt-1">{unit.description}</h3>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <button 
                                        onClick={() => toggleUnitLock(unit.id)}
                                        disabled={isReview} 
                                        className={`p-1 rounded-full transition-all ${
                                            isUnlocked ? (isGincana ? 'text-purple-600' : 'text-secondary') : 'text-gray-200'
                                        } ${isReview ? 'opacity-20 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
                                    >
                                        {isUnlocked ? <ToggleRight size={52} /> : <ToggleLeft size={52} />}
                                    </button>
                                </div>
                            </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      )}

      {currentTab === 'classrooms' && (
          <div className="space-y-8 animate-fade-in">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-10">
                      <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
                         <Building className="text-accent" size={28} /> Gerenciar Instituições
                      </h2>
                      <button onClick={() => { setShowAddSchool(!showAddSchool); setShowAddClassroom(false); }} className="bg-primary/10 text-primary font-black text-xs px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-sm">
                          <PlusCircle size={18} /> Vincular Escola
                      </button>
                  </div>

                  {showAddSchool && (
                      <form onSubmit={handleAddSchool} className="mb-10 bg-blue-50/50 p-8 rounded-[2.5rem] border-2 border-dashed border-blue-200 flex flex-col sm:flex-row gap-4 animate-bounce-in shadow-inner">
                          <input required type="text" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} placeholder="Nome da nova instituição..." className="flex-1 p-5 rounded-3xl border-2 border-white font-bold focus:border-primary outline-none shadow-sm" />
                          <button type="submit" className="bg-primary text-white font-black px-10 py-5 rounded-3xl shadow-xl border-b-8 border-blue-700 uppercase text-xs tracking-widest active:translate-y-1 transition-all">SALVAR ESCOLA</button>
                      </form>
                  )}

                  <div className="flex flex-wrap gap-4 mb-12">
                      {teacherSchools.map(s => (
                          <div key={s} className="relative group/chip">
                            <button 
                               onClick={() => handleSwitchSchool(s)}
                               className={`pl-6 pr-16 py-5 rounded-[2rem] font-black text-sm transition-all flex items-center gap-3 border-2 shadow-sm ${
                                   tempSelectedSchool === s 
                                   ? 'bg-blue-50 border-primary text-primary' 
                                   : 'bg-white border-gray-100 text-gray-400 hover:border-primary/30'
                               }`}
                            >
                               {s}
                               {user?.school === s && <div className="w-2.5 h-2.5 bg-secondary rounded-full shadow-sm"></div>}
                            </button>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/chip:opacity-100 transition-all">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleRenameSchool(s); }}
                                  className="p-1.5 text-gray-300 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"
                                  title="Renomear"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteSchool(s); }}
                                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  title="Remover"
                                >
                                  <Trash2 size={16} />
                                </button>
                            </div>
                          </div>
                      ))}
                  </div>

                  <div className="flex justify-center md:justify-end pt-8 border-t border-gray-50">
                      <div className="bg-gray-50 px-8 py-5 rounded-3xl flex items-center gap-4 text-gray-500 font-bold text-sm shadow-inner border border-gray-100">
                         {isSwitching ? <RefreshCw className="animate-spin text-primary" /> : <Building size={24} className="text-primary" />} 
                         <span>Visualizando turmas em: <strong className="text-gray-800 ml-1 uppercase">{tempSelectedSchool || 'Nenhuma selecionada'}</strong></span>
                      </div>
                  </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                        <GraduationCap size={18} className="text-primary" /> Turmas Configuradas
                    </h2>
                    {tempSelectedSchool && (
                        <button onClick={() => { setShowAddClassroom(!showAddClassroom); setEditingClassId(null); }} className="text-secondary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all">
                            <PlusCircle size={18} /> Adicionar Nova Turma
                        </button>
                    )}
                  </div>

                  {showAddClassroom && (
                    <form onSubmit={editingClassId ? handleUpdateClassroom : handleAddClassroom} className="mb-10 p-8 bg-green-50/50 rounded-[2.5rem] border-2 border-dashed border-green-200 grid grid-cols-1 md:grid-cols-4 gap-6 animate-bounce-in shadow-inner">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-3">Ano Escolar</label>
                            <select value={newGrade} onChange={e => setNewGrade(Number(e.target.value))} className="w-full p-4 rounded-2xl border-2 border-white font-bold outline-none shadow-sm focus:border-secondary transition-all">
                                {[6,7,8,9].map(g => <option key={g} value={g}>{g}º Ano</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-3">Letra Turma</label>
                            <select required value={newClassId} onChange={e => setNewClassId(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-white font-bold outline-none shadow-sm focus:border-secondary transition-all">
                                <option value="">Selecionar...</option>
                                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase ml-3">Período</label>
                            <select required value={newShift} onChange={e => setNewShift(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-white font-bold outline-none shadow-sm focus:border-secondary transition-all">
                                <option value="">Selecionar...</option>
                                {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full bg-secondary text-white font-black py-4 rounded-2xl shadow-xl border-b-8 border-green-700 uppercase text-[10px] tracking-widest hover:brightness-105 active:translate-y-1 transition-all">
                                {editingClassId ? 'ATUALIZAR' : 'CRIAR TURMA'}
                            </button>
                        </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {viewClassrooms.map(room => (
                          <div 
                            key={room.id} 
                            onClick={() => setSelectedClassRoster(room)}
                            className="p-8 rounded-[2rem] bg-gray-50 border-2 border-transparent hover:border-primary hover:bg-white cursor-pointer transition-all flex justify-between items-center group shadow-sm active:scale-[0.98]"
                          >
                              <div className="flex items-center gap-5">
                                  <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
                                      <GraduationCap size={36} />
                                  </div>
                                  <div>
                                      <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-black text-gray-800 group-hover:text-primary transition-colors">{room.grade}º {room.classId}</h3>
                                        <span className="flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase bg-gray-100 px-3 py-1 rounded-full shadow-inner">
                                            <Clock size={10} /> {room.shift}
                                        </span>
                                      </div>
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Clique p/ Lista de Chamada</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={(e) => { e.stopPropagation(); handleEditClassroom(room); }} className="p-3 text-gray-300 hover:text-primary hover:bg-blue-50 rounded-2xl transition-all shadow-sm bg-white">
                                     <Edit3 size={20} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); removeClassroom(room.id); }} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm bg-white">
                                     <Trash2 size={20} />
                                  </button>
                              </div>
                          </div>
                      ))}
                      {viewClassrooms.length === 0 && tempSelectedSchool && (
                        <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-100 rounded-[3rem]">
                           <p className="text-gray-400 font-black italic uppercase tracking-tighter">Nenhuma turma adicionada em {tempSelectedSchool}.</p>
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
