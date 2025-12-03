import React, { useState } from 'react';
import { AvatarConfig } from '../types';

interface AvatarMakerProps {
  initialConfig?: AvatarConfig;
  onSave: (config: AvatarConfig) => void;
}

const AvatarMaker: React.FC<AvatarMakerProps> = ({ initialConfig, onSave }) => {
  const [config, setConfig] = useState<AvatarConfig>(initialConfig || {
    skinColor: '#f5d0b0',
    hairStyle: 'straight',
    hairColor: '#000000',
    clothing: 'casual',
    accessory: 'none',
    backgroundColor: '#bae6fd'
  });

  const skinColors = ['#f5d0b0', '#e0ac69', '#8d5524', '#523420', '#3c2314'];
  const hairColors = ['#000000', '#4a332a', '#a3623b', '#e6be8a', '#9b1c31'];
  
  // Simple SVG Components for Avatar Parts
  const renderHair = () => {
    const color = config.hairColor;
    switch(config.hairStyle) {
      case 'curly':
        return <path d="M30 40 Q 20 20 50 10 Q 80 20 70 40 Q 85 50 85 70 L 15 70 Q 15 50 30 40" fill={color} />;
      case 'braids':
        return <path d="M20 70 L 20 100 M 80 70 L 80 100 M 20 30 Q 50 0 80 30 L 80 70 L 20 70 Z" fill={color} stroke={color} strokeWidth="10" />;
      case 'indigenous_headdress':
        return (
          <g>
            <path d="M20 40 Q 50 30 80 40" fill="none" stroke={color} strokeWidth="3" />
            <path d="M20 40 L 10 10 L 30 40 M 35 40 L 35 5 L 45 40 M 50 40 L 50 0 L 55 40 M 65 40 L 65 5 L 70 40 M 80 40 L 90 10 L 75 40" fill="none" stroke="#ef4444" strokeWidth="4" />
          </g>
        );
      default: // straight
        return <path d="M25 30 Q 50 0 75 30 L 75 80 L 25 80 Z" fill={color} />;
    }
  };

  const renderClothing = () => {
    switch(config.clothing) {
      case 'lab_coat':
        return <path d="M20 80 L 80 80 L 90 130 L 10 130 Z" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" />;
      case 'traditional':
        return <path d="M20 80 L 80 80 L 90 130 L 10 130 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />;
      default: // casual
        return <path d="M20 80 L 80 80 L 90 130 L 10 130 Z" fill="#3b82f6" />;
    }
  };

  const renderAccessory = () => {
    switch(config.accessory) {
      case 'glasses':
        return (
          <g stroke="#1f2937" strokeWidth="2" fill="none">
             <circle cx="35" cy="55" r="8" />
             <circle cx="65" cy="55" r="8" />
             <line x1="43" y1="55" x2="57" y2="55" />
          </g>
        );
      case 'goggles':
        return (
          <g fill="#93c5fd" opacity="0.6" stroke="#1f2937" strokeWidth="2">
             <rect x="25" y="45" width="22" height="15" rx="5" />
             <rect x="53" y="45" width="22" height="15" rx="5" />
             <line x1="47" y1="52" x2="53" y2="52" stroke="#1f2937" />
          </g>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-700">Crie seu Cientista</h2>
      
      <div className="relative w-48 h-48 rounded-full border-4 border-white shadow-xl overflow-hidden" style={{backgroundColor: config.backgroundColor}}>
        <svg viewBox="0 0 100 130" className="w-full h-full">
           {/* Body */}
           <rect x="25" y="80" width="50" height="50" fill={config.skinColor} />
           {/* Clothing */}
           {renderClothing()}
           {/* Head */}
           <circle cx="50" cy="50" r="30" fill={config.skinColor} />
           {/* Eyes */}
           <circle cx="40" cy="50" r="3" fill="#000" />
           <circle cx="60" cy="50" r="3" fill="#000" />
           {/* Mouth */}
           <path d="M40 65 Q 50 70 60 65" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
           {/* Hair */}
           {renderHair()}
           {/* Accessory */}
           {renderAccessory()}
        </svg>
      </div>

      <div className="w-full space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Tom de Pele</label>
          <div className="flex gap-2 justify-center">
            {skinColors.map(c => (
              <button key={c} onClick={() => setConfig({...config, skinColor: c})} className={`w-8 h-8 rounded-full border-2 ${config.skinColor === c ? 'border-blue-500 scale-110' : 'border-transparent'}`} style={{backgroundColor: c}} />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Cabelo / Adereço</label>
          <div className="flex gap-2 justify-center flex-wrap">
             {['straight', 'curly', 'braids', 'indigenous_headdress'].map(s => (
                <button key={s} onClick={() => setConfig({...config, hairStyle: s})} className={`px-3 py-1 text-xs rounded-full border ${config.hairStyle === s ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                   {s === 'indigenous_headdress' ? 'Cocar/Adereço' : s}
                </button>
             ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Roupa</label>
          <div className="flex gap-2 justify-center">
             {['casual', 'lab_coat', 'traditional'].map(c => (
               <button key={c} onClick={() => setConfig({...config, clothing: c})} className={`px-3 py-1 text-xs rounded-full border ${config.clothing === c ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                 {c === 'lab_coat' ? 'Jaleco' : c === 'traditional' ? 'Tradicional' : 'Casual'}
               </button>
             ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Acessórios</label>
          <div className="flex gap-2 justify-center">
             {['none', 'glasses', 'goggles'].map(a => (
               <button key={a} onClick={() => setConfig({...config, accessory: a})} className={`px-3 py-1 text-xs rounded-full border ${config.accessory === a ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                 {a === 'none' ? 'Nenhum' : a === 'goggles' ? 'Óculos Prot.' : 'Óculos'}
               </button>
             ))}
          </div>
        </div>
      </div>

      <button onClick={() => onSave(config)} className="w-full py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl shadow-b-md transition-all active:translate-y-1">
        Confirmar Avatar
      </button>
    </div>
  );
};

export default AvatarMaker;