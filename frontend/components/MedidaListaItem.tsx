import { TypeMedida } from "@/requests/medidas";
import React from "react";

type MedidaListaItemProps = {
  medida: TypeMedida;
  onClick: (medida: TypeMedida) => void;
};

function recuperarData(dataFirestore: TypeMedida["createdAt"]): Date | null {
  if (!dataFirestore) return null;
  console.log({ dataFirestore });
  const { _seconds, _nanoseconds } = dataFirestore;
  return new Date(_seconds * 1000 + _nanoseconds / 1e6);
}

const MedidaListaItem = (props: MedidaListaItemProps) => {
  const { medida } = props;
  const date = recuperarData(medida.createdAt);
  const dataCriacao = date
    ? date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <article
      onClick={() => props.onClick(medida)}
      className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      <div className="flex flex-col gap-3">
        <p className="text-base font-semibold text-zinc-900 dark:text-white">
          {dataCriacao}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <span>
            <strong className="text-zinc-900 dark:text-white">Peso:</strong>{" "}
            {medida.peso} kg
          </span>
          <span>
            <strong className="text-zinc-900 dark:text-white">Idade:</strong>{" "}
            {medida.idade} anos
          </span>
        </div>
      </div>
    </article>
  );
};

export default MedidaListaItem;
