
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, ShieldCheck, Upload, LockKeyhole, Eye, EyeOff, CheckCircle2, FileText } from 'lucide-react';
import { CLASSES, SHIFTS } from '../constants';
import Mascot from '../components/Mascot';

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
  const [school, setSchool] = useState('');
  const [customSchool, setCustomSchool] = useState('');
  const [grade, setGrade] = useState<number>(6);
  const [classId, setClassId] = useState('');
  const [shift, setShift] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofDataUrl, setProofDataUrl] = useState<string>('');

  const activeTeachers = useMemo(() => {
    return allUsers.filter(u => u.role === UserRole.TEACHER && u.status === 'active');
  }, [allUsers]);

  const availableSchools = useMemo(() => {
    const schoolsFromTeachers = activeTeachers.map(t => t.school).filter(Boolean) as string[];
    const uniqueSchools = Array.from(new Set([...schoolsList, ...schoolsFromTeachers])).sort();
    return uniqueSchools;
  }, [schoolsList, activeTeachers]);

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
    return Array.from(new Set(
      filteredClassrooms
        .filter(c => c.classId === classId)
        .map(c => c.shift)
    ));
  }, [filteredClassrooms, classId, role]);

  const matchingTeacher = useMemo(() => {
    if (role === UserRole.TEACHER) return null;
    const room = filteredClassrooms.find(c => c.classId === classId && c.shift === shift);
    if (!room) return null;
    return activeTeachers.find(t => t.id === room.teacherId);
  }, [filteredClassrooms, classId, shift, activeTeachers, role]);

  useEffect(() => {
    setClassId('');
    setShift('');
  }, [school, grade]);

  useEffect(() => {
    setShift('');
  }, [classId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
    setErrorMsg('');
    setEmail('');
    setPassword('');
    setSchool('');
    setClassId('');
    setShift('');
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
      
      const finalSchool = school === 'other' ? customSchool : school;
      const finalTeacherId = role === UserRole.STUDENT ? (matchingTeacher?.id || '') : '';

      if (role === UserRole.TEACHER && step === 3) {
          setStep(4);
          setIsLoading(false);
          return;
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      register({ 
        name, 
        email, 
        role, 
        school: finalSchool, 
        grade, 
        classId, 
        shift, 
        teacherId: finalTeacherId,
        proofFileUrl: proofDataUrl 
      });
      setIsLoading(false);

      if (role === UserRole.TEACHER) setStep(5);
      else navigate('/dashboard');
  };

  if (step === 5) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border-b-4 border-gray-200 text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 text-secondary rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={48} /></div>
                <h2 className="text-3xl font-black text-gray-800 mb-4">Cadastro Realizado!</h2>
                <p className="text-gray-500 font-bold mb-8">Seus dados e documentos foram enviados com sucesso para nossa pasta de validação. Aguarde a análise do administrador.</p>
                <button onClick={() => { setStep(2); setMode('login'); }} className="w-full bg-primary hover:bg-blue-600 text-white font-extrabold py-4 rounded-xl shadow-lg border-b-4 border-blue-700">VOLTAR PARA O INÍCIO</button>
            </div>
        </div>
      );
  }

  if (step === 1) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-b-4 border-gray-200 text-center">
                <div className="flex justify-center mb-6">
                   <Mascot size={180} />
                </div>
                <h1 className="text-4xl font-extrabold text-secondary mb-2">Ciencias<span className="text-primary">Quest</span></h1>
                <p className="text-gray-500 font-bold mb-8 text-sm uppercase tracking-widest">Plataforma BNCC Gamificada</p>
                <div className="space-y-4">
                    <button onClick={() => handleRoleSelect(UserRole.STUDENT)} className="w-full p-6 rounded-2xl border-2 border-primary bg-blue-50 text-primary hover:bg-blue-100 transition-all flex items-center gap-4 group shadow-sm">
                        <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform"><User size={32} /></div>
                        <div className="text-left"><span className="block font-black text-xl">SOU ALUNO</span></div>
                    </button>
                    <button onClick={() => handleRoleSelect(UserRole.TEACHER)} className="w-full p-6 rounded-2xl border-2 border-secondary bg-green-50 text-secondary hover:bg-green-100 transition-all flex items-center gap-4 group shadow-sm">
                        <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform"><BookOpen size={32} /></div>
                        <div className="text-left"><span className="block font-black text-xl">SOU PROFESSOR</span></div>
                    </button>
                    <button onClick={() => handleRoleSelect(UserRole.ADMIN)} className="w-full p-4 rounded-xl border-2 border-gray-300 text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-4 justify-center text-sm font-bold mt-8">
                        <LockKeyhole size={16} /> ÁREA ADMINISTRATIVA
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
                <div className="clear-both"></div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6">{role === UserRole.STUDENT ? 'Área do Aluno' : role === UserRole.TEACHER ? 'Área do Professor' : 'Admin'}</h2>
                <div className="flex gap-4 mb-6">
                    <button onClick={() => setMode('login')} className={`flex-1 py-3 font-bold rounded-xl ${mode === 'login' ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}>ENTRAR</button>
                    {role !== UserRole.ADMIN && (
                        <button onClick={() => setMode('register')} className={`flex-1 py-3 font-bold rounded-xl ${mode === 'register' ? 'bg-secondary text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}>CADASTRAR</button>
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
                                <label className="block text-xs font-black text-gray-400 uppercase mb-1">SENHA</label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold outline-none" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                                </div>
                            </div>
                        )}
                        {errorMsg && <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-lg">{errorMsg}</p>}
                        <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-blue-600 text-white font-extrabold py-3 rounded-xl shadow-lg border-b-4 border-blue-700 mt-2">{isLoading ? 'ENTRANDO...' : 'ACESSAR CONTA'}</button>
                    </form>
                ) : (
                    <button onClick={() => setStep(3)} className="w-full bg-secondary hover:bg-green-600 text-white font-extrabold py-3 rounded-xl shadow-lg border-b-4 border-green-700">INICIAR CADASTRO</button>
                )}
            </div>
        </div>
      );
  }

  if (step === 4 && role === UserRole.TEACHER) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-b-4 border-gray-200">
                <div className="text-center mb-6">
                    <ShieldCheck className="mx-auto text-secondary mb-2" size={48} />
                    <h2 className="text-2xl font-extrabold text-gray-800">Validação Docente</h2>
                    <p className="text-gray-500 text-sm font-bold">Por favor, envie um documento comprobatório do magistério (Diploma ou Contracheque).</p>
                </div>
                <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                        <label className="block text-sm font-bold text-primary cursor-pointer hover:underline">
                            Clique para anexar arquivo
                            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                        </label>
                        {proofFile && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3 text-left">
                            <FileText className="text-primary shrink-0" />
                            <div className="overflow-hidden">
                              <p className="text-xs font-black text-gray-800 truncate">{proofFile.name}</p>
                              <p className="text-[10px] text-gray-400">{(proofFile.size / 1024).toFixed(1)} KB • Pronto para validação</p>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setStep(3)} className="flex-1 py-3 font-bold text-gray-500">Voltar</button>
                        <button onClick={handleRegisterSubmit} disabled={!proofFile || isLoading} className="flex-1 bg-secondary hover:bg-green-600 text-white font-extrabold py-3 rounded-xl shadow-lg border-b-4 border-green-700 disabled:opacity-50 disabled:grayscale">
                            {isLoading ? 'ENVIANDO...' : 'CONCLUIR'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-b-4 border-gray-200">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">Cadastro {role === UserRole.STUDENT ? 'do Aluno' : 'do Professor'}</h2>
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700 font-bold text-sm mb-1">Nome Completo</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary font-bold" />
            </div>
            <div>
                <label className="block text-gray-700 font-bold text-sm mb-1">Email</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary font-bold" />
            </div>
            <div>
                 <label className="block text-gray-700 font-bold text-sm mb-1">Escola</label>
                 <select required value={school} onChange={(e) => setSchool(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary font-bold bg-white mb-2">
                    <option value="">Selecione a Escola</option>
                    {availableSchools.map(s => <option key={s} value={s}>{s}</option>)}
                    {role === UserRole.TEACHER && <option value="other">+ Cadastrar Nova Escola</option>}
                 </select>
                 {school === 'other' && <input required type="text" value={customSchool} onChange={(e) => setCustomSchool(e.target.value)} placeholder="Nome da escola" className="w-full p-3 rounded-xl border-2 border-secondary bg-green-50 font-bold" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 font-bold text-sm mb-1">Ano</label>
                    <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold bg-white">
                        {[6, 7, 8, 9].map(g => <option key={g} value={g}>{g}º Ano</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-bold text-sm mb-1">Turma</label>
                    <select required value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold bg-white disabled:bg-gray-50">
                        <option value="">Selecione...</option>
                        {classroomOptions.map(c => <option key={c} value={c}>Turma {c}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-gray-700 font-bold text-sm mb-1">Turno</label>
                <select required value={shift} onChange={(e) => setShift(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 font-bold bg-white disabled:bg-gray-50">
                    <option value="">Selecione...</option>
                    {shiftOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            {role === UserRole.STUDENT && (
                <div className={`bg-blue-50 p-4 rounded-2xl border-2 transition-all ${matchingTeacher ? 'border-primary' : 'border-gray-100'}`}>
                     <label className="block text-primary font-black text-xs uppercase mb-1">Professor(a) Sincronizado</label>
                     <p className="font-bold text-gray-700">{matchingTeacher ? matchingTeacher.name : <span className="text-gray-400 italic">Aguardando Turma/Turno...</span>}</p>
                </div>
            )}
            <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep(2)} className="px-6 py-3 font-bold text-gray-400">Voltar</button>
                <button type="submit" disabled={role === UserRole.STUDENT && !matchingTeacher} className="flex-1 bg-primary hover:bg-blue-600 text-white font-extrabold py-3 rounded-xl shadow-lg border-b-4 border-blue-700 disabled:opacity-50">PRÓXIMO</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
