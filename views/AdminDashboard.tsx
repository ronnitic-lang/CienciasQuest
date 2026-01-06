
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  User as UserIcon, CheckCircle, XCircle, Trash2, Building, 
  Users, Search, ShieldAlert, FileText, Check, X, Edit3, 
  Ban, ShieldCheck, Mail, MapPin, ChevronDown, ChevronUp, GraduationCap,
  BookOpen, ExternalLink, Plus
} from 'lucide-react';
import { BRAZIL_STATES } from '../constants';

const AdminDashboard: React.FC = () => {
  const { 
    allUsers, schoolsList, approveTeacher, deleteUser, 
    toggleUserStatus, addSchool, renameSchool, deleteSchool, addCity, citiesList 
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'schools' | 'locations'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  
  // Location States
  const [newCityName, setNewCityName] = useState('');
  const [newCityState, setNewCityState] = useState('CE');

  const pendingTeachers = allUsers.filter(u => u.role === UserRole.TEACHER && u.status === 'pending');
  
  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => 
      u.role !== UserRole.ADMIN &&
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       u.school?.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a,b) => a.name.localeCompare(b.name));
  }, [allUsers, searchTerm]);

  const filteredSchools = useMemo(() => {
    return schoolsList.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a,b) => a.localeCompare(b));
  }, [schoolsList, searchTerm]);

  const getSchoolStats = (schoolName: string) => {
    const members = allUsers.filter(u => u.school === schoolName || u.teacherSchools?.includes(schoolName));
    return {
        teachers: members.filter(m => m.role === UserRole.TEACHER),
        students: members.filter(m => m.role === UserRole.STUDENT)
    };
  };

  return (
    <div className="pb-20 animate-fade-in">
      <div className="bg-dark text-white p-8 rounded-3xl mb-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black mb-2 tracking-tight">Painel de Controle</h1>
            <p className="opacity-70 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} /> Administração Geral CienciasQuest
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <ShieldAlert size={120} />
          </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
              { id: 'pending', label: 'VALIDAÇÕES', count: pendingTeachers.length, color: 'secondary' },
              { id: 'users', label: 'USUÁRIOS', count: filteredUsers.length, color: 'primary' },
              { id: 'schools', label: 'ESCOLAS', count: schoolsList.length, color: 'accent' },
              { id: 'locations', label: 'CIDADES', color: 'dark' }
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-6 py-4 rounded-2xl font-black whitespace-nowrap transition-all border-b-4 ${
                    activeTab === tab.id 
                    ? `bg-gray-800 text-white border-gray-900 shadow-lg -translate-y-1` 
                    : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                }`}
              >
                {tab.label} {tab.count !== undefined && `(${tab.count})`}
              </button>
          ))}
      </div>

      {activeTab !== 'locations' && (
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
                type="text" 
                placeholder={`Buscar por ${activeTab === 'schools' ? 'instituição' : 'nome ou email'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 rounded-3xl border-2 border-gray-100 font-bold focus:border-primary outline-none shadow-sm"
            />
          </div>
      )}

      <div className="space-y-4">
          {activeTab === 'pending' && (
              pendingTeachers.length > 0 ? pendingTeachers.map(t => (
                  <div key={t.id} className="p-6 bg-white border-b-4 border-gray-200 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 hover:border-secondary transition-all">
                      <div className="flex items-center gap-5 w-full">
                          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary">
                              <FileText size={32} />
                          </div>
                          <div>
                              <p className="font-black text-xl text-gray-800 leading-none mb-1">{t.name}</p>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.school} • {t.city}/{t.state}</p>
                              <div className="mt-2 flex items-center gap-2">
                                  <span className="bg-blue-100 text-blue-600 text-[8px] font-black px-2 py-1 rounded-lg">DOCÊNCIA</span>
                                  {t.proofFileUrl && (
                                      <a href={t.proofFileUrl.startsWith('http') ? t.proofFileUrl : '#'} target="_blank" className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-[8px] font-black px-2 py-1 rounded-lg">
                                          <ExternalLink size={10} /> VER COMPROVANTE
                                      </a>
                                  )}
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                          <button onClick={() => approveTeacher(t.id)} className="flex-1 md:flex-none px-8 py-4 bg-secondary text-white font-black text-xs rounded-2xl border-b-4 border-green-700 hover:brightness-105 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                            <Check size={18} /> APROVAR
                          </button>
                          <button onClick={() => deleteUser(t.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors">
                            <Trash2 size={24} />
                          </button>
                      </div>
                  </div>
              )) : (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                      <p className="text-gray-400 font-bold italic">Nenhuma validação pendente no momento.</p>
                  </div>
              )
          )}

          {activeTab === 'users' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUsers.map(u => (
                      <div key={u.id} className={`p-6 bg-white border-b-4 rounded-3xl flex flex-col gap-4 transition-all ${u.status === 'blocked' ? 'border-red-200 opacity-60' : 'border-gray-200 hover:border-primary'}`}>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${u.role === UserRole.TEACHER ? 'bg-green-100 text-secondary' : 'bg-blue-100 text-primary'}`}>
                                      {u.role === UserRole.TEACHER ? 'P' : 'A'}
                                  </div>
                                  <div>
                                      <h3 className="font-black text-gray-800 leading-none mb-1">{u.name}</h3>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase">{u.email}</p>
                                  </div>
                              </div>
                              <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase ${u.status === 'active' ? 'bg-green-50 text-secondary' : 'bg-red-50 text-red-500'}`}>
                                  {u.status === 'active' ? 'ATIVO' : 'SUSPENSO'}
                              </span>
                          </div>
                          <div className="flex gap-2 pt-2 border-t">
                             <button onClick={() => toggleUserStatus(u.id)} className="flex-1 py-2 rounded-xl font-black text-[10px] uppercase bg-gray-100 text-gray-600 hover:bg-gray-200">
                                {u.status === 'active' ? 'Suspender' : 'Reativar'}
                             </button>
                             <button onClick={() => deleteUser(u.id)} className="px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100">
                                <Trash2 size={16} />
                             </button>
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {activeTab === 'schools' && (
              <div className="space-y-3">
                  {filteredSchools.map(school => {
                    const stats = getSchoolStats(school);
                    const isExpanded = expandedSchool === school;

                    return (
                        <div key={school} className={`bg-white rounded-2xl border-2 transition-all overflow-hidden ${isExpanded ? 'border-accent shadow-lg' : 'border-gray-100'}`}>
                            <div 
                                className="p-5 flex items-center justify-between cursor-pointer group"
                                onClick={() => setExpandedSchool(isExpanded ? null : school)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-accent/10 p-3 rounded-xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                        <Building size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-800">{school}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                <Users size={12}/> {stats.students.length} Alunos
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                <BookOpen size={12}/> {stats.teachers.length} Professores
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-300">
                                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </div>
                            </div>
                            
                            {isExpanded && (
                                <div className="px-5 pb-5 bg-gray-50 border-t animate-fade-in pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Professores Vinculados</p>
                                            <div className="space-y-2">
                                                {stats.teachers.length > 0 ? stats.teachers.map(t => (
                                                    <div key={t.id} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-100 text-xs font-bold">
                                                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                                        {t.name}
                                                    </div>
                                                )) : <p className="text-[10px] italic text-gray-400">Nenhum professor registrado.</p>}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Alunos Ativos</p>
                                            <div className="space-y-2">
                                                {stats.students.length > 0 ? stats.students.map(s => (
                                                    <div key={s.id} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-100 text-xs font-bold">
                                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                        {s.name} ({s.grade}º {s.classId})
                                                    </div>
                                                )) : <p className="text-[10px] italic text-gray-400">Nenhum aluno registrado.</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t flex justify-end">
                                        <button onClick={() => deleteSchool(school)} className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase flex items-center gap-1">
                                            <Trash2 size={12}/> Remover Instituição
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                  })}
              </div>
          )}

          {activeTab === 'locations' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                  <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                      <MapPin className="text-primary" /> Gestão de Cidades
                  </h2>
                  <form 
                    onSubmit={(e) => { e.preventDefault(); if (newCityName) { addCity(newCityState, newCityName); setNewCityName(''); } }}
                    className="flex flex-col sm:flex-row gap-4 mb-10 p-4 bg-gray-50 rounded-2xl"
                  >
                      <select value={newCityState} onChange={e => setNewCityState(e.target.value)} className="p-4 rounded-xl border-2 border-white font-bold outline-none">
                          {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input 
                        type="text" 
                        value={newCityName} 
                        onChange={e => setNewCityName(e.target.value)} 
                        placeholder="Nome da nova cidade..." 
                        className="flex-1 p-4 rounded-xl border-2 border-white font-bold outline-none"
                      />
                      <button type="submit" className="bg-primary text-white font-black px-8 py-4 rounded-xl flex items-center gap-2 justify-center">
                          <Plus size={20} /> ADICIONAR
                      </button>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(citiesList).map(([state, cities]) => (cities as string[]).length > 0 && (
                          <div key={state} className="space-y-3">
                              <p className="font-black text-primary border-b-2 border-primary/20 pb-1">{state}</p>
                              <div className="flex flex-wrap gap-2">
                                  {(cities as string[]).map(c => (
                                      <span key={c} className="bg-white border-2 border-gray-100 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500">
                                          {c}
                                      </span>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default AdminDashboard;
