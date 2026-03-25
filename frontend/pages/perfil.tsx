import BotaoForm from "@/components/BotaoForm";
import BotaoNavegacao from "@/components/BotaoNavegacao";
import InputForm from "@/components/InputForm";
import {
  getUserIdDaSessao,
  getUsuariosInformacoes,
  putUsuarioAtualizar,
} from "@/requests/usuarios";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

export default function Perfil() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [dadosProntos, setDadosProntos] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    void (async () => {
      setErro("");
      const uid = await getUserIdDaSessao();
      if (!uid) {
        if (ativo) await router.replace("/login");
        return;
      }
      if (ativo) setUserId(uid);
      try {
        const info = await getUsuariosInformacoes(uid);
        if (!ativo) return;
        setNome(info.nome ?? "");
        setDadosProntos(true);
      } catch {
        if (ativo) setErro("Não foi possível carregar o perfil.");
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [router]);

  const submeterFormulario = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!userId || nome.trim() === "") {
      setErro("Informe um nome válido.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      await putUsuarioAtualizar({ id: userId, nome: nome.trim() });
    } catch {
      setErro("Não foi possível salvar o nome.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <form
          className="flex w-full max-w-sm flex-col items-center gap-4"
          onSubmit={submeterFormulario}
        >
          <h1 className="w-full text-center text-xl font-semibold text-zinc-900 dark:text-white">
            Perfil
          </h1>
          {carregando && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Carregando...
            </p>
          )}
          {erro !== "" && (
            <p className="text-center font-bold text-red-600">{erro}</p>
          )}
          {!carregando && dadosProntos && (
            <>
              <InputForm
                titulo="Nome"
                name="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <BotaoForm
                texto="Salvar"
                desabilitado={salvando || nome.trim() === ""}
              />
            </>
          )}
          <BotaoNavegacao
            tipo="borda"
            texto="Voltar às medidas"
            href="/medidas"
          />
        </form>
      </main>
    </div>
  );
}
