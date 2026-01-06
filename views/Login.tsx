
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, User, ShieldCheck, Upload, LockKeyhole, MapPin, 
  Building, GraduationCap, CheckCircle2, ChevronRight, X, 
  AlertTriangle, ArrowLeft, Shield, FileText 
} from 'lucide-react';
import { CLASSES, SHIFTS, BRAZIL_STATES, BRAZIL_CITIES } from '../constants';
import { isProfane } from '../utils/security';

const Login: React.FC = () => {
  const { register, login, allUsers, schoolsList } = useAuth();
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
        setErrorMsg("Por favor, informe o nome do arquivo ou link do comprovante de vínculo.");
        return;
      }
      
      setIsLoading(true);
      const finalSchool = school === 'other' ? customSchool : school;

      register({ 
        name, email, role, state, city,
        school: finalSchool, grade, classId, shift, teacherId,
        proofFileUrl: proofFile 
      });
      
      setIsLoading(false);
      setStep(4);
  };

  // Filtros de Cadastro (Aluno)
  const availableSchoolsForCity = useMemo(() => {
    if (!city) return [];
    // Encontra professores na cidade e extrai suas escolas vinculadas
    const cityTeachers = allUsers.filter(u => u.role === UserRole.TEACHER && u.city === city);
    const schools = cityTeachers.flatMap(t => t.teacherSchools || []);
    return Array.from(new Set(schools));
  }, [allUsers, city]);

  const availableTeachersForSchool = useMemo(() => {
    if (!school) return [];
    return allUsers.filter(u => 
      u.role === UserRole.TEACHER && 
      (u.school === school || u.teacherSchools?.includes(school))
    );
  }, [allUsers, school]);

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
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</label>
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-primary outline-none font-bold" placeholder="seu@email.com" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</label>
                            <select required value={state} onChange={e => {setState(e.target.value); setCity(''); setSchool('');}} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold">
                                <option value="">Selecione...</option>
                                {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cidade</label>
                            <select required value={city} onChange={e => {setCity(e.target.value); setSchool('');}} disabled={!state} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold disabled:opacity-50">
                                <option value="">Selecione...</option>
                                {state && BRAZIL_CITIES[state]?.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
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
                            {city && <option value="other">+ Escola não listada</option>}
                        </select>
                        {school === 'other' && (
                            <input required value={customSchool} onChange={e => setCustomSchool(e.target.value)} className="w-full p-4 mt-2 rounded-2xl border-2 border-primary outline-none font-bold animate-fade-in" placeholder="Nome completo da escola..." />
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
                                    <select value={grade} onChange={e => setGrade(Number(e.target.value))} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold">
                                        {[6, 7, 8, 9].map(g => <option key={g} value={g}>{g}º Ano</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Turma</label>
                                    <select required value={classId} onChange={e => setClassId(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold">
                                        <option value="">Selecionar...</option>
                                        {CLASSES.map(c => <option key={c} value={c}>Turma {c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Turno</label>
                                    <select required value={shift} onChange={e => setShift(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 outline-none font-bold">
                                        <option value="">Selecionar...</option>
                                        {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {role === UserRole.TEACHER && (
                        <div className="p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary p-2 rounded-lg text-white"><Shield size={20} /></div>
                                <h3 className="font-black text-primary uppercase text-xs tracking-wider">Verificação de Vínculo</h3>
                            </div>
                            <p className="text-[11px] font-bold text-blue-800/70 leading-relaxed">
                                Para garantir a segurança dos dados, professores devem comprovar vínculo institucional. 
                                Informe o nome do arquivo enviado ou um link público de consulta.
                            </p>
                            <input 
                                required 
                                value={proofFile} 
                                onChange={e => setProofFile(e.target.value)} 
                                className="w-full p-4 rounded-2xl border-2 border-white focus:border-primary outline-none font-bold" 
                                placeholder="Link do Diário Oficial ou Nome do Arquivo..." 
                            />
                            <div className="flex items-center gap-2 text-primary">
                                <FileText size={16} />
                                <span className="text-[10px] font-black uppercase">PDF, JPG ou PNG recomendados</span>
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
                <h2 className="text-3xl font-black text-gray-800 mb-4">Sucesso!</h2>
                <p className="text-gray-500 font-bold mb-8">
                    {role === UserRole.STUDENT 
                      ? "Seu perfil foi criado. Agora você pode explorar a trilha do conhecimento!" 
                      : "Seu cadastro foi enviado para análise. Um administrador validará seus documentos em breve."}
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
