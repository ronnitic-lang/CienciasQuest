
import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ config, size = 100, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      className={`rounded-full bg-blue-100 border-4 border-white shadow-lg ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* LAYER 0: Back Hair (Volume atrás da cabeça) */}
      {config.hairStyle === 'long' && (
         <path d="M40,90 L40,165 Q100,195 160,165 L160,90 Z" fill={config.hairColor} />
      )}
      {config.hairStyle === 'puffs' && (
         <g>
            <circle cx="45" cy="70" r="30" fill={config.hairColor} />
            <circle cx="155" cy="70" r="30" fill={config.hairColor} />
         </g>
      )}

      {/* LAYER 1: Body */}
      <g transform="translate(50, 140)">
        <path 
          d="M0,60 Q0,0 50,0 T100,60 V100 H0 Z" 
          fill={config.clothing === 'labcoat' ? '#FFFFFF' : '#4A90E2'} 
          stroke="#000" 
          strokeWidth="1"
        />
        {config.clothing === 'labcoat' && (
          <path d="M50,0 L50,60" stroke="#E0E0E0" strokeWidth="1" />
        )}
      </g>

      {/* LAYER 2: Head Base */}
      <circle cx="100" cy="90" r="50" fill={config.skinColor} />

      {/* LAYER 3: Facial Hair */}
      {config.facialHair === 'beard' && (
        <path d="M60,110 Q100,150 140,110 L140,125 Q100,165 60,125 Z" fill={config.hairColor} opacity="0.9" />
      )}
      {config.facialHair === 'mustache' && (
        <path d="M80,110 Q90,105 100,110 Q110,105 120,110 L120,115 Q100,110 80,115 Z" fill={config.hairColor} />
      )}

      {/* LAYER 4: Hair Main / Frontal (Correção do visual careca) */}
      {(config.hairStyle === 'short' || config.hairStyle === 'long' || config.hairStyle === 'puffs') && (
        <path d="M50,90 Q50,30 100,30 T150,90 Q150,105 135,95 Q100,50 65,95 Q50,105 50,90 Z" fill={config.hairColor} />
      )}
      
      {config.hairStyle === 'fade' && (
        <path d="M55,70 Q100,35 145,70 L145,85 Q100,75 55,85 Z" fill={config.hairColor} />
      )}
      
      {config.hairStyle === 'bob' && (
         <g>
            <path d="M40,85 L35,135 Q35,155 70,140 L70,85 Z" fill={config.hairColor} />
            <path d="M160,85 L165,135 Q165,155 130,140 L130,85 Z" fill={config.hairColor} />
            <path d="M50,90 Q50,30 100,30 T150,90 Q150,105 135,95 Q100,50 65,95 Q50,105 50,90 Z" fill={config.hairColor} />
         </g>
      )}

      {/* LAYER 5: Face Features */}
      <circle cx="80" cy="95" r="4" fill="#000" />
      <circle cx="120" cy="95" r="4" fill="#000" />
      <path d="M85,115 Q100,125 115,115" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />

      {/* LAYER 6: Headwear */}
      {config.headwear === 'turban' && (
        <path d="M50,65 Q100,5 150,65 L140,85 Q100,75 60,85 Z" fill="#E6E6E6" stroke="#CCC" />
      )}
      {config.headwear === 'cocar' && (
        <g transform="translate(50, 20)">
            {[0, 20, 40, 60, 80, 100].map(x => (
                <path key={x} d={`M${x},30 L${x-5},0 L${x+5},0 Z`} fill="#FFD700" stroke="#DAA520" />
            ))}
            <rect x="0" y="30" width="100" height="15" fill="#8B4513" rx="5" />
        </g>
      )}
      {config.headwear === 'strawHat' && (
        <g>
            <ellipse cx="100" cy="55" rx="75" ry="25" fill="#DEB887" stroke="#A0522D" />
            <path d="M75,55 Q75,25 100,25 T125,55" fill="#DEB887" stroke="#A0522D" />
        </g>
      )}

      {/* LAYER 7: Accessories */}
      {config.accessory === 'glasses' && (
        <g stroke="#333" strokeWidth="2" fill="none">
          <circle cx="80" cy="95" r="12" />
          <circle cx="120" cy="95" r="12" />
          <line x1="92" y1="95" x2="108" y2="95" />
        </g>
      )}
    </svg>
  );
};

export default Avatar;
