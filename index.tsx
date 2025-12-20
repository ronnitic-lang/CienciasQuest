
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("CienciasQuest: Iniciando aplicação...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("CienciasQuest: Erro crítico - Elemento root não encontrado!");
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
