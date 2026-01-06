
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, User, ShieldCheck, Upload, LockKeyhole, MapPin, 
  Building, GraduationCap, CheckCircle2, ChevronRight, X, 
  AlertTriangle, ArrowLeft, Shield, FileText 
} from 'lucide-react';
import { CLASSES, SHIFTS, BRAZIL_STATES } from '../constants';
import { isProfane } from '../utils/security';

const Login: React.FC = () => {
  const { register, login, allUsers, schoolsList, citiesList, activeClassrooms } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); 
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [school, setSchool] = useState('');
  const [customSchool, setCustomSchool] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [proofFile, setProofFile] = useState('');
  const [grade, setGrade] = useState<number>(6);
  const [classId, setClassId] = useState('');
  const [shift, setShift] = useState('');

  // Handlers
  const handleRoleSelect = (selectedRole: UserRole) => {
    setErrorMsg('');
    setRole(selectedRole);
    setStep(2);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setErrorMsg('');
      
      const result = login(email, role, password);
      if (result.success) {
          if (role === UserRole.ADMIN) navigate('/admin-panel');
          else navigate('/dashboard');
      } else {
          setErrorMsg(result.message || 'Dados inválidos.');
          setIsLoading(false);
      }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg('');

      if (isProfane(name)) {
        setErrorMsg("O nome escolhido contém palavras inadequadas.");
        return;
      }

      if (role === UserRole.TEACHER && !proofFile) {
        setErrorMsg("Por favor, anexe ou indique o link do seu comprovante de vínculo.");
        return;
      }
      
      setIsLoading(true);
      const finalSchool = school === 'other' ? customSchool : school;
      const finalCity = city === 'other' ? customCity : city;

      const regResult = register({ 
        name, email, role, state, city: finalCity,
        school: finalSchool, grade, classId, shift, teacherId,
        proofFileUrl: proofFile 
      });
      
      setIsLoading(false);
      if (regResult.success) {
        setStep(4);
      } else {
        setErrorMsg(regResult.message || "Erro no cadastro.");
      }
  };

  // Filtros Dinâmicos baseados nas ações dos Professores
  const availableSchoolsForCity = useMemo(() => {
    if (!city) return [];
    // Busca escolas que possuem professores ativos na cidade ou turmas criadas
    const cityTeachers = allUsers.filter(u => u.role === UserRole.TEACHER && u.city === city && u.status === 'active');
    const schools = cityTeachers.flatMap(t => t.teacherSchools || []);
    return Array.from(new Set(schools)).sort();
  }, [allUsers, city]);

  const availableTeachersForSchool = useMemo(() => {
    if (!school) return [];
    return allUsers.filter(u => 
      u.role === UserRole.TEACHER && 
      u.status === 'active' && 
      (u.school === school || u.teacherSchools?.includes(school))
    );
  }, [allUsers, school]);

  const teacherRooms = useMemo(() => {
    if (!teacherId || !school) return [];
    return activeClassrooms.filter(c => c.teacherId === teacherId && c.school === school);
  }, [activeClassrooms, teacherId, school]);

  const availableGrades = useMemo(() => {
    return Array.from(new Set(teacherRooms.map(c => c.grade))).sort();
  }, [teacherRooms]);

  const availableClasses = useMemo(() => {
    return Array.from(new Set(teacherRooms.filter(c => c.grade === grade).map(c => c.classId))).sort();
  }, [teacherRooms, grade]);

  const availableShifts = useMemo(() => {
    return Array.from(new Set(teacherRooms.filter(c => c.grade === grade && c.classId === classId).map(c => c.shift))).sort();
  }, [teacherRooms, grade, classId]);

  // UI Step Logic
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md border-b-8 border-gray-200 text-center animate-fade-in">
              <h1 className="text-4xl font-black text-secondary mb-2 tracking-tight">Ciencias<span className="text-primary">Quest</span></h1>
              <p className="text-gray-400 font-bold mb-10 text-[10px] uppercase tracking-[0.2em]">Sua Jornada na BNCC</p>
              
              <div className="space-y-4">
                  <button onClick={() => handleRoleSelect(UserRole.STUDENT)} className="w-full p-6 rounded-3xl border-2 border-primary bg-blue-50 text-primary hover:bg-blue-100 transition-all flex items-center gap-5 group active:scale-95">
                      <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:rotate-12 transition-transform"><User size={32} /></div>
                      <span className="font-black text-xl">SOU ALUNO</span>
                  </button>
                  <button onClick={() => handleRoleSelect(UserRole.TEACHER)} className="w-full p-6 rounded-3xl border-2 border-secondary bg-green-50 text-secondary hover:bg-green-100 transition-all flex items-center gap-5 group active:scale-95">
                      <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:rotate-12 transition-transform"><BookOpen size={32} /></div>
                      <span className="font-black text-xl">SOU PROFESSOR</span>
                  </button>
                  <button onClick={() => handleRoleSelect(UserRole.ADMIN)} className="w-full p-4 rounded-2xl border-2 border-gray-200 text-gray-400 hover:bg-gray-50 transition-all font-black text-xs mt-6 flex items-center justify-center gap-2">
                      <LockKeyhole size={14} /> ÁREA ADMINISTRATIVA
                  </button>
              </div>
          </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border-b-8 border-gray-200 animate-fade-in">
              <button onClick={() => setStep(1)} className="text-gray-400 font-black text-xs mb-6 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"><ArrowLeft size={14} /> Voltar</button>
              <h2 className="text-2xl font-black text-gray-800 mb-8 text-center">
                  {role === UserRole.STUDENT ? 'Área do Aluno' : role === UserRole.TEACHER ? 'Área do Docente' : 'Portal Admin'}
              </h2>
              
              <div className="flex gap-4 mb-8">
                  <button onClick={() => setMode('login')} className={`flex-1 py-3 font-black rounded-2xl border-b-4 transition-all ${mode === 'login' ? 'bg-primary text-white border-blue-700' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>ENTRAR</button>
                  {role !== UserRole.ADMIN && (
                      <button onClick={() => setMode('register')} className={`flex-1 py-3 font-black rounded-2xl border-b-4 transition-all ${mode === 'register' ? 'bg-secondary text-white border-green-700' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>CADASTRAR</button>
                  )}
              </div>

              {mode === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <input type="email" placeholder="Seu email..." value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary outline-none" required />
                      {(role === UserRole.ADMIN) && <input type="password" placeholder="Chave mestra..." value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-dark outline-none" required />}
                      {errorMsg && <p className="text-red-500 text-xs font-black text-center">{errorMsg}</p>}
                      <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-blue-700 uppercase tracking-widest active:translate-y-1 transition-all">
                        {isLoading ? 'CARREGANDO...' : 'ACESSAR SISTEMA'}
                      </button>
                  </form>
              ) : (
                  <button onClick={() => setStep(3)} className="w-full bg-secondary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-green-700 uppercase tracking-widest active:translate-y-1 transition-all">INICIAR INSCRIÇÃO</button>
              )}
          </div>
      </div>
    );
  }

  if (step === 3) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-xl border-b-8 border-gray-200 animate-fade-in max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button onClick={() => setStep(2)} className="text-gray-400 font-black text-xs mb-6 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"><ArrowLeft size={14} /> Voltar</button>
                <h2 className="text-2xl font-black text-gray-800 mb-6">Informações de Cadastro</h2>
                
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome Completo</label>
                            <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-primary outline-none font-bold" placeholder="Ex: João Silva" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Principal</label>
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-primary outline-none font-bold" placeholder="seu@email.com" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</label>
                            <select required value={state} onChange={e => {setState(e.target.value); setCity('');}} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold">
                                <option value="">Selecione...</option>
                                {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cidade</label>
                            <select required value={city} onChange={e => {setCity(e.target.value); setSchool('');}} disabled={!state} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                                <option value="">Selecione...</option>
                                {state && citiesList[state]?.map(c => <option key={c} value={c}>{c}</option>)}
                                {state && role === UserRole.TEACHER && <option value="other">+ Adicionar nova cidade</option>}
                            </select>
                            {city === 'other' && (
                                <input required value={customCity} onChange={e => setCustomCity(e.target.value)} className="w-full p-4 mt-2 rounded-2xl border-2 border-primary outline-none font-bold animate-fade-in" placeholder="Nome da cidade..." />
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instituição de Ensino</label>
                        <select required value={school} onChange={e => {setSchool(e.target.value); setTeacherId('');}} disabled={!city} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                            <option value="">Selecione sua escola...</option>
                            {role === UserRole.STUDENT 
                                ? availableSchoolsForCity.map(s => <option key={s} value={s}>{s}</option>)
                                : schoolsList.map(s => <option key={s} value={s}>{s}</option>)
                            }
                            {city && role === UserRole.TEACHER && <option value="other">+ Outra instituição</option>}
                        </select>
                        {school === 'other' && role === UserRole.TEACHER && (
                            <input required value={customSchool} onChange={e => setCustomSchool(e.target.value)} className="w-full p-4 mt-2 rounded-2xl border-2 border-primary outline-none font-bold animate-fade-in" placeholder="Nome completo da escola..." />
                        )}
                        {role === UserRole.STUDENT && city && availableSchoolsForCity.length === 0 && (
                            <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">Nenhuma escola com professor cadastrado nesta cidade.</p>
                        )}
                    </div>

                    {role === UserRole.STUDENT && (
                        <>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seu Professor(a)</label>
                                <select required value={teacherId} onChange={e => setTeacherId(e.target.value)} disabled={!school} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                                    <option value="">Selecione seu professor...</option>
                                    {availableTeachersForSchool.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ano Escolar</label>
                                    <select required value={grade} onChange={e => setGrade(Number(e.target.value))} disabled={!teacherId} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                                        <option value="">Anos...</option>
                                        {availableGrades.map(g => <option key={g} value={g}>{g}º Ano</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Turma</label>
                                    <select required value={classId} onChange={e => setClassId(e.target.value)} disabled={!grade} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                                        <option value="">Turma...</option>
                                        {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Turno</label>
                                    <select required value={shift} onChange={e => setShift(e.target.value)} disabled={!classId} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                                        <option value="">Turno...</option>
                                        {availableShifts.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            {teacherId && teacherRooms.length === 0 && (
                                <p className="text-[9px] text-accent font-black uppercase bg-yellow-50 p-3 rounded-xl border border-yellow-100">Este professor ainda não configurou as turmas em seu painel.</p>
                            )}
                        </>
                    )}

                    {role === UserRole.TEACHER && (
                        <div className="p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary p-2 rounded-lg text-white"><Shield size={20} /></div>
                                <h3 className="font-black text-primary uppercase text-xs tracking-wider">Comprovação Docente</h3>
                            </div>
                            <p className="text-[11px] font-bold text-blue-800/70 leading-relaxed">
                                Para garantir a segurança dos alunos, solicitamos o envio de um comprovante (Foto do Crachá, Contracheque ou link do Diário Oficial).
                            </p>
                            <div className="flex flex-col gap-2">
                                <input 
                                  required 
                                  type="text" 
                                  value={proofFile} 
                                  onChange={e => setProofFile(e.target.value)} 
                                  placeholder="Link ou nome do arquivo do comprovante..." 
                                  className="w-full p-4 rounded-2xl border-2 border-white focus:border-primary outline-none font-bold shadow-sm"
                                />
                                <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-black px-2">
                                    <FileText size={14}/> Formatos aceitos: JPG, PNG, PDF ou Link
                                </div>
                            </div>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border-2 border-red-100 flex items-center gap-3 text-xs font-bold animate-shake">
                            <AlertTriangle size={18} /> {errorMsg}
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="w-full bg-secondary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-green-700 uppercase tracking-widest active:translate-y-1 transition-all flex items-center justify-center gap-2">
                        {isLoading ? 'PROCESSANDO...' : (
                            <>FINALIZAR CADASTRO <ChevronRight size={20} /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
      );
  }

  if (step === 4) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border-b-8 border-gray-200 text-center animate-fade-in">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-secondary mx-auto mb-6">
                    <CheckCircle2 size={64} />
                </div>
                <h2 className="text-3xl font-black text-gray-800 mb-4">Cadastro Concluído!</h2>
                <p className="text-gray-500 font-bold mb-8">
                    {role === UserRole.STUDENT 
                      ? "Seu perfil foi criado com sucesso. Agora você pode entrar e começar sua jornada!" 
                      : "Seu cadastro docente foi enviado para análise. Em breve um administrador aprovará seu acesso."}
                </p>
                <button onClick={() => { setStep(2); setMode('login'); }} className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-blue-700 uppercase tracking-widest active:translate-y-1 transition-all">
                    IR PARA LOGIN
                </button>
            </div>
        </div>
      );
  }

  return null;
};

export default Login;
