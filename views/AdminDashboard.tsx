
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, User } from '../types';
import { CheckCircle, XCircle, Trash2, Building, UserCheck, Loader2, Check, FolderOpen, FileText, Eye, Download, X, Edit3, Save, Search, Users, MapPin } from 'lucide-react';
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

  const schoolTeacherStats = useMemo(() => {
    const stats: Record<string, User[]> = {};
    schoolsList.forEach(s => {
      stats[s] = allUsers.filter(u => u.role === UserRole.TEACHER && (u.school === s || u.teacherSchools?.includes(s)));
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
      setNotification({ message: "Nome da escola atualizado!", type: 'success' });
      setEditingSchool(null);
    }
  };

  return (
    <div className="pb-20 relative">
      {/* School Name Edit Modal */}
      {editingSchool && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                 <h3 className="text-xl font-black mb-4">Renomear Escola</h3>
                 <form onSubmit={handleRenameSchoolSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-black text-gray-400 uppercase">Novo Nome</label>
                        <input required value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold" />
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setEditingSchool(null)} className="flex-1 py-3 font-bold text-gray-500">Cancelar</button>
                        <button type="submit" className="flex-1 py-3 bg-primary text-white font-black rounded-xl border-b-4 border-blue-700">SALVAR</button>
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
                    <h3 className="font-black">Docentes: {viewingSchoolTeachers}</h3>
                    <button onClick={() => setViewingSchoolTeachers(null)} className="p-2 bg-gray-200 rounded-full"><X size={18} /></button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                    {schoolTeacherStats[viewingSchoolTeachers]?.map(t => (
                        <div key={t.id} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                            <div>
                                <p className="font-black text-gray-700">{t.name}</p>
                                <p className="text-[10px] font-bold text-gray-400">{t.city}/{t.state}</p>
                            </div>
                            <span className="bg-secondary/10 text-secondary text-[10px] font-black px-2 py-1 rounded-lg uppercase">ATIVO</span>
                        </div>
                    ))}
                    {schoolTeacherStats[viewingSchoolTeachers]?.length === 0 && <p className="text-center text-gray-400 py-10 font-bold">Nenhum professor ativo nesta unidade.</p>}
                </div>
             </div>
          </div>
      )}

      {/* Header and Notifications (Rest of existing Admin code...) */}
      <div className="bg-dark text-white p-8 rounded-3xl mb-8 shadow-lg">
          <h1 className="text-3xl font-extrabold mb-2">Painel Administrativo</h1>
          <p className="opacity-80">Gestão de segurança e governança de dados.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveTab('pending')} className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === 'pending' ? 'bg-secondary text-white' : 'bg-white text-gray-500'}`}>Pendentes ({pendingTeachers.length})</button>
          <button onClick={() => setActiveTab('users')} className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === 'users' ? 'bg-gray-800 text-white' : 'bg-white text-gray-500'}`}>Usuários ({activeUsers.length})</button>
          <button onClick={() => setActiveTab('schools')} className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${activeTab === 'schools' ? 'bg-accent text-white' : 'bg-white text-gray-500'}`}>Escolas ({schoolsList.length})</button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden min-h-[450px]">
          {activeTab === 'schools' && (
              <div className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {schoolsList.map((school, idx) => (
                         <div key={idx} className="p-6 rounded-3xl border-2 border-gray-100 bg-white flex flex-col gap-4">
                             <div className="flex justify-between items-start">
                                 <div className="flex items-center gap-3">
                                     <div className="bg-accent/10 p-2 rounded-xl text-accent"><Building size={24} /></div>
                                     <div>
                                         <h3 className="font-black text-gray-800 leading-tight">{school}</h3>
                                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{schoolTeacherStats[school]?.length || 0} Professores vinculados</p>
                                     </div>
                                 </div>
                                 <button onClick={() => { setEditingSchool(school); setNewSchoolName(school); }} className="p-2 text-gray-300 hover:text-primary transition-colors"><Edit3 size={18} /></button>
                             </div>
                             <button onClick={() => setViewingSchoolTeachers(school)} className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 font-black text-xs rounded-xl flex items-center justify-center gap-2 border-b-2 border-gray-200">
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
                      <div key={t.id} className="p-6 bg-white border-2 border-gray-100 rounded-3xl flex justify-between items-center">
                          <div>
                              <p className="font-black text-lg">{t.name}</p>
                              <p className="text-sm font-bold text-gray-400">{t.school} • {t.city}/{t.state}</p>
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => setViewingDoc(t)} className="px-4 py-2 bg-blue-50 text-primary font-bold rounded-xl flex items-center gap-2"><Eye size={16} /> Ver Doc</button>
                              <button onClick={() => handleApprove(t.id, t.school)} className="px-6 py-2 bg-secondary text-white font-black rounded-xl border-b-4 border-green-700">APROVAR</button>
                          </div>
                      </div>
                  ))}
                  {pendingTeachers.length === 0 && <p className="text-center py-20 text-gray-400 font-bold">Nenhum professor aguardando validação.</p>}
              </div>
          )}
          
          {/* Aba Usuários segue a lógica anterior... */}
      </div>
    </div>
  );
};

export default AdminDashboard;
