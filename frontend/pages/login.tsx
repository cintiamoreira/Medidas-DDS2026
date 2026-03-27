import BotaoForm from "@/components/BotaoForm";
import BotaoNavegacao from "../components/BotaoNavegacao";
import InputForm from "@/components/InputForm";
import type { TypeFormLogin } from "@/queries/usuarios/types";
import { usePostUsuarioLogin } from "@/queries/usuarios/query";
import { temSessaoCookie } from "@/helpers/usuariosHelper";
import { useRouter } from "next/router";
import { type FormEvent, useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const loginMutation = usePostUsuarioLogin();

  useEffect(() => {
    let ativo = true;
    void (async () => {
      if (await temSessaoCookie()) {
        if (ativo) await router.replace("/medidas");
      }
    })();
    return () => {
      ativo = false;
    };
  }, [router]);

  const submeterFormulario = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formData = new FormData(evento.currentTarget);
    const dadosLogin = Object.fromEntries(formData) as unknown as TypeFormLogin;
    loginMutation.mutate(dadosLogin, {
      onSuccess: async () => {
        await router.replace("/medidas");
      },
      onError: () => {
        alert("Erro ao logar!");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <form
          className="flex w-full max-w-sm flex-col items-center gap-4"
          onSubmit={submeterFormulario}
        >
          <InputForm name="email" titulo="Email" type="email" required />
          <InputForm name="senha" titulo="Senha" type="password" required />
          <BotaoForm
            texto={loginMutation.isPending ? "Entrando…" : "Login"}
            desabilitado={loginMutation.isPending}
          />
          <BotaoNavegacao
            tipo="borda"
            texto="Criar conta"
            href="/criar-conta"
          />
        </form>
      </main>
    </div>
  );
}
