
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, User } from '../types';
import { 
  User as UserIcon, CheckCircle, XCircle, Trash2, Building, 
  Users, Search, ShieldAlert, FileText, Check, X, Edit3, 
  Ban, ShieldCheck, Mail, MapPin 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { 
    allUsers, schoolsList, approveTeacher, deleteUser, 
    toggleUserStatus, addSchool, renameSchool, deleteSchool, updateUser 
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'schools'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSchool, setEditingSchool] = useState<string | null>(null);
  const [newSchoolName, setNewSchoolName] = useState('');

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

  return (
    <div className="pb-20 animate-fade-in">
      <div className="bg-dark text-white p-8 rounded-3xl mb-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black mb-2 tracking-tight">Painel de Controle</h1>
            <p className="opacity-70 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} /> Administração de Segurança CienciasQuest
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <ShieldAlert size={120} />
          </div>
      </div>

      {/* Navegação de Abas */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveTab('pending')} className={`px-8 py-4 rounded-2xl font-black whitespace-nowrap transition-all border-b-4 ${activeTab === 'pending' ? 'bg-secondary text-white border-green-700 shadow-lg -translate-y-1' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}>
            VALIDAÇÕES ({pendingTeachers.length})
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-8 py-4 rounded-2xl font-black whitespace-nowrap transition-all border-b-4 ${activeTab === 'users' ? 'bg-primary text-white border-blue-700 shadow-lg -translate-y-1' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}>
            USUÁRIOS ({filteredUsers.length})
          </button>
          <button onClick={() => setActiveTab('schools')} className={`px-8 py-4 rounded-2xl font-black whitespace-nowrap transition-all border-b-4 ${activeTab === 'schools' ? 'bg-accent text-white border-yellow-600 shadow-lg -translate-y-1' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}>
            ESCOLAS ({schoolsList.length})
          </button>
      </div>

      {/* Barra de Busca */}
      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
        <input 
            type="text" 
            placeholder={`Buscar por ${activeTab === 'schools' ? 'instituição' : 'nome ou email'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 rounded-3xl border-2 border-gray-100 font-bold focus:border-primary focus:bg-white outline-none bg-white transition-all shadow-sm"
        />
      </div>

      <div className="space-y-4">
          {activeTab === 'pending' && (
              pendingTeachers.map(t => (
                  <div key={t.id} className="p-6 bg-white border-b-4 border-gray-200 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 hover:border-secondary transition-all">
                      <div className="flex items-center gap-5 w-full">
                          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary border-2 border-blue-100">
                              <FileText size={32} />
                          </div>
                          <div>
                              <p className="font-black text-xl text-gray-800 leading-none mb-1">{t.name}</p>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.school} • {t.city}/{t.state}</p>
                              <div className="mt-2 flex gap-2">
                                  <span className="bg-blue-100 text-blue-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase">SOLICITAÇÃO DOCENTE</span>
                                  <span className="bg-gray-100 text-gray-500 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">AGUARDANDO DOC</span>
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                          <button onClick={() => approveTeacher(t.id)} className="flex-1 md:flex-none px-8 py-4 bg-secondary text-white font-black text-xs rounded-2xl border-b-4 border-green-700 hover:brightness-105 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                            <Check size={18} /> VALIDAR CADASTRO
                          </button>
                          <button onClick={() => deleteUser(t.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors">
                            <Trash2 size={24} />
                          </button>
                      </div>
                  </div>
              ))
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
                              <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase border ${u.status === 'active' ? 'bg-green-50 text-secondary border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                                  {u.status === 'active' ? 'ATIVO' : 'SUSPENSO'}
                              </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                             <div className="bg-gray-50 p-3 rounded-2xl">
                                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Instituição</p>
                                <p className="text-[10px] font-bold text-gray-700 truncate">{u.school || 'Não vinculada'}</p>
                             </div>
                             <div className="bg-gray-50 p-3 rounded-2xl">
                                <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Localização</p>
                                <p className="text-[10px] font-bold text-gray-700 truncate">{u.city}/{u.state}</p>
                             </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                             <button onClick={() => toggleUserStatus(u.id)} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 transition-all ${u.status === 'active' ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500' : 'bg-green-100 text-secondary hover:bg-green-200'}`}>
                                {u.status === 'active' ? <><Ban size={14} /> Suspender</> : <><Check size={14} /> Reativar</>}
                             </button>
                             <button onClick={() => deleteUser(u.id)} className="px-5 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                                <Trash2 size={16} />
                             </button>
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {activeTab === 'schools' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSchools.map(school => (
                      <div key={school} className="p-6 bg-white border-b-4 border-gray-100 rounded-3xl hover:border-accent transition-all group">
                          {editingSchool === school ? (
                              <div className="space-y-4">
                                  <input 
                                      value={newSchoolName} 
                                      onChange={e => setNewSchoolName(e.target.value)}
                                      className="w-full p-4 rounded-xl border-2 border-primary outline-none font-bold"
                                  />
                                  <div className="flex gap-2">
                                      <button onClick={() => { renameSchool(school, newSchoolName); setEditingSchool(null); }} className="flex-1 bg-primary text-white py-2 rounded-xl font-black text-xs uppercase">Salvar</button>
                                      <button onClick={() => setEditingSchool(null)} className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-xl font-black text-xs uppercase">X</button>
                                  </div>
                              </div>
                          ) : (
                              <div className="flex flex-col gap-4">
                                  <div className="flex items-start justify-between">
                                      <div className="bg-accent/10 p-3 rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-all">
                                          <Building size={24} />
                                      </div>
                                      <div className="flex gap-1">
                                          <button onClick={() => { setEditingSchool(school); setNewSchoolName(school); }} className="p-2 text-gray-300 hover:text-primary transition-colors"><Edit3 size={18} /></button>
                                          <button onClick={() => deleteSchool(school)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                      </div>
                                  </div>
                                  <h3 className="font-black text-gray-800 leading-tight h-10 overflow-hidden line-clamp-2">{school}</h3>
                                  <div className="flex items-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">
                                      <Users size={12} /> Unidade Integrada
                                  </div>
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          )}

          {(activeTab === 'pending' && pendingTeachers.length === 0) || 
           (activeTab === 'users' && filteredUsers.length === 0) ||
           (activeTab === 'schools' && filteredSchools.length === 0) ? (
              <div className="text-center py-32 bg-white/50 rounded-3xl border-2 border-dashed border-gray-100">
                  <X size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold italic">Nenhum registro encontrado para esta seção.</p>
              </div>
          ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;
