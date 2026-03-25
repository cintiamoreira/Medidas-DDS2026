import BotaoTabela from "@/components/BotaoTabela";
import MenuDropdown from "@/components/MenuDropdown";
import InputTabela from "@/components/InputTabela";
import {
  deleteUsuarioRemover,
  getUserIdDaSessao,
  getUsuariosInformacoes,
  limparSessaoCookies,
  putUsuarioAtualizar,
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
  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);
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

  const handleDeletar = async () => {
    if (!userId || deletando || salvando) return;
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

    setDeletando(true);
    try {
      await deleteUsuarioRemover(userId);
      await limparSessaoCookies();
      await router.replace("/login");
    } catch {
      window.alert("Não foi possível excluir a conta.");
    } finally {
      setDeletando(false);
    }
  };

  const handleSalvar = async () => {
    if (salvando || !userId || !formValues) return;
    if (formValues.nome.trim() === "") {
      window.alert("Informe um nome válido.");
      return;
    }
    setSalvando(true);
    try {
      await putUsuarioAtualizar({ id: userId, nome: formValues.nome.trim() });
      const info = await getUsuariosInformacoes(userId);
      const p: FormPerfil = {
        nome: info.nome ?? "",
        email: info.email,
      };
      setPerfil(p);
      setFormValues(p);
      setEditando(false);
    } catch {
      window.alert("Erro ao salvar perfil.");
    } finally {
      setSalvando(false);
    }
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
          <div className="mt-6 flex flex-wrap gap-3">
            <BotaoTabela
              texto={salvando ? "Salvando..." : "Salvar"}
              tipo="contained"
              onClick={() => void handleSalvar()}
            />
            <BotaoTabela
              texto="Cancelar"
              tipo="border"
              onClick={() => {
                setEditando(false);
                setFormValues(perfil);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
