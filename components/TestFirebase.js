// components/TestFirebase.js
"use client"; // Se for Next.js 13+ com App Router

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function TestFirebase() {
  const [status, setStatus] = useState('Testando...');
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function testFirebase() {
      try {
        // Testar Firestore
        await setDoc(doc(db, 'test', 'connection'), {
          test: true,
          timestamp: new Date()
        });
        
        const docSnap = await getDoc(doc(db, 'test', 'connection'));
        if (docSnap.exists()) {
          setStatus(prev => prev + ' ✅ Firestore OK');
        }

        // Testar Auth
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user.email);
            setStatus(prev => prev + ' ✅ Auth OK');
          } else {
            setStatus(prev => prev + ' ✅ Auth configurado (sem login)');
          }
        });

        return unsubscribe;
      } catch (error) {
        setStatus(`❌ Erro: ${error.message}`);
      }
    }

    testFirebase();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0' }}>
      <h3>Teste Firebase</h3>
      <p>{status}</p>
      {user && <p>Usuário: {user}</p>}
    </div>
  );
}