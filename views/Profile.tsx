
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import { AvatarConfig, UserRole } from '../types';
import { Save, Sparkles, User, Check, Star } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateAvatar, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [config, setConfig] = useState<AvatarConfig>(user?.avatarConfig || {
      skinColor: '#F5D0C5', accessory: 'none', clothing: 'tshirt',
      hairColor: '#4A4A4A', hairStyle: 'short', headwear: 'none'
  });
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
      if (user) {
          updateUser(user.id, { name });
          updateAvatar(config);
          setShowSaved(true);
          setTimeout(() => setShowSaved(false), 3000);
      }
  };

  const skinTones = ['#F5D0C5', '#E0AC69', '#8D5524', '#C68642', '#3d2314'];
  const hairColors = ['#4A4A4A', '#E6C229', '#A52A2A', '#000000', '#D35400', '#7F8C8D'];

  return (
    <div className="pb-20 relative">
      {showSaved && (
          <div className="fixed top-20 right-4 z-50 bg-secondary text-white px-6 py-3 rounded-2xl shadow-xl border-b-4 border-green-700 animate-bounce-in flex items-center gap-2 font-black uppercase text-xs">
              <Check size={18} /> Perfil Atualizado!
          </div>
      )}

      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center sticky top-24">
                 <Avatar config={config} size={200} className="mx-auto" />
                 <h2 className="mt-4 font-black text-2xl text-gray-800">{user?.name}</h2>
                 <p className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">
                     {user?.role === UserRole.STUDENT ? 'ALUNO(A)' : 'PROFESSOR(A)'}
                 </p>
                 
                 {/* Somente Alunos exibem Card de XP */}
                 {user?.role === UserRole.STUDENT && (
                    <div className="bg-blue-50 p-4 rounded-2xl flex items-center justify-center gap-2">
                        <Star className="text-accent" fill="currentColor" size={20} />
                        <p className="text-primary font-black text-2xl">{user?.xp || 0} XP</p>
                    </div>
                 )}
            </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                    <User size={14} /> Informações do {user?.role === UserRole.TEACHER ? 'Docente' : 'Estudante'}
                </h3>
                <div>
                    <label className="block text-gray-600 font-bold mb-2 text-xs">Nome de Exibição</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary outline-none" />
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-10">
                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">Personalizar Avatar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-gray-600 font-bold mb-3 text-xs">Tom de Pele</label>
                            <div className="flex gap-2 flex-wrap">
                                {skinTones.map(c => (
                                    <button key={c} onClick={() => setConfig({...config, skinColor: c})} className={`w-10 h-10 rounded-full border-4 ${config.skinColor === c ? 'border-primary scale-110' : 'border-white'}`} style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-600 font-bold mb-3 text-xs">Cor dos Fios</label>
                            <div className="flex gap-2 flex-wrap">
                                {hairColors.map(c => (
                                    <button key={c} onClick={() => setConfig({...config, hairColor: c})} className={`w-10 h-10 rounded-full border-4 ${config.hairColor === c ? 'border-primary scale-110' : 'border-white'}`} style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-600 font-bold mb-3 text-xs">Estilo de Cabelo</label>
                        <div className="flex gap-2 flex-wrap">
                            {['short', 'long', 'bob', 'puffs', 'bald', 'fade'].map((style) => (
                                <button key={style} onClick={() => setConfig({...config, hairStyle: style as any})} className={`px-4 py-2 rounded-xl border-2 font-black text-[10px] ${config.hairStyle === style ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400'}`}>
                                    {style.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    {user?.role === UserRole.TEACHER && (
                        <div>
                            <label className="block text-gray-600 font-bold mb-3 text-xs flex items-center gap-2">Cabelo Facial <Sparkles size={14} className="text-accent" /></label>
                            <div className="flex gap-2 flex-wrap">
                                {['none', 'beard', 'mustache'].map((f) => (
                                    <button key={f} onClick={() => setConfig({...config, facialHair: f as any})} className={`px-4 py-2 rounded-xl border-2 font-black text-[10px] ${config.facialHair === f ? 'border-secondary bg-green-50 text-secondary' : 'border-gray-100 text-gray-400'}`}>
                                        {f === 'none' ? 'SEM BARBA' : f.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={handleSave} className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-blue-700 flex items-center justify-center gap-2 transition-transform active:translate-y-1">
                    <Save size={24} /> SALVAR ALTERAÇÕES
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
