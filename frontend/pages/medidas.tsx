import BotaoNavegacao from "../components/BotaoNavegacao";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <BotaoNavegacao
          tipo="borda"
          texto="Registrar medida"
          href="/registrar-medida"
        />
      </main>
    </div>
  );
}
