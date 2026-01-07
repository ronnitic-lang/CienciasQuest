
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
    <div className="pb-20 relative animate-fade-in">
      {showSaved && (
          <div className="fixed top-20 right-4 z-50 bg-secondary text-white px-6 py-3 rounded-2xl shadow-xl border-b-4 border-green-700 animate-bounce-in flex items-center gap-2 font-black uppercase text-xs">
              <Check size={18} /> Perfil Atualizado!
          </div>
      )}

      <h1 className="text-3xl font-black text-gray-800 mb-8 tracking-tight">MEU PERFIL</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-b-8 border-gray-100 text-center sticky top-24">
                 <Avatar config={config} size={200} className="mx-auto" />
                 <h2 className="mt-6 font-black text-2xl text-gray-800 leading-tight">{user?.name}</h2>
                 <p className="text-gray-400 font-bold mb-6 uppercase tracking-widest text-[10px]">
                     {user?.role === UserRole.STUDENT ? '👨‍🎓 ALUNO(A)' : '👩‍🏫 PROFESSOR(A)'}
                 </p>
                 
                 {/* Apenas alunos possuem pontuação XP visível */}
                 {user?.role === UserRole.STUDENT && (
                    <div className="bg-blue-50 p-5 rounded-3xl flex items-center justify-center gap-3 border-2 border-blue-100">
                        <Star className="text-accent" fill="currentColor" size={24} />
                        <div>
                            <p className="text-primary font-black text-3xl leading-none">{user?.xp || 0}</p>
                            <p className="text-[10px] font-black text-blue-300 uppercase tracking-tighter">PONTOS XP</p>
                        </div>
                    </div>
                 )}
            </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h3 className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-widest flex items-center gap-2">
                    <User size={14} /> Dados Cadastrais
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-500 font-bold mb-2 text-xs uppercase ml-1">Nome de Exibição</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-5 rounded-2xl border-2 border-gray-100 font-bold focus:border-primary focus:bg-white outline-none bg-gray-50 transition-all" />
                    </div>
                    <div>
                        <label className="block text-gray-500 font-bold mb-2 text-xs uppercase ml-1">Email (Login)</label>
                        <input type="text" disabled value={user?.email} className="w-full p-5 rounded-2xl border-2 border-gray-100 font-bold bg-gray-100 text-gray-400 cursor-not-allowed" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-10">
                <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase mb-8 tracking-widest">Personalizar Avatar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="block text-gray-600 font-black mb-3 text-xs uppercase">Tom de Pele</label>
                            <div className="flex gap-3 flex-wrap">
                                {skinTones.map(c => (
                                    <button key={c} onClick={() => setConfig({...config, skinColor: c})} className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 ${config.skinColor === c ? 'border-primary shadow-lg' : 'border-white shadow-sm'}`} style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-gray-600 font-black mb-3 text-xs uppercase">Cor dos Fios</label>
                            <div className="flex gap-3 flex-wrap">
                                {hairColors.map(c => (
                                    <button key={c} onClick={() => setConfig({...config, hairColor: c})} className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 ${config.hairColor === c ? 'border-primary shadow-lg' : 'border-white shadow-sm'}`} style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="block text-gray-600 font-black text-xs uppercase">Estilo de Cabelo</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {['short', 'long', 'bob', 'puffs', 'bald', 'fade'].map((style) => (
                                <button key={style} onClick={() => setConfig({...config, hairStyle: style as any})} className={`py-4 rounded-2xl border-2 font-black text-[10px] transition-all ${config.hairStyle === style ? 'border-primary bg-blue-50 text-primary' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}>
                                    {style.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    {user?.role === UserRole.TEACHER && (
                        <div className="space-y-4">
                            <label className="block text-gray-600 font-black text-xs uppercase flex items-center gap-2">Detalhes Faciais <Sparkles size={14} className="text-accent" /></label>
                            <div className="grid grid-cols-3 gap-3">
                                {['none', 'beard', 'mustache'].map((f) => (
                                    <button key={f} onClick={() => setConfig({...config, facialHair: f as any})} className={`py-4 rounded-2xl border-2 font-black text-[10px] transition-all ${config.facialHair === f ? 'border-secondary bg-green-50 text-secondary' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}>
                                        {f === 'none' ? 'LIMPO' : f.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={handleSave} className="w-full bg-primary text-white font-black py-6 rounded-[2rem] shadow-2xl border-b-8 border-blue-700 flex items-center justify-center gap-3 transition-all hover:brightness-105 active:translate-y-2 active:border-b-0">
                    <Save size={24} /> SALVAR PERFIL
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
