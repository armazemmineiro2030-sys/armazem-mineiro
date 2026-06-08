"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginEquipePage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setErro("");
    setCarregando(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setCarregando(false);
    if (res?.error) {
      setErro("E-mail ou senha incorretos");
    } else {
      router.push("/equipe");
    }
  }

  return (
    <div className="min-h-screen bg-marrom-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏺</div>
          <h1 className="text-2xl font-bold text-marrom-900">Área da Equipe</h1>
          <p className="text-marrom-500 text-sm mt-1">Armazém Mineiro</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="equipe@armazemmineiro.com"
              className="input-field"
              onKeyDown={(e) => e.key === "Enter" && entrar()}
            />
          </div>
          <div>
            <label className="label">Senha</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="input-field"
              onKeyDown={(e) => e.key === "Enter" && entrar()}
            />
          </div>

          {erro && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl text-center">
              {erro}
            </p>
          )}

          <button
            onClick={entrar}
            disabled={carregando}
            className="btn-primary w-full"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
