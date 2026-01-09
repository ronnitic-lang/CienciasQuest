// pages/teste.js
"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";

export default function Teste() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Carregando...</p>;
  if (user) return <h1>Bem-vindo, {user.email}!</h1>;
  return <h1>Você não está logado.</h1>;
}