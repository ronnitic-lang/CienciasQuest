
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, User } from '../types';
// Fix: Renamed User icon to UserIcon to avoid naming collision with the User interface/type
import { User as UserIcon, CheckCircle, XCircle, Trash2, Building, UserCheck, Loader2, Check, FolderOpen, FileText, Eye, Download, X, Edit3, Save, Search, Users, MapPin } from 'lucide-react';
import { BRAZIL_STATES, BRAZIL_CITIES } from '../constants';

const AdminDashboard: React.FC = () => {
  const { allUsers, schoolsList, approveTeacher, deleteUser, addSchool, renameSchool, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'schools' | 'documents'>('pending');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [viewingDoc, setViewingDoc] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  
  const [editingSchool, setEditingSchool] = useState<string | null>(null);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [viewingSchoolTeachers, setViewingSchoolTeachers] = useState<string | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const pendingTeachers = allUsers.filter(u => u.role === UserRole.TEACHER && u.status === 'pending');
  const activeUsers = allUsers.filter(u => u.role !== UserRole.ADMIN).sort((a,b) => a.name.localeCompare(b.name));

  // Sincronização: Estatísticas Reais de Professores por Escola
  const schoolTeacherStats = useMemo(() => {
    const stats: Record<string, User[]> = {};
    schoolsList.forEach(s => {
      stats[s] = allUsers.filter(u => 
        u.role === UserRole.TEACHER && 
        u.status === 'active' && 
        (u.school === s || (u.teacherSchools && u.teacherSchools.includes(s)))
      );
    });
    return stats;
  }, [schoolsList, allUsers]);

  const handleApprove = async (userId: string, userSchool?: string) => {
    approveTeacher(userId);
    if (userSchool) addSchool(userSchool);
    setNotification({ message: "Professor aprovado!", type: 'success' });
    setViewingDoc(null);
  };

  const handleRenameSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchool && newSchoolName.trim()) {
      renameSchool(editingSchool, newSchoolName.trim());
      setNotification({ message: "Nome da escola atualizado para toda a rede!", type: 'success' });
      setEditingSchool(null);
    }
  };

  return (
    <div className="pb-20 relative">
      {/* School Name Edit Modal */}
      {editingSchool && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                 <h3 className="text-xl font-black mb-4">Renomear Instituição</h3>
                 <p className="text-xs text-gray-400 font-bold mb-4">A alteração afetará todos os professores e alunos vinculados a esta unidade.</p>
                 <form onSubmit={handleRenameSchoolSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Novo Nome</label>
                        <input required value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary outline-none" />
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setEditingSchool(null)} className="flex-1 py-3 font-bold text-gray-500">Cancelar</button>
                        <button type="submit" className="flex-1 py-3 bg-primary text-white font-black rounded-xl border-b-4 border-blue-700">ATUALIZAR REDE</button>
                    </div>
                 </form>
             </div>
          </div>
      )}

      {/* School Teachers Viewer Modal */}
      {viewingSchoolTeachers && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
                    <div>
                        <h3 className="font-black text-gray-800">Docentes Ativos</h3>
                        <p className="text-[10px] font-black text-primary uppercase">{viewingSchoolTeachers}</p>
                    </div>
                    <button onClick={() => setViewingSchoolTeachers(null)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"><X size={18} /></button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                    {schoolTeacherStats[viewingSchoolTeachers]?.map(t => (
                        <div key={t.id} className="p-4 bg-gray-50 border-2 border-white rounded-2xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm">
                                    {/* Fix: Using UserIcon instead of User to avoid type/value conflict */}
                                    <UserIcon size={20} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-black text-gray-700">{t.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400">{t.city}/{t.state} • {t.grade}º Ano</p>
                                </div>
                            </div>
                            <span className="bg-secondary/10 text-secondary text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-secondary/20">VALIDADO</span>
                        </div>
                    ))}
                    {schoolTeacherStats[viewingSchoolTeachers]?.length === 0 && (
                        <div className="text-center py-10">
                            <Users size={40} className="mx-auto text-gray-200 mb-2" />
                            <p className="text-gray-400 font-bold italic">Nenhum professor ativo nesta unidade.</p>
                        </div>
                    )}
                </div>
             </div>
          </div>
      )}

      {/* Admin Panel Headers */}
      <div className="bg-dark text-white p-8 rounded-3xl mb-8 shadow-lg">
          <h1 className="text-3xl font-extrabold mb-2">Painel Administrativo</h1>
          <p className="opacity-80">Controle de segurança e infraestrutura escolar.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveTab('pending')} className={`px-6 py-3 rounded-xl font-black whitespace-nowrap transition-all ${activeTab === 'pending' ? 'bg-secondary text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>PENDENTES ({pendingTeachers.length})</button>
          <button onClick={() => setActiveTab('users')} className={`px-6 py-3 rounded-xl font-black whitespace-nowrap transition-all ${activeTab === 'users' ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>USUÁRIOS ({activeUsers.length})</button>
          <button onClick={() => setActiveTab('schools')} className={`px-6 py-3 rounded-xl font-black whitespace-nowrap transition-all ${activeTab === 'schools' ? 'bg-accent text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>ESCOLAS ({schoolsList.length})</button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden min-h-[450px]">
          {activeTab === 'schools' && (
              <div className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {schoolsList.map((school, idx) => (
                         <div key={idx} className="p-6 rounded-3xl border-2 border-gray-100 bg-white flex flex-col gap-4 hover:border-accent/20 transition-all">
                             <div className="flex justify-between items-start">
                                 <div className="flex items-center gap-3">
                                     <div className="bg-accent/10 p-2 rounded-xl text-accent"><Building size={24} /></div>
                                     <div>
                                         <h3 className="font-black text-gray-800 leading-tight">{school}</h3>
                                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{schoolTeacherStats[school]?.length || 0} Docentes vinculados</p>
                                     </div>
                                 </div>
                                 <button onClick={() => { setEditingSchool(school); setNewSchoolName(school); }} className="p-2 text-gray-300 hover:text-primary transition-colors hover:bg-blue-50 rounded-lg"><Edit3 size={18} /></button>
                             </div>
                             <button onClick={() => setViewingSchoolTeachers(school)} className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border-b-4 border-gray-200 active:translate-y-0.5 transition-all">
                                 <Users size={14} /> VER PROFESSORES
                             </button>
                         </div>
                     ))}
                 </div>
              </div>
          )}

          {activeTab === 'pending' && (
              <div className="p-6 space-y-4">
                  {pendingTeachers.map(t => (
                      <div key={t.id} className="p-6 bg-white border-2 border-gray-100 rounded-3xl flex justify-between items-center hover:border-secondary/20 transition-all animate-fade-in">
                          <div>
                              <p className="font-black text-lg text-gray-800">{t.name}</p>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.school} • {t.city}/{t.state}</p>
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => setViewingDoc(t)} className="px-4 py-2.5 bg-blue-50 text-primary font-black text-xs rounded-xl flex items-center gap-2 hover:bg-blue-100 transition-colors uppercase"><Eye size={16} /> Ver Doc</button>
                              <button onClick={() => handleApprove(t.id, t.school)} className="px-6 py-2.5 bg-secondary text-white font-black text-xs rounded-xl border-b-4 border-green-700 hover:brightness-105 transition-all uppercase">APROVAR</button>
                          </div>
                      </div>
                  ))}
                  {pendingTeachers.length === 0 && (
                      <div className="text-center py-20 text-gray-400">
                          <Check size={40} className="mx-auto mb-2 opacity-20" />
                          <p className="font-black">Sem pendências no momento!</p>
                      </div>
                  )}
              </div>
          )}
          
          {/* Aba Usuários pode ser expandida aqui seguindo a mesma estética */}
      </div>
    </div>
  );
};

export default AdminDashboard;
