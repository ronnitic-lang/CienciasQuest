
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

  // Funções de Ação
  const handleRoleSelect = (selectedRole: UserRole) => {
    // Garantir que o estado seja limpo antes da transição
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
      setIsLoading(true);
      setErrorMsg('');

      if (isProfane(name)) {
        setErrorMsg("Nome inválido.");
        setIsLoading(false);
        return;
      }
      
      const finalSchool = school === 'other' ? customSchool : school;

      register({ 
        name, email, role, state, city,
        school: finalSchool, grade, classId, shift, 
        teacherId: matchingTeacher?.id,
        proofFileUrl: proofDataUrl 
      });
      
      setIsLoading(false);
      navigate('/dashboard');
  };

  const activeTeachersInCity = useMemo(() => {
    return allUsers.filter(u => u.role === UserRole.TEACHER && u.status === 'active' && u.city === city);
  }, [allUsers, city]);

  const schoolsInCity = useMemo(() => {
    if (role === UserRole.TEACHER) return schoolsList.sort();
    const schoolsWithTeachers = activeTeachersInCity.map(t => t.school).filter(Boolean) as string[];
    return Array.from(new Set(schoolsWithTeachers)).sort();
  }, [schoolsList, activeTeachersInCity, role]);

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

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white p-10 rounded-[2rem] shadow-2xl w-full max-w-md border-b-8 border-gray-200 text-center animate-fade-in">
              <h1 className="text-4xl font-black text-secondary mb-2 tracking-tight">Ciencias<span className="text-primary">Quest</span></h1>
              <p className="text-gray-400 font-bold mb-10 text-[10px] uppercase tracking-[0.2em]">Sua Jornada na BNCC</p>
              
              <div className="space-y-4">
                  <button 
                    onClick={() => handleRoleSelect(UserRole.STUDENT)} 
                    className="w-full p-6 rounded-3xl border-2 border-primary bg-blue-50 text-primary hover:bg-blue-100 transition-all flex items-center gap-5 group active:scale-95"
                  >
                      <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:rotate-12 transition-transform"><User size={32} /></div>
                      <span className="font-black text-xl">SOU ALUNO</span>
                  </button>

                  <button 
                    onClick={() => handleRoleSelect(UserRole.TEACHER)} 
                    className="w-full p-6 rounded-3xl border-2 border-secondary bg-green-50 text-secondary hover:bg-green-100 transition-all flex items-center gap-5 group active:scale-95"
                  >
                      <div className="bg-white p-3 rounded-2xl shadow-sm group-hover:rotate-12 transition-transform"><BookOpen size={32} /></div>
                      <span className="font-black text-xl">SOU PROFESSOR</span>
                  </button>

                  <button 
                    onClick={() => handleRoleSelect(UserRole.ADMIN)} 
                    className="w-full p-4 rounded-2xl border-2 border-gray-200 text-gray-400 hover:bg-gray-50 transition-all font-black text-xs mt-6 flex items-center justify-center gap-2"
                  >
                      <LockKeyhole size={14} /> ÁREA ADMINISTRATIVA
                  </button>
              </div>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border-b-8 border-gray-200 animate-fade-in">
            <button onClick={() => setStep(1)} className="text-gray-400 font-black text-xs mb-6 uppercase tracking-widest hover:text-primary transition-colors">← Voltar</button>
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
                    <input type="text" placeholder="Seu email..." value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary outline-none" required />
                    {role === UserRole.ADMIN && <input type="password" placeholder="Chave mestra..." value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-dark outline-none" required />}
                    {errorMsg && <p className="text-red-500 text-xs font-black text-center">{errorMsg}</p>}
                    <button type="submit" className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-blue-700 uppercase tracking-widest active:translate-y-1 transition-all">ACESSAR SISTEMA</button>
                </form>
            ) : (
                <button onClick={() => setStep(3)} className="w-full bg-secondary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-green-700 uppercase tracking-widest active:translate-y-1 transition-all">INICIAR INSCRIÇÃO</button>
            )}
        </div>
    </div>
  );
};

export default Login;
