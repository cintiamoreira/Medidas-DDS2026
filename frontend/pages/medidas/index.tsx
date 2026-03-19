import { useEffect, useState } from "react";
import BotaoNavegacao from "../../components/BotaoNavegacao";
import { getMedidas, TypeMedida } from "@/requests/medidas";
import MedidaListaItem from "@/components/MedidaListaItem";
import { useRouter } from "next/router";

export default function Medidas() {
  const router = useRouter();
  const [medidas, setMedidas] = useState<TypeMedida[]>([]);
  useEffect(() => {
    getMedidas().then((dados) => {
      setMedidas(dados);
    });
  }, []);
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col mx-auto px-16 bg-white dark:bg-black">
        <header className="flex flex-col items-center gap-4 pt-8 pb-4">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Medidas
          </h1>
          <BotaoNavegacao
            tipo="borda"
            texto="Registrar medida"
            href="/registrar-medida"
          />
        </header>
        <div className="flex flex-col gap-4">
          {medidas.map((medida) => (
            <MedidaListaItem
              key={medida.idade}
              medida={medida}
              onClick={(medidaClicada) =>
                router.push(`/medidas/${medidaClicada.id}`)
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
