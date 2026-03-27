import BotaoTabela from "@/components/BotaoTabela";
import MenuDropdown from "@/components/MenuDropdown";
import InputTabela from "@/components/InputTabela";
import {
  useDeleteUsuarioRemover,
  usePutUsuarioAtualizar,
  useUsuarioInformacoes,
  usuariosInformacoesQueryKey,
} from "@/features/usuarios/query";
import {
  getUserIdDaSessao,
  limparSessaoCookies,
} from "@/helpers/usuariosHelper";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

type FormPerfil = {
  nome: string;
  email: string | null;
};

export default function Perfil() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [sessaoResolvida, setSessaoResolvida] = useState(false);
  const [editando, setEditando] = useState(false);
  /** Só preenchido enquanto `editando` — cópia editável dos dados da query. */
  const [rascunho, setRascunho] = useState<FormPerfil | null>(null);
  const atualizarMutation = usePutUsuarioAtualizar();
  const removerMutation = useDeleteUsuarioRemover();

  const informacoesQuery = useUsuarioInformacoes(userId);

  const dadosAtuais = useMemo((): FormPerfil | null => {
    if (!informacoesQuery.data) return null;
    return {
      nome: informacoesQuery.data.nome ?? "",
      email: informacoesQuery.data.email,
    };
  }, [informacoesQuery.data]);

  const exibicao = editando && rascunho ? rascunho : dadosAtuais;

  useEffect(() => {
    let ativo = true;
    void (async () => {
      const uid = await getUserIdDaSessao();
      if (!ativo) return;
      if (!uid) {
        await router.replace("/login");
      } else {
        setUserId(uid);
      }
      setSessaoResolvida(true);
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
      (exibicao?.email ?? dadosAtuais?.email)?.trim().toLowerCase() ?? "";
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
    if (atualizarMutation.isPending || !userId || !rascunho) return;
    if (rascunho.nome.trim() === "") {
      window.alert("Informe um nome válido.");
      return;
    }
    atualizarMutation.mutate(
      { id: userId, nome: rascunho.nome.trim() },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: usuariosInformacoesQueryKey(userId),
          });
          setEditando(false);
          setRascunho(null);
          atualizarMutation.reset();
        },
      },
    );
  };

  const dropdownItens = [
    {
      label: "Editar",
      tom: "primario" as const,
      icone: <Pencil aria-hidden />,
      onClick: () => {
        if (!dadosAtuais) return;
        setRascunho({ ...dadosAtuais });
        setEditando(true);
      },
    },
    {
      label: "Deletar",
      tom: "danger" as const,
      icone: <Trash2 aria-hidden />,
      onClick: () => void handleDeletar(),
    },
  ];

  if (!sessaoResolvida) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 p-8 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  if (informacoesQuery.isPending) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 p-8 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
      </div>
    );
  }

  if (informacoesQuery.isError) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 p-8 font-sans dark:bg-black">
        <p className="text-red-600 dark:text-red-400" role="alert">
          {informacoesQuery.error.message}
        </p>
      </div>
    );
  }

  if (!exibicao) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 p-8 font-sans dark:bg-black">
        <p className="text-red-600 dark:text-red-400">
          Não foi possível carregar o perfil.
        </p>
      </div>
    );
  }

  const emailExibicao = exibicao.email ?? "";
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
            value={exibicao.nome}
            disabled={nomeDesabilitado}
            readOnly={nomeDesabilitado}
            onChange={
              editando
                ? (e) =>
                    setRascunho((prev) =>
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
                  setRascunho(null);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
