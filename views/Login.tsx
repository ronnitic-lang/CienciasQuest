
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, ShieldCheck, Upload, LockKeyhole, Eye, EyeOff, CheckCircle2, FileText, MapPin, AlertTriangle, Search, CheckCircle } from 'lucide-react';
import { CLASSES, SHIFTS, BRAZIL_STATES, BRAZIL_CITIES } from '../constants';
import { isProfane } from '../utils/security';

const Login: React.FC = () => {
  const { register, login, allUsers, schoolsList, activeClassrooms } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); 
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [school, setSchool] = useState('');
  const [customSchool, setCustomSchool] = useState('');
  const [grade, setGrade] = useState<number>(6);
  const [classId, setClassId] = useState('');
  const [shift, setShift] = useState('');
  const [proofDataUrl, setProofDataUrl] = useState<string>('');

  // Handlers definidos no topo para evitar erros de referência
  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
    setErrorMsg('');
    setEmail('');
    setPassword('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setErrorMsg('');
      setTimeout(() => {
        const result = login(email, role, password);
        if (result.success) {
            if (role === UserRole.ADMIN) navigate('/admin-panel');
            else navigate('/dashboard');
        } else {
            setErrorMsg(result.message || 'Erro ao entrar.');
            setIsLoading(false);
        }
      }, 500);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setErrorMsg('');

      if (isProfane(name)) {
        setErrorMsg("O nome inserido contém termos impróprios. Use seu nome real.");
        setIsLoading(false);
        return;
      }
      
      const finalSchool = school === 'other' ? customSchool : school;

      if (role === UserRole.TEACHER && step === 3) {
          setStep(4);
          setIsLoading(false);
          return;
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      register({ 
        name, email, role, state, city,
        school: finalSchool, grade, classId, shift, 
        teacherId: matchingTeacher?.id,
        proofFileUrl: proofDataUrl 
      });
      setIsLoading(false);
      if (role === UserRole.TEACHER) setStep(5);
      else navigate('/dashboard');
  };

  // Sincronização: Professores ativos na cidade selecionada
  const activeTeachersInCity = useMemo(() => {
    return allUsers.filter(u => u.role === UserRole.TEACHER && u.status === 'active' && u.city === city);
  }, [allUsers, city]);

  // Sincronização: Escolas onde existem professores ativos na cidade selecionada
  const schoolsInCity = useMemo(() => {
    if (role === UserRole.TEACHER) return schoolsList.sort();
    const schoolsWithTeachers = activeTeachersInCity.map(t => t.school).filter(Boolean) as string[];
    return Array.from(new Set(schoolsWithTeachers)).sort();
  }, [schoolsList, activeTeachersInCity, role]);

  // Sincronização: Turmas reais vinculadas à escola e ano selecionados
  const filteredClassrooms = useMemo(() => {
    if (!school) return [];
    return activeClassrooms.filter(c => c.school === school && c.grade === grade);
  }, [activeClassrooms, school, grade]);

  const classroomOptions = useMemo(() => {
    if (role === UserRole.TEACHER) return CLASSES;
    return Array.from(new Set(filteredClassrooms.map(c => c.classId))).sort();
  }, [filteredClassrooms, role]);

  const shiftOptions = useMemo(() => {
    if (role === UserRole.TEACHER) return SHIFTS;
    if (!classId) return [];
    return Array.from(new Set(filteredClassrooms.filter(c => c.classId === classId).map(c => c.shift)));
  }, [filteredClassrooms, classId, role]);

  const matchingTeacher = useMemo(() => {
    if (role === UserRole.TEACHER) return null;
    const room = filteredClassrooms.find(c => c.classId === classId && c.shift === shift);
    if (!room) return null;
    return activeTeachersInCity.find(t => t.id === room.teacherId);
  }, [filteredClassrooms, classId, shift, activeTeachersInCity, role]);

  useEffect(() => { setCity(''); setSchool(''); setClassId(''); setShift(''); }, [state]);
  useEffect(() => { setSchool(''); setClassId(''); setShift(''); }, [city]);
  useEffect(() => { setClassId(''); setShift(''); }, [school, grade]);

  // Renderização condicional por passos
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-b-4 border-gray-200 text-center">
              <h1 className="text-4xl font-extrabold text-secondary mb-2 tracking-tighter">Ciencias<span className="text-primary">Quest</span></h1>
              <p className="text-gray-400 font-black mb-8 text-[10px] uppercase tracking-widest">Base Nacional Comum Curricular</p>
              <div className="space-y-4">
                  <button onClick={() => handleRoleSelect(UserRole.STUDENT)} className="w-full p-6 rounded-2xl border-2 border-primary bg-blue-50 text-primary hover:bg-blue-100 transition-all flex items-center gap-4 group active:scale-95">
                      <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform"><User size={32} /></div>
                      <div className="text-left"><span className="block font-black text-xl">SOU ALUNO</span></div>
                  </button>
                  <button onClick={() => handleRoleSelect(UserRole.TEACHER)} className="w-full p-6 rounded-2xl border-2 border-secondary bg-green-50 text-secondary hover:bg-green-100 transition-all flex items-center gap-4 group active:scale-95">
                      <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform"><BookOpen size={32} /></div>
                      <div className="text-left"><span className="block font-black text-xl">SOU PROFESSOR</span></div>
                  </button>
                  <button onClick={() => handleRoleSelect(UserRole.ADMIN)} className="w-full p-4 rounded-xl border-2 border-gray-300 text-gray-400 hover:bg-gray-50 transition-all flex items-center gap-4 justify-center text-xs font-black mt-8">
                      <LockKeyhole size={14} /> ÁREA ADMINISTRATIVA
                  </button>
              </div>
          </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-b-4 border-gray-200 text-center">
              <button onClick={() => setStep(1)} className="float-left text-gray-400 font-bold text-sm mb-4">← Voltar</button>
              <h2 className="text-2xl font-extrabold text-gray-800 mb-6">{role === UserRole.STUDENT ? 'Área do Aluno' : role === UserRole.ADMIN ? 'Acesso Restrito' : 'Área do Professor'}</h2>
              <div className="flex gap-4 mb-6">
                  <button onClick={() => setMode('login')} className={`flex-1 py-3 font-black rounded-xl border-b-4 transition-all ${mode === 'login' ? 'bg-primary text-white border-blue-700' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>ENTRAR</button>
                  {role !== UserRole.ADMIN && (
                      <button onClick={() => setMode('register')} className={`flex-1 py-3 font-black rounded-xl border-b-4 transition-all ${mode === 'register' ? 'bg-secondary text-white border-green-700' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>CADASTRAR</button>
                  )}
              </div>
              
              {mode === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div className="text-left">
                          <label className="block text-xs font-black text-gray-400 uppercase mb-1">EMAIL OU USUÁRIO</label>
                          <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-primary" required />
                      </div>
                      {role === UserRole.ADMIN && (
                          <div className="text-left">
                              <label className="block text-xs font-black text-gray-400 uppercase mb-1">CHAVE DE ACESSO</label>
                              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold outline-none focus:border-dark" required />
                          </div>
                      )}
                      {errorMsg && <p className="text-red-500 text-xs font-bold">{errorMsg}</p>}
                      <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg border-b-4 border-blue-700 uppercase tracking-widest">{isLoading ? 'CARREGANDO...' : 'ACESSAR CONTA'}</button>
                  </form>
              ) : (
                  <div className="space-y-4">
                    <p className="text-gray-500 text-sm font-bold mb-4">Crie sua conta para começar sua jornada científica!</p>
                    <button onClick={() => setStep(3)} className="w-full bg-secondary text-white font-black py-4 rounded-xl shadow-lg border-b-4 border-green-700 uppercase tracking-widest">INICIAR CADASTRO</button>
                  </div>
              )}
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-b-4 border-gray-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">Ficha de Inscrição</h2>
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700 font-bold text-sm mb-1">Nome Completo</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary font-bold" />
            </div>
            <div>
                <label className="block text-gray-700 font-bold text-sm mb-1">Email</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary font-bold" />
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                    <label className="block text-gray-700 font-bold text-xs mb-1">UF</label>
                    <select required value={state} onChange={(e) => setState(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold bg-white">
                        <option value="">...</option>
                        {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-700 font-bold text-xs mb-1">Cidade</label>
                    <input required disabled={!state} list="cities-list" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold bg-white" placeholder="Autocomplete..." />
                    <datalist id="cities-list">{state && BRAZIL_CITIES[state]?.map(c => <option key={c} value={c} />)}</datalist>
                </div>
            </div>
            <div>
                 <label className="block text-gray-700 font-bold text-sm mb-1">Instituição de Ensino</label>
                 <select required disabled={!city} value={school} onChange={(e) => setSchool(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold bg-white mb-2">
                    <option value="">Selecione...</option>
                    {schoolsInCity.map(s => <option key={s} value={s}>{s}</option>)}
                    {role === UserRole.TEACHER && <option value="other">+ Cadastrar Nova Unidade</option>}
                 </select>
                 {school === 'other' && <input required type="text" value={customSchool} onChange={(e) => setCustomSchool(e.target.value)} placeholder="Nome oficial da escola" className="w-full p-3 rounded-xl border-2 border-secondary font-bold" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 font-bold text-sm mb-1">Ano Letivo</label>
                    <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold bg-white">
                        {[6, 7, 8, 9].map(g => <option key={g} value={g}>{g}º Ano</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-bold text-sm mb-1">Turma</label>
                    <select required value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold bg-white">
                        <option value="">Selecione...</option>
                        {classroomOptions.map(c => <option key={c} value={c}>Turma {c}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-gray-700 font-bold text-sm mb-1">Turno</label>
                <select required value={shift} onChange={(e) => setShift(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold bg-white">
                    <option value="">Selecione...</option>
                    {shiftOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            {role === UserRole.STUDENT && (
                <div className={`p-4 rounded-2xl border-2 transition-all ${matchingTeacher ? 'bg-green-50 border-secondary' : 'bg-red-50 border-red-200'}`}>
                    <label className="block text-primary font-black text-[9px] uppercase mb-1 tracking-widest">Validação de Matrícula</label>
                    {matchingTeacher ? (
                        <p className="font-bold text-secondary flex items-center gap-2 text-xs"><CheckCircle size={14} /> Professor {matchingTeacher.name} vinculado!</p>
                    ) : (
                        <p className="text-red-400 font-bold text-[10px] italic">Atenção: Nenhum professor desta escola cadastrou esta turma ainda.</p>
                    )}
                </div>
            )}
            <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep(2)} className="px-6 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors">Voltar</button>
                <button type="submit" disabled={role === UserRole.STUDENT && !matchingTeacher} className="flex-1 bg-primary text-white font-black py-3 rounded-xl shadow-lg border-b-4 border-blue-700 disabled:opacity-50 disabled:grayscale uppercase text-xs tracking-widest">CONCLUIR MATRÍCULA</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
