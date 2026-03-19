import BotaoTabela from "@/components/BotaoTabela";
import DropdownTabela from "@/components/DropdownTabela";
import InputTabela from "@/components/InputTabela";
import { formatarCreatedAt } from "@/helpers/firebaseHelper";
import {
  getMedidaPorId,
  putMedidaAtualizar,
  TypeMedida,
  TypePostFormMedida,
} from "@/requests/medidas";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CAMPOS: {
  key: keyof TypeMedida;
  label: string;
  type: "text" | "number";
  format?: (v: unknown) => string;
}[] = [
  { key: "id", label: "ID", type: "text" },
  {
    key: "createdAt",
    label: "Data de criação",
    type: "text",
    format: formatarCreatedAt,
  },
  { key: "idade", label: "Idade", type: "number" },
  { key: "peso", label: "Peso (kg)", type: "number" },
  { key: "altura", label: "Altura", type: "number" },
  { key: "medidaBracoEsquerdo", label: "Braço esquerdo", type: "number" },
  { key: "medidaBracoDireito", label: "Braço direito", type: "number" },
  { key: "medidaCoxaEsquerda", label: "Coxa esquerda", type: "number" },
  { key: "medidaCoxaDireita", label: "Coxa direita", type: "number" },
  {
    key: "medidaPanturrilhaEsquerda",
    label: "Panturrilha esquerda",
    type: "number",
  },
  {
    key: "medidaPanturrilhaDireita",
    label: "Panturrilha direita",
    type: "number",
  },
  { key: "medidaTorax", label: "Tórax", type: "number" },
  { key: "medidaQuadril", label: "Quadril", type: "number" },
];

export default function MedidaDetalhe() {
  const router = useRouter();
  const { medidaId } = router.query;

  const [medida, setMedida] = useState<TypeMedida | null>(null);
  const [editando, setEditando] = useState(false);
  const [formValues, setFormValues] = useState<TypeMedida | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (typeof medidaId !== "string") return;
    getMedidaPorId(medidaId).then((dados) => {
      setMedida(dados);
      setFormValues(dados);
    });
  }, [medidaId]);

  const dropdownItens = [
    { label: "Editar", onClick: () => setEditando(true) },
    { label: "Deletar", onClick: () => {} }, // TODO: confirmar e deletar
  ];

  const sempreSomenteLeitura = (key: keyof TypeMedida) =>
    key === "id" || key === "createdAt";

  const handleSalvar = async () => {
    if (typeof medidaId !== "string" || !formValues) return;
    const dados: TypePostFormMedida = {
      idade: formValues.idade,
      peso: formValues.peso,
      altura: formValues.altura,
      medidaBracoEsquerdo: formValues.medidaBracoEsquerdo,
      medidaBracoDireito: formValues.medidaBracoDireito,
      medidaCoxaEsquerda: formValues.medidaCoxaEsquerda,
      medidaCoxaDireita: formValues.medidaCoxaDireita,
      medidaPanturrilhaEsquerda: formValues.medidaPanturrilhaEsquerda,
      medidaPanturrilhaDireita: formValues.medidaPanturrilhaDireita,
      medidaTorax: formValues.medidaTorax,
      medidaQuadril: formValues.medidaQuadril,
    };
    setSalvando(true);
    try {
      await putMedidaAtualizar(medidaId, dados);
      const dadosAtualizados = await getMedidaPorId(medidaId);
      setMedida(dadosAtualizados);
      setFormValues(dadosAtualizados);
      setEditando(false);
    } catch {
      alert("Erro ao salvar medida.");
    } finally {
      setSalvando(false);
    }
  };

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
        <div className="mb-6 flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Detalhes da medida
          </h1>
          <DropdownTabela itens={dropdownItens} />
        </div>
        <div className="flex flex-col">
          {CAMPOS.map(({ key, label, type, format }) => {
            const somenteLeitura = sempreSomenteLeitura(key);
            const desabilitado = somenteLeitura || !editando;
            const valorFonte = formValues ?? medida;
            const value = valorFonte[key];
            const display =
              format && value != null
                ? format(value)
                : value != null && value !== ""
                  ? String(value)
                  : "";
            return (
              <InputTabela
                key={key}
                name={key}
                titulo={label}
                type={type}
                value={display}
                disabled={desabilitado}
                readOnly={desabilitado}
                onChange={
                  editando && !somenteLeitura
                    ? (e) => {
                        const v = e.target.value;
                        setFormValues((prev) =>
                          prev
                            ? {
                                ...prev,
                                [key]:
                                  type === "number"
                                    ? ((parseFloat(
                                        v,
                                      ) as TypeMedida[keyof TypeMedida]) ??
                                      prev[key])
                                    : v,
                              }
                            : null,
                        );
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
        {editando && (
          <div className="mt-6 flex flex-wrap gap-3">
            <BotaoTabela
              texto={salvando ? "Salvando..." : "Salvar"}
              tipo="contained"
              onClick={handleSalvar}
            />
            <BotaoTabela
              texto="Cancelar"
              tipo="border"
              onClick={() => {
                setEditando(false);
                setFormValues(medida);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
