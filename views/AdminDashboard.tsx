
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, User } from '../types';
import { CheckCircle, XCircle, Trash2, Building, UserCheck, Loader2, Check, FolderOpen, FileText, Eye, Download, X } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { allUsers, schoolsList, approveTeacher, deleteUser, addSchool } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'schools' | 'documents'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [viewingDoc, setViewingDoc] = useState<User | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const pendingTeachers = allUsers.filter(u => u.role === UserRole.TEACHER && u.status === 'pending');
  const activeUsers = allUsers.filter(u => u.role !== UserRole.ADMIN);
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

  return (
    <div className="pb-20 relative">
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
          <h1 className="text-3xl font-extrabold mb-2">Painel de Controle</h1>
          <p className="opacity-80">Gestão central de documentos e validações.</p>
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
            Pasta de Arquivos ({usersWithDocs.length})
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all transform active:scale-95 ${activeTab === 'users' ? 'bg-gray-800 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            Usuários
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
                    <UserCheck className="text-secondary" /> Professores para Analisar
                 </h2>
                 
                 {pendingTeachers.length === 0 ? (
                     <div className="text-center py-20 text-gray-400">
                         <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Check size={40} className="text-gray-200" />
                         </div>
                         <p className="font-bold">Nenhuma validação pendente.</p>
                     </div>
                 ) : (
                     <div className="space-y-4">
                         {pendingTeachers.map(teacher => (
                             <div key={teacher.id} className="border-2 border-gray-100 bg-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow animate-fade-in">
                                 <div className="flex-1">
                                     <h3 className="font-extrabold text-gray-800 text-lg">{teacher.name}</h3>
                                     <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                         <p className="text-gray-600 font-medium flex items-center gap-1 text-sm"><Building size={14} /> {teacher.school}</p>
                                         <p className="text-gray-400 text-sm">{teacher.email}</p>
                                     </div>
                                 </div>
                                 <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                     {teacher.proofFileUrl && (
                                       <button 
                                          onClick={() => setViewingDoc(teacher)}
                                          className="flex-1 md:flex-none px-4 py-2.5 bg-blue-50 text-primary font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                       >
                                           <Eye size={18} /> Ver Documento
                                       </button>
                                     )}
                                     <button 
                                        disabled={processingId !== null}
                                        onClick={() => handleReject(teacher.id)}
                                        className="flex-1 md:flex-none px-4 py-2.5 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                     >
                                         <XCircle size={18} /> Rejeitar
                                     </button>
                                     <button 
                                        disabled={processingId !== null}
                                        onClick={() => handleApprove(teacher.id, teacher.school)}
                                        className="flex-1 md:flex-none px-6 py-2.5 bg-secondary text-white font-extrabold rounded-xl hover:bg-green-600 shadow-lg border-b-4 border-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                     >
                                         {processingId === teacher.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                         {processingId === teacher.id ? '...' : 'APROVAR'}
                                     </button>
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
              </div>
          )}

          {/* TAB: DOCUMENTS FOLDER */}
          {activeTab === 'documents' && (
              <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FolderOpen className="text-primary" /> Pasta de Comprovantes Recebidos
                    </h2>
                  </div>
                  
                  {usersWithDocs.length === 0 ? (
                    <div className="text-center py-20 text-gray-300">
                      <FolderOpen size={64} className="mx-auto mb-4 opacity-20" />
                      <p className="font-bold">A pasta está vazia.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {usersWithDocs.map(u => (
                        <div key={u.id} className="p-4 rounded-2xl border-2 border-gray-100 hover:border-primary/30 transition-all flex flex-col gap-3 group bg-gray-50/30">
                          <div className="flex items-start justify-between">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                              <FileText size={32} />
                            </div>
                            <span className={`text-[9px] font-black px-2 py-1 rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {u.status === 'active' ? 'VERIFICADO' : 'PENDENTE'}
                            </span>
                          </div>
                          <div>
                            <p className="font-black text-gray-800 text-sm truncate">{u.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{u.school}</p>
                          </div>
                          <button 
                            onClick={() => setViewingDoc(u)}
                            className="mt-2 w-full py-2 bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white rounded-xl font-bold text-xs transition-all"
                          >
                            ABRIR ARQUIVO
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
          )}

          {/* TAB: ALL USERS */}
          {activeTab === 'users' && (
              <div className="p-0">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                  <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-wider">Usuário</th>
                                  <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-wider">Função</th>
                                  <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-wider">Escola</th>
                                  <th className="p-4 font-black text-gray-400 text-[10px] uppercase tracking-wider text-center">Ações</th>
                              </tr>
                          </thead>
                          <tbody>
                              {activeUsers.map(u => (
                                  <tr key={u.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                                      <td className="p-4">
                                          <p className="font-extrabold text-gray-700">{u.name}</p>
                                          <p className="text-xs text-gray-400">{u.email}</p>
                                      </td>
                                      <td className="p-4">
                                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${u.role === UserRole.TEACHER ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                              {u.role === UserRole.TEACHER ? 'PROFESSOR' : 'ALUNO'}
                                          </span>
                                      </td>
                                      <td className="p-4 text-sm font-bold text-gray-500">{u.school}</td>
                                      <td className="p-4 text-center">
                                          <button onClick={() => handleDeleteUser(u.id)} className="text-red-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all"><Trash2 size={20} /></button>
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
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Building className="text-accent" /> Rede Escolar</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {schoolsList.map((school, idx) => (
                         <div key={idx} className="p-5 rounded-2xl border-2 border-gray-50 bg-gray-50/50 flex items-center gap-4 hover:bg-white hover:border-accent/20 transition-all group">
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-accent shadow-sm font-black text-xs transition-colors">{idx + 1}</div>
                             <span className="font-extrabold text-gray-700">{school}</span>
                         </div>
                     ))}
                 </div>
              </div>
          )}
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
