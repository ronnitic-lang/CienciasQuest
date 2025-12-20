
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, AlertCircle, Lock, Unlock, Plus, Trash2, Clock, Hash, Building } from 'lucide-react';
import { MOCK_UNITS, CLASSES, SHIFTS } from '../constants';
import { useAuth } from '../context/AuthContext';

const mockAnalytics = [
  { skill: 'EF06CI01', average: 85, students: 28 },
  { skill: 'EF06CI05', average: 62, students: 28 },
  { skill: 'EF07CI01', average: 45, students: 30 },
  { skill: 'EF08CI01', average: 90, students: 25 },
];

const TeacherDashboard: React.FC = () => {
  const { user, unlockedUnitIds, toggleUnitLock, activeClassrooms, addClassroom, removeClassroom, addSchool, schoolsList } = useAuth();
  const location = useLocation();
  
  // Sincroniza tab com URL query
  const searchParams = new URLSearchParams(location.search);
  const currentTab = (searchParams.get('tab') as 'overview' | 'curriculum' | 'classrooms') || 'overview';

  // State
  const [newClassId, setNewClassId] = useState('A');
  const [newShift, setNewShift] = useState('Manhã');
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');

  const myUnits = MOCK_UNITS.filter(u => u.grade === (user?.grade || 6));
  const myClassrooms = activeClassrooms.filter(c => c.teacherId === user?.id);

  const handleAddClassroom = (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      addClassroom({
          school: user.school || '',
          grade: user.grade || 6,
          classId: newClassId,
          shift: newShift,
          teacherId: user.id
      });
  };

  const handleCreateSchool = (e: React.FormEvent) => {
      e.preventDefault();
      if (newSchoolName.trim()) {
          addSchool(newSchoolName.trim());
          setNewSchoolName('');
          setShowAddSchool(false);
          alert("Escola cadastrada com sucesso!");
      }
  };

  return (
    <div className="pb-20">
      <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            {currentTab === 'overview' ? 'Visão Geral' : currentTab === 'curriculum' ? 'Gestão do Currículo' : 'Minhas Turmas'}
          </h1>
          <p className="text-gray-500 font-bold">{user?.school} • {user?.grade}º Ano</p>
      </div>

      {currentTab === 'overview' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-primary"><Users size={28} /></div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold">ALUNOS ATIVOS</p>
                        <p className="text-3xl font-extrabold text-gray-800">112</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-xl text-secondary"><BookOpen size={28} /></div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold">ATIVIDADES</p>
                        <p className="text-3xl font-extrabold text-gray-800">1,204</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-xl text-red-500"><AlertCircle size={28} /></div>
                    <div>
                        <p className="text-gray-400 text-sm font-bold">ATENÇÃO</p>
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
              <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Liberar Habilidades BNCC</h2>
                  <p className="text-gray-500">Selecione quais conteúdos estão disponíveis para sua turma agora.</p>
              </div>
              <div className="space-y-3">
                  {myUnits.map((unit) => {
                      const isUnlocked = unlockedUnitIds.includes(unit.id);
                      return (
                        <div key={unit.id} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${isUnlocked ? 'border-secondary bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${isUnlocked ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    {isUnlocked ? <Unlock size={20} /> : <Lock size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-gray-800">{unit.title}</h3>
                                    <p className="text-xs text-gray-600">{unit.description}</p>
                                </div>
                            </div>
                            <button onClick={() => toggleUnitLock(unit.id)} className={`px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-transform active:scale-95 ${isUnlocked ? 'bg-red-100 text-red-600' : 'bg-primary text-white'}`}>
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
              {/* Opção de Cadastrar Escola */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                          <Building className="text-accent" /> Gerenciar Rede Escolar
                      </h2>
                      <button onClick={() => setShowAddSchool(!showAddSchool)} className="text-primary font-bold text-sm hover:underline">
                          {showAddSchool ? 'Cancelar' : '+ Nova Escola'}
                      </button>
                  </div>
                  
                  {showAddSchool && (
                      <form onSubmit={handleCreateSchool} className="mb-6 bg-accent/10 p-4 rounded-xl flex gap-3 animate-fade-in">
                          <input required type="text" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} placeholder="Nome completo da escola" className="flex-1 p-3 rounded-xl border-2 border-accent/30 font-bold focus:border-accent outline-none" />
                          <button type="submit" className="bg-accent text-dark font-black px-6 py-3 rounded-xl shadow-lg border-b-4 border-yellow-600">CADASTRAR</button>
                      </form>
                  )}

                  <div className="flex flex-wrap gap-2">
                      {schoolsList.map(s => (
                          <span key={s} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">{s}</span>
                      ))}
                  </div>
              </div>

              {/* Formulário Turma */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Plus className="text-primary" /> Adicionar Turma</h2>
                  <form onSubmit={handleAddClassroom} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select value={newClassId} onChange={e => setNewClassId(e.target.value)} className="p-3 rounded-xl border-2 border-gray-200 font-bold bg-white">
                          {CLASSES.map(c => <option key={c} value={c}>Turma {c}</option>)}
                      </select>
                      <select value={newShift} onChange={e => setNewShift(e.target.value)} className="p-3 rounded-xl border-2 border-gray-200 font-bold bg-white">
                          {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button type="submit" className="bg-secondary text-white font-extrabold py-3 rounded-xl shadow-lg border-b-4 border-green-700">ADICIONAR</button>
                  </form>
              </div>

              {/* Listagem Turmas */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Suas Turmas Ativas</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {myClassrooms.map(room => (
                          <div key={room.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex justify-between items-center group">
                              <div>
                                  <h3 className="text-2xl font-black text-primary">TURMA {room.classId}</h3>
                                  <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{room.shift}</p>
                              </div>
                              <button onClick={() => removeClassroom(room.id)} className="p-3 text-red-300 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
