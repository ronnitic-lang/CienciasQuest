
import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Target, Users } from 'lucide-react';
import Avatar from '../components/Avatar';

const Leaderboard: React.FC = () => {
  const { user, allUsers } = useAuth();

  // Filtra apenas alunos da MESMA escola, ano, turma e turno
  const classRanking = useMemo(() => {
    if (!user) return [];
    
    return allUsers
      .filter(u => 
        u.role === 'STUDENT' && 
        u.school === user.school && 
        u.grade === user.grade && 
        u.classId === user.classId && 
        u.shift === user.shift
      )
      .sort((a, b) => (b.xp || 0) - (a.xp || 0));
  }, [allUsers, user]);

  const userRankIndex = classRanking.findIndex(u => u.id === user?.id);
  const userRank = userRankIndex + 1;

  return (
    <div className="pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-2">
          <Trophy className="text-accent" size={32} /> Ranking da Turma
        </h1>
        <p className="text-gray-500 font-bold">
          {user?.school} • {user?.grade}º {user?.classId} ({user?.shift})
        </p>
      </div>

      {/* User Stats Card */}
      <div className="bg-primary text-white p-6 rounded-3xl shadow-xl border-b-8 border-blue-700 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
                <Target size={32} />
            </div>
            <div>
                <p className="text-blue-100 text-xs font-black uppercase tracking-widest">Sua Posição</p>
                <h2 className="text-4xl font-black">{userRank}º Lugar</h2>
            </div>
        </div>
        <div className="text-right">
            <p className="text-blue-100 text-xs font-black uppercase tracking-widest">Seu Pontuação</p>
            <h2 className="text-4xl font-black">{user?.xp || 0} <span className="text-xl">XP</span></h2>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-gray-400 font-black text-xs uppercase tracking-widest">
            <Users size={16} /> Alunos na disputa
        </div>
        
        <div className="divide-y divide-gray-50">
          {classRanking.map((student, index) => {
            const isMe = student.id === user?.id;
            const rank = index + 1;
            
            return (
              <div 
                key={student.id} 
                className={`flex items-center justify-between p-4 transition-colors ${isMe ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 text-center font-black text-xl ${
                    rank === 1 ? 'text-yellow-500' : 
                    rank === 2 ? 'text-gray-400' : 
                    rank === 3 ? 'text-amber-600' : 'text-gray-300'
                  }`}>
                    {rank <= 3 ? (
                        <Medal size={24} className="mx-auto" />
                    ) : rank}
                  </div>
                  
                  <div className="relative">
                    {student.avatarConfig && <Avatar config={student.avatarConfig} size={48} />}
                    {isMe && (
                        <div className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">VOCÊ</div>
                    )}
                  </div>
                  
                  <div>
                    <p className={`font-bold ${isMe ? 'text-primary' : 'text-gray-700'}`}>
                        {student.name.split(' ')[0]} {student.name.split(' ')[1] || ''}
                    </p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                        {student.xp || 0} pontos acumulados
                    </p>
                  </div>
                </div>

                <div className="text-right">
                    <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-secondary transition-all" 
                            style={{ width: `${Math.min((student.xp || 0) / 10, 100)}%` }}
                        />
                    </div>
                </div>
              </div>
            );
          })}
          
          {classRanking.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                  <p className="font-bold">Nenhum colega encontrado nesta turma.</p>
                  <p className="text-sm">Convide seus amigos para a competição!</p>
              </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 border-2 border-yellow-100 p-4 rounded-2xl flex items-start gap-3">
          <div className="text-yellow-500 mt-1">🏆</div>
          <p className="text-sm text-yellow-800 font-bold leading-relaxed">
            Mantenha sua ofensiva alta e complete as lições para subir no ranking! A cada 100 XP você sobe um degrau na trilha.
          </p>
      </div>
    </div>
  );
};

export default Leaderboard;
