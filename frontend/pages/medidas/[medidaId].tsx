import { formatarCreatedAt } from "@/helpers/firebaseHelper";
import { getMedidaPorId, TypeMedida } from "@/requests/medidas";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CAMPOS: {
  key: keyof TypeMedida;
  label: string;
  format?: (v: unknown) => string;
}[] = [
  { key: "id", label: "ID" },
  { key: "createdAt", label: "Data de criação", format: formatarCreatedAt },
  { key: "idade", label: "Idade" },
  { key: "peso", label: "Peso (kg)" },
  { key: "altura", label: "Altura" },
  { key: "medidaBracoEsquerdo", label: "Braço esquerdo" },
  { key: "medidaBracoDireito", label: "Braço direito" },
  { key: "medidaCoxaEsquerda", label: "Coxa esquerda" },
  { key: "medidaCoxaDireita", label: "Coxa direita" },
  { key: "medidaPanturrilhaEsquerda", label: "Panturrilha esquerda" },
  { key: "medidaPanturrilhaDireita", label: "Panturrilha direita" },
  { key: "medidaTorax", label: "Tórax" },
  { key: "medidaQuadril", label: "Quadril" },
];

export default function MedidaDetalhe() {
  const router = useRouter();
  const { medidaId } = router.query;

  const [medida, setMedida] = useState<TypeMedida | null>(null);

  useEffect(() => {
    if (typeof medidaId !== "string") return;
    getMedidaPorId(medidaId).then((dados) => setMedida(dados));
  }, [medidaId]);

  if (router.isFallback) {
    return (
      <p className="p-8 text-zinc-600 dark:text-zinc-400">Carregando...</p>
    );
  }

  if (!medida) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 p-8 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 p-8 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-white">
          Detalhes da medida
        </h1>
        <dl className="flex flex-col gap-3">
          {CAMPOS.map(({ key, label, format }) => {
            const value = medida[key];
            const display =
              format && value != null
                ? format(value)
                : value != null && value !== ""
                  ? String(value)
                  : "—";
            return (
              <div
                key={key}
                className="flex flex-wrap justify-between gap-2 border-b border-zinc-100 py-2 last:border-0 dark:border-zinc-800"
              >
                <dt className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {label}
                </dt>
                <dd className="text-zinc-900 dark:text-white">{display}</dd>
              </div>
            );
          })}
        </dl>
      </main>
    </div>
  );
}
