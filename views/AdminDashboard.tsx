
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, User } from '../types';
import { CheckCircle, XCircle, Trash2, Building, UserCheck, Loader2, Check, FolderOpen, FileText, Eye, Download, X, Edit3, Save } from 'lucide-react';
import { BRAZIL_STATES, BRAZIL_CITIES } from '../constants';

const AdminDashboard: React.FC = () => {
  const { allUsers, schoolsList, approveTeacher, deleteUser, addSchool, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'schools' | 'documents'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [viewingDoc, setViewingDoc] = useState<User | null>(null);
  
  // States para Edição
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const pendingTeachers = allUsers.filter(u => u.role === UserRole.TEACHER && u.status === 'pending');
  const activeUsers = allUsers.filter(u => u.role !== UserRole.ADMIN).sort((a,b) => a.name.localeCompare(b.name));
  const usersWithDocs = allUsers.filter(u => u.proofFileUrl);

  const handleApprove = async (userId: string, userSchool?: string) => {
    setProcessingId(userId);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
        approveTeacher(userId);
        if (userSchool) {
            addSchool(userSchool); 
        }
        setNotification({ message: "Professor aprovado com sucesso!", type: 'success' });
        if (viewingDoc?.id === userId) setViewingDoc(null);
    } catch (err) {
        setNotification({ message: "Erro ao aprovar professor.", type: 'error' });
    } finally {
        setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
      if (!confirm("Deseja realmente rejeitar este cadastro? Os dados serão excluídos.")) return;
      
      setProcessingId(userId);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      try {
          deleteUser(userId);
          setNotification({ message: "Cadastro rejeitado e removido.", type: 'success' });
          if (viewingDoc?.id === userId) setViewingDoc(null);
      } catch (err) {
          setNotification({ message: "Erro ao rejeitar cadastro.", type: 'error' });
      } finally {
          setProcessingId(null);
      }
  };

  const handleDeleteUser = (userId: string) => {
      if (confirm("Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.")) {
          deleteUser(userId);
          setNotification({ message: "Usuário removido do sistema.", type: 'success' });
      }
  };

  const startEditing = (user: User) => {
      setEditingUser(user);
      setEditForm({ ...user });
  };

  const saveEdit = () => {
      if (editingUser) {
          updateUser(editingUser.id, editForm);
          setNotification({ message: "Dados atualizados com sucesso!", type: 'success' });
          setEditingUser(null);
      }
  };

  return (
    <div className="pb-20 relative">
      
      {/* User Editor Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                 <h3 className="font-black text-gray-800 flex items-center gap-2">
                    <Edit3 size={20} className="text-primary" /> Editar Usuário
                 </h3>
                 <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-gray-200 rounded-full">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                  <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase">Nome Completo</label>
                      <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-3 rounded-xl border-2 border-gray-100 font-bold" />
                  </div>
                  <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase">Email</label>
                      <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full p-3 rounded-xl border-2 border-gray-100 font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase">Estado</label>
                        <select value={editForm.state || ''} onChange={e => setEditForm({...editForm, state: e.target.value, city: ''})} className="w-full p-3 rounded-xl border-2 border-gray-100 font-bold bg-white">
                           {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase">Cidade</label>
                        <select value={editForm.city || ''} onChange={e => setEditForm({...editForm, city: e.target.value})} className="w-full p-3 rounded-xl border-2 border-gray-100 font-bold bg-white">
                           {editForm.state && BRAZIL_CITIES[editForm.state]?.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                  </div>
                  <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase">Escola</label>
                      <input type="text" value={editForm.school || ''} onChange={e => setEditForm({...editForm, school: e.target.value})} className="w-full p-3 rounded-xl border-2 border-gray-100 font-bold" />
                  </div>
                  <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase">Experiência (XP)</label>
                      <input type="number" value={editForm.xp || 0} onChange={e => setEditForm({...editForm, xp: Number(e.target.value)})} className="w-full p-3 rounded-xl border-2 border-gray-100 font-bold" />
                  </div>
              </div>
              <div className="p-6 border-t bg-gray-50 flex gap-4">
                  <button onClick={() => setEditingUser(null)} className="flex-1 py-3 font-bold text-gray-500">Cancelar</button>
                  <button onClick={saveEdit} className="flex-1 py-3 bg-primary text-white font-black rounded-xl border-b-4 border-blue-700 shadow-lg flex items-center justify-center gap-2">
                    <Save size={20} /> SALVAR ALTERAÇÕES
                  </button>
              </div>
           </div>
        </div>
      )}

      {/* Doc Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="text-primary" size={24} />
                <div>
                  <h3 className="font-black text-gray-800">Comprovante de Magistério</h3>
                  <p className="text-xs text-gray-500 font-bold">{viewingDoc.name} • {viewingDoc.school}</p>
                </div>
              </div>
              <button onClick={() => setViewingDoc(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-gray-100/50">
              {viewingDoc.proofFileUrl?.startsWith('data:image') ? (
                <img src={viewingDoc.proofFileUrl} alt="Comprovante" className="max-h-[400px] rounded-lg shadow-md border-4 border-white" />
              ) : (
                <div className="text-center">
                  <FileText size={80} className="mx-auto text-gray-300 mb-4" />
                  <p className="font-bold text-gray-600">Documento PDF/Arquivo</p>
                  <p className="text-sm text-gray-400 mb-6">O navegador simulou a recepção do arquivo para a pasta.</p>
                  <a href={viewingDoc.proofFileUrl} download={`comprovante_${viewingDoc.name.replace(/\s/g, '_')}`} className="inline-flex items-center gap-2 bg-primary text-white font-black px-6 py-3 rounded-xl shadow-lg border-b-4 border-blue-700">
                    <Download size={20} /> BAIXAR PARA ANALISAR
                  </a>
                </div>
              )}
            </div>
            <div className="p-6 border-t flex gap-4 bg-gray-50">
              <button onClick={() => handleReject(viewingDoc.id)} className="flex-1 py-3 bg-red-50 text-red-500 font-bold rounded-xl border-2 border-red-100 hover:bg-red-100 transition-all">REJEITAR</button>
              <button onClick={() => handleApprove(viewingDoc.id, viewingDoc.school)} className="flex-1 py-3 bg-secondary text-white font-black rounded-xl border-b-4 border-green-700 hover:brightness-110 transition-all">APROVAR PROFESSOR</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-3 rounded-2xl shadow-2xl border-b-4 animate-bounce-in
            ${notification.type === 'success' ? 'bg-secondary text-white border-green-700' : 'bg-red-500 text-white border-red-700'}`}>
              <CheckCircle size={20} />
              <span className="font-bold">{notification.message}</span>
          </div>
      )}

      <div className="bg-dark text-white p-8 rounded-3xl mb-8 shadow-lg">
          <h1 className="text-3xl font-extrabold mb-2 text-center md:text-left">Painel Administrativo</h1>
          <p className="opacity-80 text-center md:text-left">Gestão de segurança e governança de dados.</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all transform active:scale-95 ${activeTab === 'pending' ? 'bg-secondary text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            Validações ({pendingTeachers.length})
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all transform active:scale-95 ${activeTab === 'documents' ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            Arquivos
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all transform active:scale-95 ${activeTab === 'users' ? 'bg-gray-800 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            Editar Usuários ({activeUsers.length})
          </button>
          <button 
            onClick={() => setActiveTab('schools')}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all transform active:scale-95 ${activeTab === 'schools' ? 'bg-accent text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            Escolas
          </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden min-h-[450px]">
          
          {/* TAB: PENDING VALIDATIONS */}
          {activeTab === 'pending' && (
              <div className="p-6">
                 <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <UserCheck className="text-secondary" /> Aguardando Validação
                 </h2>
                 {pendingTeachers.length === 0 ? (
                     <div className="text-center py-20 text-gray-400">
                         <Check size={40} className="mx-auto mb-4 opacity-20" />
                         <p className="font-bold">Tudo em dia!</p>
                     </div>
                 ) : (
                     <div className="space-y-4">
                         {pendingTeachers.map(teacher => (
                             <div key={teacher.id} className="border-2 border-gray-100 bg-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
                                 <div className="flex-1">
                                     <h3 className="font-extrabold text-gray-800 text-lg">{teacher.name}</h3>
                                     <p className="text-gray-600 font-medium text-sm">{teacher.school} • {teacher.city}/{teacher.state}</p>
                                 </div>
                                 <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                     <button onClick={() => setViewingDoc(teacher)} className="flex-1 md:flex-none px-4 py-2.5 bg-blue-50 text-primary font-bold rounded-xl flex items-center justify-center gap-2">
                                         <Eye size={18} /> Documento
                                     </button>
                                     <button onClick={() => handleApprove(teacher.id, teacher.school)} className="flex-1 md:flex-none px-6 py-2.5 bg-secondary text-white font-extrabold rounded-xl border-b-4 border-green-700 flex items-center justify-center gap-2">
                                         <CheckCircle size={18} /> APROVAR
                                     </button>
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
              </div>
          )}

          {/* TAB: EDIT USERS */}
          {activeTab === 'users' && (
              <div className="p-0">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                  <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-wider">Usuário</th>
                                  <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-wider">Localidade</th>
                                  <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-wider">Escola</th>
                                  <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-wider text-center">Ações</th>
                              </tr>
                          </thead>
                          <tbody>
                              {activeUsers.map(u => (
                                  <tr key={u.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                                      <td className="p-4">
                                          <p className="font-extrabold text-gray-700">{u.name}</p>
                                          <p className="text-[10px] font-black text-primary uppercase">{u.role}</p>
                                      </td>
                                      <td className="p-4 text-sm font-bold text-gray-500">
                                          {u.city}, {u.state}
                                      </td>
                                      <td className="p-4 text-sm font-bold text-gray-500 truncate max-w-[200px]">{u.school}</td>
                                      <td className="p-4 text-center">
                                          <div className="flex items-center justify-center gap-2">
                                              <button onClick={() => startEditing(u)} className="text-primary hover:bg-blue-100 p-2 rounded-xl transition-all"><Edit3 size={18} /></button>
                                              <button onClick={() => handleDeleteUser(u.id)} className="text-red-300 hover:text-red-500 p-2 rounded-xl transition-all"><Trash2 size={18} /></button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {/* TAB: SCHOOLS */}
          {activeTab === 'schools' && (
              <div className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {schoolsList.map((school, idx) => (
                         <div key={idx} className="p-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 flex items-center gap-4 hover:bg-white transition-all group">
                             <Building className="text-gray-300 group-hover:text-accent" />
                             <span className="font-extrabold text-gray-700 text-sm">{school}</span>
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
