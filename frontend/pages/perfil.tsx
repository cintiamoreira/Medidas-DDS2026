import BotaoTabela from "@/components/BotaoTabela";
import MenuDropdown from "@/components/MenuDropdown";
import InputTabela from "@/components/InputTabela";
import {
  useDeleteUsuarioRemover,
  usePutUsuarioAtualizar,
} from "@/features/usuarios/query";
import {
  getUserIdDaSessao,
  getUsuariosInformacoes,
  limparSessaoCookies,
} from "@/requests/usuarios";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type FormPerfil = {
  nome: string;
  email: string | null;
};

export default function Perfil() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<FormPerfil | null>(null);
  const [formValues, setFormValues] = useState<FormPerfil | null>(null);
  const [editando, setEditando] = useState(false);
  const atualizarMutation = usePutUsuarioAtualizar();
  const removerMutation = useDeleteUsuarioRemover();
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");

  useEffect(() => {
    let ativo = true;
    void (async () => {
      setErroCarregamento("");
      const uid = await getUserIdDaSessao();
      if (!uid) {
        if (ativo) await router.replace("/login");
        return;
      }
      if (ativo) setUserId(uid);
      try {
        const info = await getUsuariosInformacoes(uid);
        if (!ativo) return;
        const p: FormPerfil = {
          nome: info.nome ?? "",
          email: info.email,
        };
        setPerfil(p);
        setFormValues(p);
      } catch {
        if (ativo) setErroCarregamento("Não foi possível carregar o perfil.");
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [router]);

  const handleDeletar = () => {
    if (!userId || removerMutation.isPending || atualizarMutation.isPending) {
      return;
    }
    const confirma = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
    );
    if (!confirma) return;

    const digitado = window.prompt(
      "Digite seu e-mail para confirmar a exclusão da conta:",
    );
    if (digitado === null) return;

    const esperado =
      (formValues?.email ?? perfil?.email)?.trim().toLowerCase() ?? "";
    if (esperado === "") {
      window.alert("Não foi possível obter o e-mail da conta.");
      return;
    }
    if (digitado.trim().toLowerCase() !== esperado) {
      window.alert("O e-mail digitado não confere com o da conta.");
      return;
    }

    removerMutation.mutate(userId, {
      onSuccess: async () => {
        await limparSessaoCookies();
        await router.replace("/login");
      },
    });
  };

  const handleSalvar = () => {
    if (atualizarMutation.isPending || !userId || !formValues) return;
    if (formValues.nome.trim() === "") {
      window.alert("Informe um nome válido.");
      return;
    }
    atualizarMutation.mutate(
      { id: userId, nome: formValues.nome.trim() },
      {
        onSuccess: async () => {
          try {
            const info = await getUsuariosInformacoes(userId);
            const p: FormPerfil = {
              nome: info.nome ?? "",
              email: info.email,
            };
            setPerfil(p);
            setFormValues(p);
            setEditando(false);
            atualizarMutation.reset();
          } catch {
            window.alert(
              "Nome atualizado, mas não foi possível recarregar o perfil.",
            );
          }
        },
      },
    );
  };

  const dropdownItens = [
    {
      label: "Editar",
      tom: "primario" as const,
      icone: <Pencil aria-hidden />,
      onClick: () => setEditando(true),
    },
    {
      label: "Deletar",
      tom: "danger" as const,
      icone: <Trash2 aria-hidden />,
      onClick: () => void handleDeletar(),
    },
  ];

  if (carregando) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 p-8 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
      </div>
    );
  }

  if (!perfil || !formValues) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 p-8 font-sans dark:bg-black">
        <p className="text-red-600 dark:text-red-400">
          {erroCarregamento || "Não foi possível carregar o perfil."}
        </p>
      </div>
    );
  }

  const emailExibicao = formValues.email ?? "";
  const nomeDesabilitado = !editando;
  const emailSempreDesabilitado = true;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 p-8 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Perfil
          </h1>
          <MenuDropdown itens={dropdownItens} />
        </div>
        {removerMutation.isError ? (
          <p className="mb-4 font-bold text-red-600" role="alert">
            {removerMutation.error.message}
          </p>
        ) : null}
        <div className="flex flex-col">
          <InputTabela
            name="email"
            titulo="E-mail"
            type="email"
            value={emailExibicao}
            disabled={emailSempreDesabilitado}
            readOnly={emailSempreDesabilitado}
          />
          <InputTabela
            name="nome"
            titulo="Nome"
            type="text"
            value={formValues.nome}
            disabled={nomeDesabilitado}
            readOnly={nomeDesabilitado}
            onChange={
              editando
                ? (e) =>
                    setFormValues((prev) =>
                      prev ? { ...prev, nome: e.target.value } : null,
                    )
                : undefined
            }
          />
        </div>
        {editando && (
          <div className="mt-6 flex flex-col gap-3">
            {atualizarMutation.isError ? (
              <p className="font-bold text-red-600" role="alert">
                {atualizarMutation.error.message}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <BotaoTabela
                texto={atualizarMutation.isPending ? "Salvando…" : "Salvar"}
                tipo="contained"
                onClick={() => handleSalvar()}
              />
              <BotaoTabela
                texto="Cancelar"
                tipo="border"
                onClick={() => {
                  atualizarMutation.reset();
                  setEditando(false);
                  setFormValues(perfil);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
