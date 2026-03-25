import MenuSuperiorDropdown from "@/components/MenuSuperiorDropdown";
import MedidaListaItem from "@/components/MedidaListaItem";
import { getMedidas, TypePostFormMedida } from "@/requests/medidas";
import { LogOut, PlusCircle, User } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Medidas() {
  const router = useRouter();
  const [medidas, setMedidas] = useState<TypePostFormMedida[]>([]);
  useEffect(() => {
    getMedidas().then((dados) => {
      setMedidas(dados);
    });
  }, []);
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <MenuSuperiorDropdown
        titulo="Suas medidas"
        itensDropdown={[
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
              /* logout — a implementar */
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
