import BotaoForm from "@/components/BotaoForm";
import InputForm from "@/components/InputForm";
import { postCriarConta, TypeFormCriarConta } from "@/requests/usuarios";
import { useRouter } from "next/router";
import { SubmitEvent, useState } from "react";

export default function CriarConta() {
  const router = useRouter();
  const [mensagemErro, setMensagemErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const submeterFormulario = async (evento: SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formData = new FormData(evento.currentTarget);
    const dados = Object.fromEntries(formData) as unknown as TypeFormCriarConta;
    if (dados.senha !== dados.confirmarSenha) {
      setMensagemErro("ERRO: As senhas não coincidem.");
    } else {
      setMensagemErro("");
      setCarregando(true);
      await postCriarConta(
        dados,
        () => {
          setCarregando(false);
          router.replace("/login");
          alert("Conta criada com sucesso! Por favor, faça login!");
        },
        () => {
          setCarregando(false);
          alert("Ocorreu um erro");
        },
      );
    }
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
          <p className="font-bold text-red-600">{mensagemErro}</p>
          {carregando === true && <p>Carregando...</p>}
          <BotaoForm texto="Criar conta" desabilitado={carregando} />
        </form>
      </main>
    </div>
  );
}
