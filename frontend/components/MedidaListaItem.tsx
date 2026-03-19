import { formatarCreatedAt } from "@/helpers/firebaseHelper";
import { TypeMedidaLista } from "@/requests/medidas";
import React from "react";

type MedidaListaItemProps = {
  medida: TypeMedidaLista;
  onClick: (medida: TypeMedidaLista) => void;
};

const MedidaListaItem = (props: MedidaListaItemProps) => {
  const { medida } = props;
  const dataCriacao = formatarCreatedAt(medida.createdAt);

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
