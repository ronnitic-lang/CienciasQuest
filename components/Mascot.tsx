
import React, { useState, useEffect } from 'react';
import { generateMascotImage } from '../services/geminiService';
import { RefreshCw } from 'lucide-react';

interface MascotProps {
  size?: number;
  className?: string;
}

const Mascot: React.FC<MascotProps> = ({ size = 150, className = "" }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMascot = async () => {
      // Tenta recuperar do cache para não gerar toda vez
      const cached = sessionStorage.getItem('cq_mascot_img');
      if (cached) {
        setImageUrl(cached);
        setLoading(false);
        return;
      }

      const url = await generateMascotImage();
      if (url) {
        setImageUrl(url);
        sessionStorage.setItem('cq_mascot_img', url);
      }
      setLoading(false);
    };
    fetchMascot();
  }, []);

  if (loading) {
    return (
      <div style={{ width: size, height: size }} className={`flex items-center justify-center bg-blue-50/50 rounded-full border-2 border-dashed border-blue-200 animate-pulse ${className}`}>
        <RefreshCw className="text-blue-300 animate-spin" size={size/4} />
      </div>
    );
  }

  if (!imageUrl) return null;

  return (
    <div 
      className={`relative group ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={imageUrl} 
        alt="Mascote CienciasQuest" 
        className="w-full h-full object-contain mix-blend-multiply animate-float"
      />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-2 bg-black/5 rounded-full blur-sm"></div>
    </div>
  );
};

export default Mascot;
