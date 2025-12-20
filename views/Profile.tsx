
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import { AvatarConfig, UserRole } from '../types';
import { BRAZIL_STATES, BRAZIL_CITIES } from '../constants';
import { MapPin, Save, User as UserIcon, Sparkles } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateAvatar } = useAuth();
  const [config, setConfig] = useState<AvatarConfig>(user?.avatarConfig || {
      skinColor: '#F5D0C5',
      accessory: 'none',
      clothing: 'tshirt',
      hairColor: '#4A4A4A',
      hairStyle: 'short',
      headwear: 'none'
  });

  const [state, setState] = useState(user?.state || '');
  const [city, setCity] = useState(user?.city || '');

  const handleSave = () => {
      updateAvatar(config);
      alert("Seu avatar foi atualizado!");
  };

  const skinTones = ['#F5D0C5', '#E0AC69', '#8D5524', '#C68642', '#3d2314'];
  const hairColors = ['#4A4A4A', '#E6C229', '#A52A2A', '#000000', '#D35400', '#7F8C8D'];

  return (
    <div className="pb-20">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Personalizar Avatar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center sticky top-24">
                 <Avatar config={config} size={200} className="mx-auto" />
                 <h2 className="mt-4 font-black text-2xl text-gray-800">{user?.name}</h2>
                 <p className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">{user?.role === UserRole.STUDENT ? 'ALUNO(A)' : 'PROFESSOR(A)'}</p>
                 <div className="bg-blue-50 p-4 rounded-2xl">
                    <p className="text-primary font-black text-2xl">{user?.xp || 0} XP</p>
                 </div>
            </div>
        </div>

        <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-10">
                {/* Etnias e Tons */}
                <div>
                    <h3 className="text-sm font-black text-gray-400 uppercase mb-4 tracking-widest">Pele e Cabelo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-gray-600 font-bold mb-3 text-xs">Tom de Pele</label>
                            <div className="flex gap-2 flex-wrap">
                                {skinTones.map(c => (
                                    <button key={c} onClick={() => setConfig({...config, skinColor: c})} className={`w-10 h-10 rounded-full border-4 transition-all ${config.skinColor === c ? 'border-primary scale-110 shadow-lg' : 'border-white'}`} style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-600 font-bold mb-3 text-xs">Cor dos Fios</label>
                            <div className="flex gap-2 flex-wrap">
                                {hairColors.map(c => (
                                    <button key={c} onClick={() => setConfig({...config, hairColor: c})} className={`w-10 h-10 rounded-full border-4 transition-all ${config.hairColor === c ? 'border-primary scale-110 shadow-lg' : 'border-white'}`} style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estilo de Adulto / Professor */}
                <div>
                    <h3 className="text-sm font-black text-gray-400 uppercase mb-4 tracking-widest">Estilo e Caracterização</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-600 font-bold mb-3 text-xs">Cabelo</label>
                            <div className="flex gap-2 flex-wrap">
                                {['short', 'long', 'bob', 'puffs', 'bald', 'fade'].map((style) => (
                                    <button key={style} onClick={() => setConfig({...config, hairStyle: style as any})} className={`px-4 py-2 rounded-xl border-2 font-black text-xs ${config.hairStyle === style ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400'}`}>
                                        {style.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {user?.role === UserRole.TEACHER && (
                            <div className="animate-fade-in">
                                <label className="block text-gray-600 font-bold mb-3 text-xs flex items-center gap-2">Cabelo Facial <Sparkles size={14} className="text-accent" /></label>
                                <div className="flex gap-2 flex-wrap">
                                    {['none', 'beard', 'mustache'].map((f) => (
                                        <button key={f} onClick={() => setConfig({...config, facialHair: f as any})} className={`px-4 py-2 rounded-xl border-2 font-black text-xs ${config.facialHair === f ? 'border-secondary bg-green-50 text-secondary' : 'border-gray-100 text-gray-400'}`}>
                                            {f === 'none' ? 'SEM BARBA' : f === 'beard' ? 'BARBA' : 'BIGODE'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-gray-600 font-bold mb-3 text-xs">Acessórios de Cabeça / Culturais</label>
                            <div className="flex gap-2 flex-wrap">
                                {['none', 'cocar', 'turban', 'strawHat'].map((h) => (
                                    <button key={h} onClick={() => setConfig({...config, headwear: h as any})} className={`px-4 py-2 rounded-xl border-2 font-black text-xs ${config.headwear === h ? 'border-accent bg-yellow-50 text-yellow-700' : 'border-gray-100 text-gray-400'}`}>
                                        {h === 'none' ? 'NENHUM' : h === 'cocar' ? 'COCAR' : h === 'turban' ? 'TURBANTE' : 'PALHA'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-gray-600 font-bold mb-3 text-xs">Traje</label>
                        <div className="flex gap-3">
                            <button onClick={() => setConfig({...config, clothing: 'tshirt'})} className={`flex-1 py-3 rounded-2xl border-2 font-black text-xs ${config.clothing === 'tshirt' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400'}`}>CAMISETA</button>
                            <button onClick={() => setConfig({...config, clothing: 'labcoat'})} className={`flex-1 py-3 rounded-2xl border-2 font-black text-xs ${config.clothing === 'labcoat' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400'}`}>JALECO</button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-600 font-bold mb-3 text-xs">Óculos</label>
                        <div className="flex gap-3">
                            <button onClick={() => setConfig({...config, accessory: 'none'})} className={`flex-1 py-3 rounded-2xl border-2 font-black text-xs ${config.accessory === 'none' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400'}`}>SEM</button>
                            <button onClick={() => setConfig({...config, accessory: 'glasses'})} className={`flex-1 py-3 rounded-2xl border-2 font-black text-xs ${config.accessory === 'glasses' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400'}`}>GRAU</button>
                        </div>
                    </div>
                </div>

                <button onClick={handleSave} className="w-full bg-secondary hover:bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl border-b-8 border-green-700 transition-all active:translate-y-1 active:border-b-4 flex items-center justify-center gap-2">
                    <Save size={24} /> SALVAR ALTERAÇÕES
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
