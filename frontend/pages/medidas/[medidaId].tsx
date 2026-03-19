import { useRouter } from "next/router";

export default function MedidaDetalhe() {
  const router = useRouter();
  const { medidaId } = router.query;

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 p-8 font-sans dark:bg-black">
      <p className="text-zinc-900 dark:text-white">
        Medida ID: <strong>{medidaId}</strong>
      </p>
    </div>
  );
}
