
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AvatarConfig, Classroom } from '../types';
import { DEFAULT_AVATAR, MOCK_SCHOOLS } from '../constants';
import { normalizeSchoolName } from '../utils/security';

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  schoolsList: string[];
  activeClassrooms: Classroom[];
  
  login: (email: string, role: UserRole, password?: string) => { success: boolean, message?: string };
  register: (userData: Partial<User>) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  logout: () => void;
  
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
  const [schoolsList, setSchoolsList] = useState<string[]>(MOCK_SCHOOLS);
  const [activeClassrooms, setActiveClassrooms] = useState<Classroom[]>([]);
  const [unlockedUnitIds, setUnlockedUnitIds] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('cq_current_user');
    const storedAllUsers = localStorage.getItem('cq_all_users');
    const storedSchools = localStorage.getItem('cq_schools_list');
    const storedClassrooms = localStorage.getItem('cq_active_classrooms');
    const storedLocks = localStorage.getItem('cq_unlocked_units_v2');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedAllUsers) setAllUsers(JSON.parse(storedAllUsers));
    if (storedSchools) setSchoolsList(JSON.parse(storedSchools));
    if (storedClassrooms) setActiveClassrooms(JSON.parse(storedClassrooms));
    
    if (storedLocks) {
      setUnlockedUnitIds(JSON.parse(storedLocks));
    } else {
      setUnlockedUnitIds(['g6-rev', 'g7-rev', 'g8-rev', 'g9-rev']);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cq_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('cq_schools_list', JSON.stringify(schoolsList));
  }, [schoolsList]);

  useEffect(() => {
    localStorage.setItem('cq_active_classrooms', JSON.stringify(activeClassrooms));
  }, [activeClassrooms]);

  useEffect(() => {
    localStorage.setItem('cq_unlocked_units_v2', JSON.stringify(unlockedUnitIds));
  }, [unlockedUnitIds]);

  const register = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || 'Usuário',
      email: userData.email || `${userData.name?.toLowerCase().replace(/\s/g, '')}@email.com`,
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
  };

  const updateUser = (userId: string, data: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (user?.id === userId) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('cq_current_user', JSON.stringify(updatedUser));
    }
  };

  const login = (email: string, role: UserRole, password?: string) => {
    if (role === UserRole.ADMIN) {
      if (email === 'ronnitic@gmail.com' && password === "%tGb<>:5ioip!'2à+=") {
        const adminUser: User = { 
            id: 'admin-master', 
            name: 'Ronni (Admin)', 
            email: 'ronnitic@gmail.com', 
            role: UserRole.ADMIN, 
            status: 'active', 
            isVerified: true 
        };
        setUser(adminUser);
        localStorage.setItem('cq_current_user', JSON.stringify(adminUser));
        return { success: true };
      }
      return { success: false, message: 'Usuário ou senha administrativa inválidos.' };
    }

    const foundUser = allUsers.find(u => u.email === email && u.role === role);
    if (!foundUser) return { success: false, message: 'Usuário não encontrado.' };
    if (foundUser.status === 'blocked') return { success: false, message: 'Sua conta está suspensa. Entre em contato com o suporte.' };
    if (foundUser.role === UserRole.TEACHER && foundUser.status === 'pending') return { success: false, message: 'Cadastro em análise pela administração.' };
    
    setUser(foundUser);
    localStorage.setItem('cq_current_user', JSON.stringify(foundUser));
    return { success: true };
  };

  const logout = () => { setUser(null); localStorage.removeItem('cq_current_user'); };

  const updateAvatar = (config: AvatarConfig) => {
    if (user) {
      const updated = { ...user, avatarConfig: config };
      setUser(updated);
      localStorage.setItem('cq_current_user', JSON.stringify(updated));
      setAllUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    }
  };

  const addXp = (amount: number) => {
    if (user && user.role === UserRole.STUDENT) {
      const updated = { ...user, xp: (user.xp || 0) + amount };
      setUser(updated);
      localStorage.setItem('cq_current_user', JSON.stringify(updated));
      setAllUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    }
  };

  const toggleUnitLock = (unitId: string) => {
    setUnlockedUnitIds(prev => prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]);
  };

  const approveTeacher = (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active', isVerified: true } : u));
  };

  const toggleUserStatus = (userId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'blocked' : 'active' };
      }
      return u;
    }));
  };

  const renameSchool = (oldName: string, newName: string) => {
    setSchoolsList(prev => prev.map(s => s === oldName ? newName : s));
    setAllUsers(prev => prev.map(u => {
      let updatedUser = { ...u };
      if (u.school === oldName) updatedUser.school = newName;
      if (u.teacherSchools?.includes(oldName)) {
        updatedUser.teacherSchools = u.teacherSchools.map(ts => ts === oldName ? newName : ts);
      }
      return updatedUser;
    }));
    setActiveClassrooms(prev => prev.map(c => c.school === oldName ? { ...c, school: newName } : c));
  };

  const deleteSchool = (schoolName: string) => {
    setSchoolsList(prev => prev.filter(s => s !== schoolName));
  };

  const deleteUser = (userId: string) => { setAllUsers(prev => prev.filter(u => u.id !== userId)); };

  const addSchool = (schoolName: string) => {
    const normalizedNew = normalizeSchoolName(schoolName);
    const exists = schoolsList.some(s => normalizeSchoolName(s) === normalizedNew);
    if (!exists) setSchoolsList(prev => [...prev, schoolName]);
  };

  const addClassroom = (classroomData: Omit<Classroom, 'id'>) => {
    const newClassroom: Classroom = { ...classroomData, id: Date.now().toString() };
    setActiveClassrooms(prev => [...prev, newClassroom]);
  };

  const updateClassroom = (id: string, data: Partial<Classroom>) => {
    setActiveClassrooms(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const removeClassroom = (classroomId: string) => { setActiveClassrooms(prev => prev.filter(c => c.id !== classroomId)); };
  
  const switchActiveSchool = (schoolName: string) => {
    if (user && user.role === UserRole.TEACHER) {
      updateUser(user.id, { school: schoolName });
    }
  };

  const removeSchoolFromTeacher = (schoolName: string) => {
    if (user && user.role === UserRole.TEACHER) {
      const updatedSchools = (user.teacherSchools || []).filter(s => s !== schoolName);
      let nextActiveSchool = user.school === schoolName ? (updatedSchools[0] || '') : user.school;
      updateUser(user.id, { teacherSchools: updatedSchools, school: nextActiveSchool });
    }
  };

  return (
    <AuthContext.Provider value={{ 
        user, allUsers, schoolsList, activeClassrooms,
        login, register, updateUser, logout, updateAvatar, addXp,
        unlockedUnitIds, toggleUnitLock,
        approveTeacher, deleteUser, toggleUserStatus, addSchool, renameSchool, deleteSchool,
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
