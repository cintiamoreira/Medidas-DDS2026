import BotaoForm from "@/components/BotaoForm";
import BotaoNavegacao from "../components/BotaoNavegacao";
import InputForm from "@/components/InputForm";
import { getHealth } from "@/requests/inicial";
import { useRouter } from "next/router";
import { SubmitEvent } from "react";
import { postLogin, TypeFormLogin } from "@/requests/usuarios";

export default function Login() {
  const router = useRouter();

  const submeterFormulario = (evento: SubmitEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formData = new FormData(evento.currentTarget);
    const dadosLogin = Object.fromEntries(formData) as unknown as TypeFormLogin;
    postLogin(
      dadosLogin,
      () => {
        router.push("/medidas");
      },
      () => {
        alert("Erro ao logar!");
      },
    );
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
          <BotaoForm texto="Login" />
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
