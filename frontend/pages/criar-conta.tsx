import BotaoForm from "@/components/BotaoForm";
import InputForm from "@/components/InputForm";
import type { TypeFormCriarConta } from "@/queries/usuarios/types";
import { usePostUsuarioCriarConta } from "@/queries/usuarios/query";
import { temSessaoCookie } from "@/helpers/usuariosHelper";
import { useRouter } from "next/router";
import { type FormEvent, useEffect } from "react";

export default function CriarConta() {
  const router = useRouter();
  const criarContaMutation = usePostUsuarioCriarConta();

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
    const dados = Object.fromEntries(formData) as unknown as TypeFormCriarConta;
    criarContaMutation.mutate(dados, {
      onSuccess: (resposta) => {
        void router.replace("/login");
        alert(resposta.message);
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
          <InputForm titulo="Nome" name="nome" type="text" required />
          <InputForm titulo="Email" name="email" type="email" required />
          <InputForm titulo="Senha" name="senha" type="password" required />
          <InputForm
            titulo="Confirmar senha"
            name="confirmarSenha"
            type="password"
            required
          />
          {criarContaMutation.isError ? (
            <p className="font-bold text-red-600" role="alert">
              {criarContaMutation.error.message}
            </p>
          ) : null}
          <BotaoForm
            texto={
              criarContaMutation.isPending ? "Criando conta…" : "Criar conta"
            }
            desabilitado={criarContaMutation.isPending}
          />
        </form>
      </main>
    </div>
  );
}
