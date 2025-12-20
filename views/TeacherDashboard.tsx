
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, AlertCircle, Lock, Unlock, Plus, Trash2, Building, Check, Save, PlusCircle, GraduationCap } from 'lucide-react';
import { MOCK_UNITS, CLASSES, SHIFTS } from '../constants';
import { useAuth } from '../context/AuthContext';

const mockAnalytics = [
  { skill: 'EF06CI01', average: 85, students: 28 },
  { skill: 'EF06CI05', average: 62, students: 28 },
  { skill: 'EF07CI01', average: 45, students: 30 },
  { skill: 'EF08CI01', average: 90, students: 25 },
];

const TeacherDashboard: React.FC = () => {
  const { user, unlockedUnitIds, toggleUnitLock, activeClassrooms, addClassroom, removeClassroom, addSchool, switchActiveSchool } = useAuth();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const currentTab = (searchParams.get('tab') as 'overview' | 'curriculum' | 'classrooms') || 'overview';

  const [newGrade, setNewGrade] = useState<number>(user?.grade || 6);
  const [newClassId, setNewClassId] = useState('A');
  const [newShift, setNewShift] = useState('Manhã');
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  
  // Estado local para seleção temporária da escola antes de "Salvar"
  const [tempSelectedSchool, setTempSelectedSchool] = useState<string>(user?.school || '');
  const [isSaving, setIsSaving] = useState(false);

  const myUnits = MOCK_UNITS.filter(u => u.grade === (user?.grade || 6));
  const myClassrooms = activeClassrooms.filter(c => c.teacherId === user?.id);
  
  // O professor só vê escolas vinculadas a ele
  const teacherSchools = user?.teacherSchools || (user?.school ? [user.school] : []);

  const handleAddClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addClassroom({
      school: user.school || '',
      grade: newGrade,
      classId: newClassId,
      shift: newShift,
      teacherId: user.id
    });
  };

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSchoolName.trim()) {
      addSchool(newSchoolName.trim());
      setTempSelectedSchool(newSchoolName.trim());
      setNewSchoolName('');
      setShowAddSchool(false);
    }
  };

  const handleSaveSchoolSwitch = () => {
    if (tempSelectedSchool && tempSelectedSchool !== user?.school) {
      setIsSaving(true);
      setTimeout(() => {
        switchActiveSchool(tempSelectedSchool);
        setIsSaving(false);
        alert("Escola ativa atualizada!");
      }, 500);
    }
  };

  return (
    <div className="pb-20">
      <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            {currentTab === 'overview' ? 'Visão Geral' : currentTab === 'curriculum' ? 'Gestão do Currículo' : 'Minhas Turmas'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
             <Building size={16} className="text-primary" />
             <p className="text-gray-500 font-bold">{user?.school} • {user?.grade}º Ano</p>
          </div>
      </div>

      {currentTab === 'overview' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-primary"><Users size={28} /></div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold uppercase">ALUNOS ATIVOS</p>
                        <p className="text-3xl font-extrabold text-gray-800">112</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-xl text-secondary"><BookOpen size={28} /></div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold uppercase">ATIVIDADES</p>
                        <p className="text-3xl font-extrabold text-gray-800">1,204</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-xl text-red-500"><AlertCircle size={28} /></div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold uppercase">ATENÇÃO</p>
                        <p className="text-3xl font-extrabold text-gray-800">5 Alunos</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Participação por Habilidade</h2>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockAnalytics}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="skill" tick={{fill: '#888', fontSize: 12}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fill: '#888', fontSize: 12}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="average" fill="#4A90E2" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>
      )}

      {currentTab === 'curriculum' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
              <div className="mb-6 text-center">
                  <h2 className="text-2xl font-black text-gray-800">Liberar Habilidades BNCC</h2>
                  <p className="text-gray-500 font-bold">Conteúdos disponíveis para {user?.school}.</p>
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
                            <button onClick={() => toggleUnitLock(unit.id)} className={`px-4 py-2 rounded-xl font-black text-xs shadow-sm transition-transform active:scale-95 border-b-4 ${isUnlocked ? 'bg-red-100 text-red-600 border-red-300' : 'bg-primary text-white border-blue-700'}`}>
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
              
              {/* BLOCO: GERENCIAR REDE ESCOLAR */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                         <Building className="text-accent" /> Gerenciar Rede Escolar
                      </h2>
                      <button onClick={() => setShowAddSchool(!showAddSchool)} className="text-primary font-black text-sm flex items-center gap-1 hover:underline">
                         <PlusCircle size={16} /> Nova Escola
                      </button>
                  </div>

                  {showAddSchool && (
                      <form onSubmit={handleCreateSchool} className="mb-6 bg-accent/5 p-4 rounded-2xl border-2 border-dashed border-accent/30 flex gap-2 animate-bounce-in">
                          <input required type="text" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} placeholder="Nome da nova escola..." className="flex-1 p-3 rounded-xl border-2 border-gray-200 font-bold focus:border-accent outline-none" />
                          <button type="submit" className="bg-accent text-dark font-black px-6 py-3 rounded-xl shadow-lg border-b-4 border-yellow-600">CADASTRAR</button>
                      </form>
                  )}

                  <div className="flex flex-wrap gap-2 mb-8">
                      {teacherSchools.map(s => (
                          <button 
                             key={s} 
                             onClick={() => setTempSelectedSchool(s)}
                             className={`px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border-2 ${
                                 tempSelectedSchool === s 
                                 ? 'bg-blue-50 border-primary text-primary shadow-sm' 
                                 : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                             }`}
                          >
                             {s}
                             {user?.school === s && <Check size={14} className="text-secondary" />}
                          </button>
                      ))}
                  </div>

                  {tempSelectedSchool !== user?.school && (
                      <div className="flex justify-end pt-4 border-t border-gray-50 animate-fade-in">
                          <button 
                             onClick={handleSaveSchoolSwitch}
                             disabled={isSaving}
                             className="bg-primary text-white font-black px-8 py-3 rounded-xl shadow-xl border-b-4 border-blue-700 flex items-center gap-2 transition-all active:translate-y-1"
                          >
                             {isSaving ? 'SALVANDO...' : <><Save size={20} /> SALVAR</>}
                          </button>
                      </div>
                  )}
              </div>

              {/* BLOCO: ADICIONAR TURMA */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Plus className="text-primary" /> Adicionar Turma em <span className="text-primary">{user?.school}</span>
                  </h2>
                  <form onSubmit={handleAddClassroom} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Ano Letivo</label>
                          <select value={newGrade} onChange={e => setNewGrade(Number(e.target.value))} className="w-full p-4 rounded-xl border-2 border-gray-100 font-bold bg-gray-50 text-gray-700 outline-none focus:border-primary">
                              {[6, 7, 8, 9].map(g => <option key={g} value={g}>{g}º Ano</option>)}
                          </select>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Identificador</label>
                          <select value={newClassId} onChange={e => setNewClassId(e.target.value)} className="w-full p-4 rounded-xl border-2 border-gray-100 font-bold bg-gray-50 text-gray-700 outline-none focus:border-primary">
                              {CLASSES.map(c => <option key={c} value={c}>Turma {c}</option>)}
                          </select>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Período</label>
                          <select value={newShift} onChange={e => setNewShift(e.target.value)} className="w-full p-4 rounded-xl border-2 border-gray-100 font-bold bg-gray-50 text-gray-700 outline-none focus:border-primary">
                              {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                      </div>
                      <div className="flex items-end">
                          <button type="submit" className="w-full bg-secondary text-white font-black py-4 rounded-xl shadow-lg border-b-4 border-green-700 hover:brightness-105 active:translate-y-1 transition-all uppercase">ADICIONAR</button>
                      </div>
                  </form>
              </div>

              {/* BLOCO: LISTAGEM */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-widest text-xs opacity-50">Suas Turmas Ativas ({user?.school})</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {myClassrooms.filter(c => c.school === user?.school).map(room => (
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
                              <button onClick={() => removeClassroom(room.id)} className="p-3 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                 <Trash2 size={24} />
                              </button>
                          </div>
                      ))}
                      {myClassrooms.filter(c => c.school === user?.school).length === 0 && (
                          <div className="col-span-full py-12 text-center text-gray-300 font-bold">
                              Nenhuma turma cadastrada nesta unidade.
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
