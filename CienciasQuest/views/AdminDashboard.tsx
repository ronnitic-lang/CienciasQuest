
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, User } from '../types';
import { 
  User as UserIcon, CheckCircle, XCircle, Trash2, Building, 
  Users, Search, ShieldAlert, FileText, Check, X, Edit3, 
  Ban, ShieldCheck, Mail, MapPin, ChevronDown, ChevronUp, GraduationCap,
  BookOpen, ExternalLink, Plus, Clock, KeyRound, Phone, Save
} from 'lucide-react';
import { BRAZIL_STATES } from '../constants';

const AdminDashboard: React.FC = () => {
  const { 
    allUsers, schoolsList, activeClassrooms, approveTeacher, deleteUser, 
    toggleUserStatus, addSchool, renameSchool, deleteSchool, addCity, citiesList, updateUser 
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'schools' | 'locations'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
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

  const getSchoolDetails = (schoolName: string) => {
    const teachers = allUsers.filter(u => u.role === UserRole.TEACHER && (u.school === schoolName || u.teacherSchools?.includes(schoolName)));
    const classrooms = activeClassrooms.filter(c => c.school === schoolName);
    const students = allUsers.filter(u => u.role === UserRole.STUDENT && u.school === schoolName);
    return { teachers, classrooms, students };
  };

  const handleUpdateUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingUser) {
          updateUser(editingUser.id, { ...editingUser });
          setEditingUser(null);
      }
  };

  return (
    <div className="pb-20 animate-fade-in">
      {/* MODAL DE EDIÇÃO DE USUÁRIO */}
      {editingUser && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-bounce-in border-b-8 border-gray-200">
                  <div className="p-8 border-b flex justify-between items-center bg-gray-50">
                      <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                          <Edit3 size={24} className="text-primary" /> Editar Cadastro
                      </h3>
                      <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={24} /></button>
                  </div>
                  <form onSubmit={handleUpdateUser} className="p-8 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome</label>
                              <input required value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary outline-none" />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                              <input required value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary outline-none" />
                          </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
                              <input value={editingUser.whatsapp || ''} onChange={e => setEditingUser({...editingUser, whatsapp: e.target.value})} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary outline-none" />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nova Senha</label>
                              <input placeholder="Digite para alterar..." value={editingUser.password || ''} onChange={e => setEditingUser({...editingUser, password: e.target.value})} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary outline-none" />
                          </div>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instituição</label>
                          <select value={editingUser.school} onChange={e => setEditingUser({...editingUser, school: e.target.value})} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold outline-none">
                              {schoolsList.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                      </div>
                      <button type="submit" className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-blue-700 uppercase tracking-widest flex items-center justify-center gap-2 mt-4 active:translate-y-1 transition-all">
                          <Save size={20} /> SALVAR ALTERAÇÕES
                      </button>
                  </form>
              </div>
          </div>
      )}

      <div className="bg-dark text-white p-8 rounded-3xl mb-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black mb-2 tracking-tight uppercase">Painel Geral</h1>
            <p className="opacity-70 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} /> Administração em Tempo Real
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <ShieldAlert size={120} />
          </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
              { id: 'pending', label: 'VALIDAÇÕES', count: pendingTeachers.length },
              { id: 'users', label: 'USUÁRIOS', count: filteredUsers.length },
              { id: 'schools', label: 'ESCOLAS', count: schoolsList.length },
              { id: 'locations', label: 'TERRITÓRIOS' }
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
                placeholder={`Pesquisar em ${activeTab === 'schools' ? 'escolas' : 'registros'}...`}
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
                                  <span className="flex items-center gap-1 bg-green-50 text-secondary text-[8px] font-black px-2 py-1 rounded-lg">
                                      <Phone size={10} /> {t.whatsapp || 'Sem WhatsApp'}
                                  </span>
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
                      <p className="text-gray-400 font-bold italic">Nada para validar no momento.</p>
                  </div>
              )
          )}

          {activeTab === 'users' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUsers.map(u => (
                      <div key={u.id} className={`p-6 bg-white border-b-4 rounded-3xl flex flex-col gap-4 transition-all ${u.status === 'blocked' ? 'border-red-200 opacity-60' : 'border-gray-200 hover:border-primary shadow-sm'}`}>
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
                              <div className="flex flex-col items-end gap-1">
                                  <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase ${u.status === 'active' ? 'bg-green-50 text-secondary' : 'bg-red-50 text-red-500'}`}>
                                      {u.status === 'active' ? 'ATIVO' : 'SUSPENSO'}
                                  </span>
                                  {u.whatsapp && <span className="text-[8px] font-bold text-gray-400 flex items-center gap-1"><Phone size={8}/> {u.whatsapp}</span>}
                              </div>
                          </div>
                          <div className="space-y-1">
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                  <Building size={10} /> {u.school || 'Sem escola'}
                              </p>
                              {u.role === UserRole.STUDENT && (
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                      <GraduationCap size={10} /> {u.grade}º {u.classId} ({u.shift})
                                  </p>
                              )}
                          </div>
                          <div className="flex gap-2 pt-2 border-t">
                             <button onClick={() => setEditingUser(u)} className="p-2 bg-blue-50 text-primary rounded-xl hover:bg-blue-100 transition-colors">
                                <Edit3 size={16} />
                             </button>
                             <button onClick={() => toggleUserStatus(u.id)} className="flex-1 py-2 rounded-xl font-black text-[10px] uppercase bg-gray-100 text-gray-600 hover:bg-gray-200">
                                {u.status === 'active' ? 'Bloquear' : 'Reativar'}
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
              <div className="space-y-4">
                  {filteredSchools.map(school => {
                    const { teachers, classrooms, students } = getSchoolDetails(school);
                    const isExpanded = expandedSchool === school;

                    return (
                        <div key={school} className={`bg-white rounded-3xl border-2 transition-all overflow-hidden ${isExpanded ? 'border-accent shadow-lg' : 'border-gray-100'}`}>
                            <div 
                                className="p-6 flex items-center justify-between cursor-pointer group"
                                onClick={() => setExpandedSchool(isExpanded ? null : school)}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="bg-accent/10 p-4 rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                        <Building size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-800 text-xl">{school}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                                                <Users size={12}/> {students.length} Estudantes
                                            </span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                                                <BookOpen size={12}/> {teachers.length} Docentes
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-300">
                                    {isExpanded ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
                                </div>
                            </div>
                            
                            {isExpanded && (
                                <div className="p-6 bg-gray-50 border-t animate-fade-in space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <BookOpen size={14} className="text-secondary"/> Docentes e Turmas
                                                </p>
                                                <div className="space-y-3">
                                                    {teachers.map(t => {
                                                        const teacherClassrooms = classrooms.filter(c => c.teacherId === t.id);
                                                        return (
                                                            <div key={t.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                                                <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-50">
                                                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-secondary font-black text-xs">P</div>
                                                                    <p className="font-black text-gray-700 text-sm">{t.name}</p>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {teacherClassrooms.length > 0 ? teacherClassrooms.map(c => (
                                                                        <span key={c.id} className="bg-blue-50 text-primary text-[9px] font-black px-2 py-1 rounded-lg border border-blue-100 flex items-center gap-1">
                                                                            <Clock size={8}/> {c.grade}º{c.classId} - {c.shift}
                                                                        </span>
                                                                    )) : <p className="text-[9px] italic text-gray-400">Sem turmas configuradas.</p>}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Users size={14} className="text-primary"/> Alunos da Unidade
                                            </p>
                                            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 max-h-[300px] overflow-y-auto custom-scrollbar shadow-inner">
                                                {students.length > 0 ? students.map(s => (
                                                    <div key={s.id} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-primary font-black text-[8px]">A</div>
                                                            <p className="text-xs font-bold text-gray-600">{s.name}</p>
                                                        </div>
                                                        <span className="text-[8px] font-black text-gray-400 uppercase">
                                                            {s.grade}º{s.classId}
                                                        </span>
                                                    </div>
                                                )) : (
                                                    <div className="p-8 text-center text-[10px] text-gray-400 italic">Nenhum registro encontrado.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
                                        <button onClick={() => {
                                            const newName = prompt("Digite o novo nome para esta escola:", school);
                                            if (newName && newName !== school) renameSchool(school, newName);
                                        }} className="text-[10px] font-black uppercase text-primary bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2">
                                            <Edit3 size={12}/> Renomear
                                        </button>
                                        <button onClick={() => {
                                            if (confirm(`Excluir a escola "${school}"? Os usuários não serão apagados.`)) {
                                                deleteSchool(school);
                                            }
                                        }} className="text-[10px] font-black uppercase text-red-500 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2">
                                            <Trash2 size={12}/> Remover
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
                    className="flex flex-col sm:flex-row gap-4 mb-10 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
                  >
                      <div className="flex-1 space-y-4">
                          <div className="flex gap-4">
                              <select value={newCityState} onChange={e => setNewCityState(e.target.value)} className="p-4 rounded-xl border-2 border-white font-bold outline-none shadow-sm">
                                  {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <input 
                                type="text" 
                                value={newCityName} 
                                onChange={e => setNewCityName(e.target.value)} 
                                placeholder="Nome da cidade..." 
                                className="flex-1 p-4 rounded-xl border-2 border-white font-bold outline-none shadow-sm"
                              />
                          </div>
                      </div>
                      <button type="submit" className="bg-primary text-white font-black px-10 py-4 rounded-xl flex items-center gap-2 justify-center shadow-lg border-b-4 border-blue-700 active:translate-y-1 transition-all">
                          <Plus size={20} /> ADICIONAR
                      </button>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(citiesList).map(([state, cities]) => (cities as string[]).length > 0 && (
                          <div key={state} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                              <div className="flex items-center justify-between border-b pb-2">
                                  <p className="font-black text-primary">{state}</p>
                                  <span className="bg-gray-100 text-[10px] font-black px-2 py-0.5 rounded-lg text-gray-400">{(cities as string[]).length} CIDADES</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                  {(cities as string[]).map(c => (
                                      <span key={c} className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 flex items-center gap-2">
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
