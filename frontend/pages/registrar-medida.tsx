import BotaoForm from "@/components/BotaoForm";

import InputForm from "@/components/InputForm";
import { usePostMedidaCriar } from "@/queries/medida/query";
import type { TypePostFormMedida } from "@/requests/medidas";
import { useRouter } from "next/router";
import { type FormEvent } from "react";

export default function Login() {
  const router = useRouter();
  const criarMedidaMutation = usePostMedidaCriar();

  const submeterFormulario = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formData = new FormData(evento.currentTarget);
    const dados = Object.fromEntries(formData) as unknown as TypePostFormMedida;

    criarMedidaMutation.mutate(dados, {
      onSuccess: (resposta) => {
        alert(resposta.message);
        void router.back();
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
          <InputForm
            name="idade"
            titulo="Idade"
            type="number"
            required={false}
          />
          <InputForm name="peso" titulo="Peso" type="number" required={false} />
          <InputForm
            name="altura"
            titulo="Altura"
            type="number"
            required={false}
          />
          <InputForm
            name="medidaBracoEsquerdo"
            titulo="Medida do Braco Esquerdo"
            type="number"
            required={false}
          />
          <InputForm
            name="medidaBracoDireito"
            titulo="Medida do Braco Direito"
            type="number"
            required={false}
          />
          <InputForm
            name="medidaCoxaEsquerda"
            titulo="Medida da Coxa Esquerda"
            type="number"
            required={false}
          />
          <InputForm
            name="medidaCoxaDireita"
            titulo="Medida da Coxa Direita"
            type="number"
            required={false}
          />
          <InputForm
            name="medidaPanturrilhaEsquerda"
            titulo="Medida da Panturrilha Esquerda"
            type="number"
            required={false}
          />
          <InputForm
            name="medidaPanturrilhaDireita"
            titulo="Medida da Panturrilha Direita"
            type="number"
            required={false}
          />
          <InputForm
            name="medidaTorax"
            titulo="Medida do Torax"
            type="number"
            required={false}
          />
          <InputForm
            name="medidaQuadril"
            titulo="Medida do Quadril"
            type="number"
            required={false}
          />

          {criarMedidaMutation.isError ? (
            <p className="text-sm font-medium text-red-600" role="alert">
              {criarMedidaMutation.error.message}
            </p>
          ) : null}
          <BotaoForm
            texto={
              criarMedidaMutation.isPending
                ? "Registrando…"
                : "Registrar medida"
            }
            desabilitado={criarMedidaMutation.isPending}
          />
        </form>
      </main>
    </div>
  );
}
