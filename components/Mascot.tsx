
import React from 'react';

interface MascotProps {
  size?: number;
  className?: string;
}

/**
 * Mascote Oficial do CienciasQuest
 * Exibe a Coruja Cientista utilizando um ícone de alta disponibilidade.
 */
const Mascot: React.FC<MascotProps> = ({ size = 150, className = "" }) => {
  // URL estável para o mascote (Ícone de Coruja Cientista Azul)
  const mascotSource = "https://img.icons8.com/clouds/200/owl.png";

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={mascotSource} 
        alt="Mascote CienciasQuest" 
        className="w-full h-full object-contain z-10"
        onLoad={() => console.log("Mascote carregado")}
      />
      {/* Sombra suave fixa */}
      <div 
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/5 rounded-full blur-md"
        style={{ width: size * 0.6, height: size * 0.08 }}
      ></div>
    </div>
  );
};

export default Mascot;
