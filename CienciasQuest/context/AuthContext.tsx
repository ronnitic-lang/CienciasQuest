
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AvatarConfig, Classroom } from '../types';
import { DEFAULT_AVATAR, MOCK_SCHOOLS, BRAZIL_CITIES } from '../constants';
import { normalizeSchoolName, normalizeText } from '../utils/security';

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  schoolsList: string[];
  activeClassrooms: Classroom[];
  citiesList: Record<string, string[]>;
  
  login: (email: string, role: UserRole, password?: string) => { success: boolean, message?: string };
  register: (userData: Partial<User>) => { success: boolean, message?: string };
  updateUser: (userId: string, data: Partial<User>) => void;
  logout: () => void;
  recoverPassword: (email: string) => { success: boolean, message: string };
  
  updateAvatar: (config: AvatarConfig) => void;
  addXp: (amount: number) => void;
  
  unlockedUnitIds: string[];
  toggleUnitLock: (unitId: string) => void;

  // Admin Actions
  approveTeacher: (userId: string) => void;
  deleteUser: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;
  addSchool: (schoolName: string) => void;
  renameSchool: (oldName: string, newName: string) => void;
  deleteSchool: (schoolName: string) => void;
  addCity: (state: string, city: string) => void;

  // Teacher Actions
  addClassroom: (classroom: Omit<Classroom, 'id'>) => void;
  updateClassroom: (classroomId: string, data: Partial<Classroom>) => void;
  removeClassroom: (classroomId: string) => void;
  switchActiveSchool: (schoolName: string) => void;
  removeSchoolFromTeacher: (schoolName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [schoolsList, setSchoolsList] = useState<string[]>([]);
  const [activeClassrooms, setActiveClassrooms] = useState<Classroom[]>([]);
  const [unlockedUnitIds, setUnlockedUnitIds] = useState<string[]>([]);
  const [citiesList, setCitiesList] = useState<Record<string, string[]>>(BRAZIL_CITIES);

  useEffect(() => {
    const storedUser = localStorage.getItem('cq_current_user');
    const storedAllUsers = localStorage.getItem('cq_all_users');
    const storedSchools = localStorage.getItem('cq_schools_list');
    const storedClassrooms = localStorage.getItem('cq_active_classrooms');
    const storedLocks = localStorage.getItem('cq_unlocked_units_v2');
    const storedCities = localStorage.getItem('cq_cities_list');

    if (storedAllUsers) setAllUsers(JSON.parse(storedAllUsers));
    if (storedUser) setUser(JSON.parse(storedUser));
    
    if (storedSchools) {
      setSchoolsList(JSON.parse(storedSchools));
    } else {
      setSchoolsList(MOCK_SCHOOLS);
    }

    if (storedClassrooms) setActiveClassrooms(JSON.parse(storedClassrooms));
    if (storedCities) setCitiesList(JSON.parse(storedCities));
    
    if (storedLocks) {
      setUnlockedUnitIds(JSON.parse(storedLocks));
    } else {
      setUnlockedUnitIds(['g6-rev', 'g7-rev', 'g8-rev', 'g9-rev']);
    }
  }, []);

  // Persistência automática robusta
  useEffect(() => { localStorage.setItem('cq_all_users', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('cq_schools_list', JSON.stringify(schoolsList)); }, [schoolsList]);
  useEffect(() => { localStorage.setItem('cq_active_classrooms', JSON.stringify(activeClassrooms)); }, [activeClassrooms]);
  useEffect(() => { localStorage.setItem('cq_unlocked_units_v2', JSON.stringify(unlockedUnitIds)); }, [unlockedUnitIds]);
  useEffect(() => { localStorage.setItem('cq_cities_list', JSON.stringify(citiesList)); }, [citiesList]);

  const register = (userData: Partial<User>) => {
    const normName = normalizeText(userData.name || "");
    
    if (userData.role === UserRole.STUDENT) {
      const exists = allUsers.some(u => 
        u.role === UserRole.STUDENT &&
        normalizeText(u.name) === normName &&
        u.school === userData.school &&
        u.grade === userData.grade &&
        u.classId === userData.classId &&
        u.shift === userData.shift
      );
      if (exists) return { success: false, message: "Já existe um aluno com este nome cadastrado nesta turma." };
    }

    if (userData.role === UserRole.TEACHER) {
      const exists = allUsers.some(u => u.role === UserRole.TEACHER && normalizeText(u.name) === normName);
      if (exists) return { success: false, message: "Este professor já possui cadastro no sistema." };
    }

    // Se o professor inseriu uma nova escola no ato do registro, ela deve ser global
    if (userData.school) {
        addSchool(userData.school);
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || 'Usuário',
      email: userData.email || '',
      whatsapp: userData.whatsapp || '',
      password: userData.password || '',
      role: userData.role || UserRole.STUDENT,
      status: userData.role === UserRole.TEACHER ? 'pending' : 'active',
      state: userData.state,
      city: userData.city,
      school: userData.school,
      teacherSchools: userData.role === UserRole.TEACHER && userData.school ? [userData.school] : [],
      grade: userData.grade,
      classId: userData.classId,
      shift: userData.shift,
      teacherId: userData.teacherId,
      isVerified: userData.role === UserRole.ADMIN,
      proofFileUrl: userData.proofFileUrl,
      xp: 0,
      streak: 1,
      avatarConfig: DEFAULT_AVATAR as AvatarConfig,
      ...userData
    };

    setAllUsers(prev => [...prev, newUser]);
    
    if (newUser.role === UserRole.STUDENT) {
        setUser(newUser);
        localStorage.setItem('cq_current_user', JSON.stringify(newUser));
    }
    return { success: true };
  };

  const login = (email: string, role: UserRole, password?: string) => {
    if (role === UserRole.ADMIN) {
      if (email === 'ronnitic@gmail.com' && password === "%tGb<>:5ioip!'2à+=") {
        const adminUser: User = { id: 'admin-master', name: 'Ronni (Admin)', email: 'ronnitic@gmail.com', role: UserRole.ADMIN, status: 'active', isVerified: true };
        setUser(adminUser);
        localStorage.setItem('cq_current_user', JSON.stringify(adminUser));
        return { success: true };
      }
      return { success: false, message: 'Credenciais administrativas incorretas.' };
    }

    const foundUser = allUsers.find(u => u.email === email && u.role === role);
    if (!foundUser) return { success: false, message: 'Usuário não cadastrado.' };
    if (foundUser.password !== password) return { success: false, message: 'Senha inválida.' };
    if (foundUser.status === 'blocked') return { success: false, message: 'Sua conta está suspensa.' };
    if (foundUser.role === UserRole.TEACHER && foundUser.status === 'pending') return { success: false, message: 'Aguardando aprovação do Admin.' };
    
    setUser(foundUser);
    localStorage.setItem('cq_current_user', JSON.stringify(foundUser));
    return { success: true };
  };

  const recoverPassword = (email: string) => {
    const found = allUsers.find(u => u.email === email);
    if (found) {
      return { success: true, message: `Uma mensagem de recuperação foi enviada. (Senha atual: ${found.password})` };
    }
    return { success: false, message: "E-mail não localizado." };
  };

  const logout = () => { setUser(null); localStorage.removeItem('cq_current_user'); };

  const addSchool = (schoolName: string) => {
    const normalizedNew = normalizeSchoolName(schoolName);
    setSchoolsList(prev => {
        const exists = prev.some(s => normalizeSchoolName(s) === normalizedNew);
        if (!exists) return [...prev, schoolName];
        return prev;
    });
  };

  const updateUser = (userId: string, data: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (user?.id === userId) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('cq_current_user', JSON.stringify(updatedUser));
    }
  };

  const renameSchool = (oldName: string, newName: string) => {
    setSchoolsList(prev => prev.map(s => s === oldName ? newName : s));
    setAllUsers(prev => prev.map(u => {
        let updated = { ...u };
        if (u.school === oldName) updated.school = newName;
        if (u.teacherSchools?.includes(oldName)) {
            updated.teacherSchools = u.teacherSchools.map(ts => ts === oldName ? newName : ts);
        }
        return updated;
    }));
  };

  const deleteSchool = (schoolName: string) => { 
      setSchoolsList(prev => prev.filter(s => s !== schoolName));
  };

  const addCity = (state: string, city: string) => {
    setCitiesList(prev => ({ ...prev, [state]: Array.from(new Set([...(prev[state] || []), city])) }));
  };

  const addClassroom = (classroomData: Omit<Classroom, 'id'>) => {
    const newClassroom: Classroom = { ...classroomData, id: Date.now().toString() };
    setActiveClassrooms(prev => [...prev, newClassroom]);
  };

  const updateClassroom = (id: string, data: Partial<Classroom>) => {
    setActiveClassrooms(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const removeClassroom = (classroomId: string) => { 
    setActiveClassrooms(prev => prev.filter(c => c.id !== classroomId)); 
  };
  
  const switchActiveSchool = (schoolName: string) => { if (user) updateUser(user.id, { school: schoolName }); };

  const removeSchoolFromTeacher = (schoolName: string) => {
    if (user && user.role === UserRole.TEACHER) {
      const updatedSchools = (user.teacherSchools || []).filter(s => s !== schoolName);
      updateUser(user.id, { 
          teacherSchools: updatedSchools, 
          school: user.school === schoolName ? (updatedSchools[0] || '') : user.school 
      });
    }
  };

  const approveTeacher = (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active', isVerified: true } : u));
  };

  const toggleUserStatus = (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
  };

  const deleteUser = (userId: string) => { setAllUsers(prev => prev.filter(u => u.id !== userId)); };

  const updateAvatar = (config: AvatarConfig) => {
    if (user) updateUser(user.id, { avatarConfig: config });
  };

  const addXp = (amount: number) => {
    if (user && user.role === UserRole.STUDENT) {
      updateUser(user.id, { xp: (user.xp || 0) + amount });
    }
  };

  const toggleUnitLock = (unitId: string) => {
    setUnlockedUnitIds(prev => prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]);
  };

  return (
    <AuthContext.Provider value={{ 
        user, allUsers, schoolsList, activeClassrooms, citiesList,
        login, register, updateUser, logout, updateAvatar, addXp, recoverPassword,
        unlockedUnitIds, toggleUnitLock,
        approveTeacher, deleteUser, toggleUserStatus, addSchool, renameSchool, deleteSchool, addCity,
        addClassroom, updateClassroom, removeClassroom, switchActiveSchool, removeSchoolFromTeacher
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
