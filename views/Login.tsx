
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, User, ShieldCheck, Upload, LockKeyhole, MapPin, 
  Building, GraduationCap, CheckCircle2, ChevronRight, X, 
  AlertTriangle, ArrowLeft, Shield, FileText, KeyRound, Mail, Phone
} from 'lucide-react';
import { CLASSES, SHIFTS, BRAZIL_STATES } from '../constants';
import { isProfane } from '../utils/security';

const Login: React.FC = () => {
  const { register, login, allUsers, schoolsList, citiesList, activeClassrooms, recoverPassword } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); 
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
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

  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const result = recoverPassword(email);
    if (result.success) {
      setSuccessMsg(result.message);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg('');

      if (isProfane(name)) {
        setErrorMsg("Nome inválido por conter termos inadequados.");
        return;
      }

      if (password.length < 6) {
        setErrorMsg("A senha deve conter ao menos 6 caracteres.");
        return;
      }
      
      setIsLoading(true);
      const finalSchool = school === 'other' ? customSchool : school;
      const finalCity = city === 'other' ? customCity : city;

      const regResult = register({ 
        name, email, password, whatsapp, role, state, city: finalCity,
        school: finalSchool, grade, classId, shift, teacherId,
        proofFileUrl: proofFile 
      });
      
      setIsLoading(false);
      if (regResult.success) {
        setStep(4);
      } else {
        setErrorMsg(regResult.message || "Erro durante o cadastro.");
      }
  };

  // Filtros Dinâmicos
  const availableSchoolsForCity = useMemo(() => {
    if (!city) return [];
    // Professores podem ver todas, alunos veem apenas as vinculadas por seus professores
    if (role === UserRole.TEACHER) return schoolsList;
    
    const cityTeachers = allUsers.filter(u => u.role === UserRole.TEACHER && u.city === city && u.status === 'active');
    const schools = cityTeachers.flatMap(t => t.teacherSchools || []);
    return Array.from(new Set(schools)).sort();
  }, [allUsers, city, role, schoolsList]);

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

  const availableGrades = useMemo(() => Array.from(new Set(teacherRooms.map(c => c.grade))).sort(), [teacherRooms]);
  const availableClasses = useMemo(() => Array.from(new Set(teacherRooms.filter(c => c.grade === grade).map(c => c.classId))).sort(), [teacherRooms, grade]);
  const availableShifts = useMemo(() => Array.from(new Set(teacherRooms.filter(c => c.grade === grade && c.classId === classId).map(c => c.shift))).sort(), [teacherRooms, grade, classId]);

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md border-b-8 border-gray-200 text-center animate-fade-in">
              <h1 className="text-4xl font-black text-secondary mb-2 tracking-tight">Ciencias<span className="text-primary">Quest</span></h1>
              <p className="text-gray-400 font-bold mb-10 text-[10px] uppercase tracking-[0.2em]">Plataforma Gamificada de Ciências</p>
              
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
              <button onClick={() => { setStep(1); setMode('login'); setErrorMsg(''); setSuccessMsg(''); }} className="text-gray-400 font-black text-xs mb-6 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"><ArrowLeft size={14} /> Voltar</button>
              <h2 className="text-2xl font-black text-gray-800 mb-8 text-center uppercase tracking-tight">
                  {mode === 'recover' ? 'Apoio à Senha' : role === UserRole.STUDENT ? 'Portal do Estudante' : role === UserRole.TEACHER ? 'Portal Docente' : 'Admin'}
              </h2>
              
              {mode !== 'recover' && (
                <div className="flex gap-4 mb-8">
                    <button onClick={() => { setMode('login'); setErrorMsg(''); }} className={`flex-1 py-3 font-black rounded-2xl border-b-4 transition-all ${mode === 'login' ? 'bg-primary text-white border-blue-700' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>ENTRAR</button>
                    {role !== UserRole.ADMIN && (
                        <button onClick={() => { setMode('register'); setErrorMsg(''); }} className={`flex-1 py-3 font-black rounded-2xl border-b-4 transition-all ${mode === 'register' ? 'bg-secondary text-white border-green-700' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>CADASTRO</button>
                    )}
                </div>
              )}

              {mode === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input type="email" placeholder="Seu e-mail..." value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary outline-none" required />
                      </div>
                      <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input type="password" placeholder="Sua senha..." value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary outline-none" required />
                      </div>
                      <button type="button" onClick={() => { setMode('recover'); setErrorMsg(''); }} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline text-right block w-full">Esqueci meus dados</button>
                      {errorMsg && <p className="text-red-500 text-xs font-black text-center animate-shake">{errorMsg}</p>}
                      <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-blue-700 uppercase tracking-widest active:translate-y-1 transition-all">
                        {isLoading ? 'CONECTANDO...' : 'ACESSAR AGORA'}
                      </button>
                  </form>
              ) : mode === 'register' ? (
                  <button onClick={() => setStep(3)} className="w-full bg-secondary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-green-700 uppercase tracking-widest active:translate-y-1 transition-all">INICIAR MATRÍCULA</button>
              ) : (
                <form onSubmit={handleRecoverSubmit} className="space-y-6">
                    <p className="text-xs font-bold text-gray-400 text-center">Informe seu e-mail cadastrado para enviarmos as instruções.</p>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input type="email" placeholder="E-mail..." value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary outline-none" required />
                    </div>
                    {successMsg && <p className="text-secondary text-xs font-black text-center p-3 bg-green-50 rounded-xl border border-green-100 animate-fade-in">{successMsg}</p>}
                    {errorMsg && <p className="text-red-500 text-xs font-black text-center animate-shake">{errorMsg}</p>}
                    <div className="space-y-3">
                      <button type="submit" className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-blue-700 uppercase tracking-widest active:translate-y-1 transition-all">ENVIAR</button>
                      <button type="button" onClick={() => { setMode('login'); setSuccessMsg(''); setErrorMsg(''); }} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary text-center block">Voltar ao Login</button>
                    </div>
                </form>
              )}
          </div>
      </div>
    );
  }

  if (step === 3) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-xl border-b-8 border-gray-200 animate-fade-in max-h-[95vh] overflow-y-auto custom-scrollbar">
                <button onClick={() => setStep(2)} className="text-gray-400 font-black text-xs mb-6 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"><ArrowLeft size={14} /> Voltar</button>
                <h2 className="text-2xl font-black text-gray-800 mb-6 uppercase tracking-tight">Formulário de Inscrição</h2>
                
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                            <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-primary outline-none font-bold" placeholder="Nome Sobrenome" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-primary outline-none font-bold" placeholder="+55-85-9..." />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email de Acesso</label>
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-primary outline-none font-bold" placeholder="seu@email.com" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-primary outline-none font-bold" placeholder="6+ caracteres" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado</label>
                            <select required value={state} onChange={e => {setState(e.target.value); setCity('');}} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold">
                                <option value="">Selecione...</option>
                                {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cidade</label>
                            <select required value={city} onChange={e => {setCity(e.target.value); setSchool('');}} disabled={!state} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                                <option value="">Selecione...</option>
                                {state && citiesList[state]?.map(c => <option key={c} value={c}>{c}</option>)}
                                {state && role === UserRole.TEACHER && <option value="other">+ Nova Cidade</option>}
                            </select>
                            {city === 'other' && (
                                <input required value={customCity} onChange={e => setCustomCity(e.target.value)} className="w-full p-4 mt-2 rounded-2xl border-2 border-primary outline-none font-bold animate-bounce-in" placeholder="Nome da cidade..." />
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Escola / Instituição</label>
                        <select required value={school} onChange={e => {setSchool(e.target.value); setTeacherId('');}} disabled={!city} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                            <option value="">Onde você estuda/leciona?</option>
                            {availableSchoolsForCity.map(s => <option key={s} value={s}>{s}</option>)}
                            {city && role === UserRole.TEACHER && <option value="other">+ Cadastrar Nova Instituição</option>}
                        </select>
                        {school === 'other' && role === UserRole.TEACHER && (
                            <input required value={customSchool} onChange={e => setCustomSchool(e.target.value)} className="w-full p-4 mt-2 rounded-2xl border-2 border-primary outline-none font-bold animate-bounce-in" placeholder="Nome completo da unidade..." />
                        )}
                        {role === UserRole.STUDENT && city && availableSchoolsForCity.length === 0 && (
                            <p className="text-[9px] text-red-500 font-black mt-1 uppercase">Ainda não há professores cadastrados em {city}.</p>
                        )}
                    </div>

                    {role === UserRole.STUDENT && (
                        <div className="space-y-6 pt-2">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Seu Professor(a)</label>
                                <select required value={teacherId} onChange={e => setTeacherId(e.target.value)} disabled={!school} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                                    <option value="">Selecione quem leciona ciências...</option>
                                    {availableTeachersForSchool.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Ano</label>
                                    <select required value={grade} onChange={e => setGrade(Number(e.target.value))} disabled={!teacherId} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                                        <option value="">Selecione...</option>
                                        {availableGrades.map(g => <option key={g} value={g}>{g}º Ano</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Turma</label>
                                    <select required value={classId} onChange={e => setClassId(e.target.value)} disabled={!grade} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                                        <option value="">Selecione...</option>
                                        {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Turno</label>
                                    <select required value={shift} onChange={e => setShift(e.target.value)} disabled={!classId} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                                        <option value="">Selecione...</option>
                                        {availableShifts.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {role === UserRole.TEACHER && (
                        <div className="p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary p-2 rounded-lg text-white shadow-md"><Shield size={20} /></div>
                                <h3 className="font-black text-primary uppercase text-xs">Vínculo Docente</h3>
                            </div>
                            <p className="text-[10px] font-bold text-blue-800/60 leading-relaxed">
                                Para proteção de dados, pedimos o envio de um documento (Crachá ou Contracheque) para validação administrativa.
                            </p>
                            <input 
                                required 
                                type="text" 
                                value={proofFile} 
                                onChange={e => setProofFile(e.target.value)} 
                                placeholder="Link ou nome do arquivo do comprovante..." 
                                className="w-full p-4 rounded-2xl border-2 border-white focus:border-primary outline-none font-bold shadow-sm"
                            />
                        </div>
                    )}

                    {errorMsg && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border-2 border-red-100 flex items-center gap-3 text-xs font-black animate-shake uppercase tracking-tighter">
                            <AlertTriangle size={18} /> {errorMsg}
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="w-full bg-secondary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-green-700 uppercase tracking-widest active:translate-y-1 transition-all flex items-center justify-center gap-2">
                        {isLoading ? 'ENVIANDO DADOS...' : (
                            <>CONCLUIR CADASTRO <ChevronRight size={20} /></>
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
                <h2 className="text-3xl font-black text-gray-800 mb-4">Parabéns!</h2>
                <p className="text-gray-500 font-bold mb-8 leading-relaxed">
                    {role === UserRole.STUDENT 
                      ? "Seu perfil de estudante foi criado. Prepare-se para a gincana de conhecimento!" 
                      : "Recebemos sua solicitação docente. Nossa equipe administrativa analisará seu comprovante em breve."}
                </p>
                <button onClick={() => { setStep(2); setMode('login'); }} className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-blue-700 uppercase tracking-widest active:translate-y-1 transition-all">
                    FAZER LOGIN
                </button>
            </div>
        </div>
      );
  }

  return null;
};

export default Login;
