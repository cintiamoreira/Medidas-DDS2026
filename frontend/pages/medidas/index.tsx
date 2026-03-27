import MenuDropdown from "@/components/MenuDropdown";
import MedidaListaItem from "@/components/MedidaListaItem";
import { getMedidas, TypePostFormMedida } from "@/requests/medidas";
import { limparSessaoCookies, temSessaoCookie } from "@/helpers/usuariosHelper";
import { LogOut, PlusCircle, User } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Medidas() {
  const router = useRouter();
  const [medidas, setMedidas] = useState<TypePostFormMedida[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    void (async () => {
      if (!(await temSessaoCookie())) {
        if (ativo) await router.replace("/login");
        if (ativo) setCarregando(false);
        return;
      }
      const dados = await getMedidas();
      if (ativo) {
        setMedidas(dados);
        setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [router]);

  if (carregando) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 p-8 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <MenuDropdown
        titulo="Suas medidas"
        itens={[
          {
            label: "Ver perfil",
            icone: <User aria-hidden />,
            onClick: () => {
              router.push("/perfil");
            },
          },
          {
            label: "Registrar medida",
            tom: "primario",
            icone: <PlusCircle aria-hidden />,
            onClick: () => {
              router.push("/registrar-medida");
            },
          },
          {
            label: "Sair",
            tom: "danger",
            icone: <LogOut aria-hidden />,
            onClick: () => {
              void (async () => {
                const ok = window.confirm("Deseja realmente sair?");
                if (!ok) return;
                await limparSessaoCookies();
                await router.replace("/login");
              })();
            },
          },
        ]}
      />
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col bg-white px-16 pb-8 pt-6 dark:bg-black">
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
