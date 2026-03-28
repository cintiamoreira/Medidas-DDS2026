import BotaoItemMenuDropdown, {
  type TomBotaoMenu,
} from "@/components/BotaoItemMenuDropdown";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type ItemMenuDropdown = {
  label: string;
  onClick: () => void;
  tom?: TomBotaoMenu;
  icone?: ReactNode;
};

type MenuDropdownProps = {
  itens: ItemMenuDropdown[];
  titulo?: string;
};

export default function MenuDropdown({ itens, titulo }: MenuDropdownProps) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fecharAoClicarFora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    };
    if (aberto) document.addEventListener("click", fecharAoClicarFora);
    return () => document.removeEventListener("click", fecharAoClicarFora);
  }, [aberto]);

  const botaoDisparo = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setAberto((v) => !v);
      }}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
      aria-expanded={aberto}
      aria-haspopup="menu"
      aria-label="Abrir menu"
    >
      <span className="text-lg leading-none">⋮</span>
    </button>
  );

  const painelMenu = aberto && (
    <div
      className="absolute right-0 top-full z-20 mt-1 min-w-[180px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-600 dark:bg-zinc-800"
      role="menu"
    >
      {itens.map((item, index) => (
        <BotaoItemMenuDropdown
          key={`${item.label}-${index}`}
          label={item.label}
          onClickCallback={item.onClick}
          aoFecharMenu={() => setAberto(false)}
          tom={item.tom}
          icone={item.icone}
        />
      ))}
    </div>
  );

  const blocoMenu = (
    <div className="relative" ref={ref}>
      {botaoDisparo}
      {painelMenu}
    </div>
  );

  if (titulo != null && titulo !== "") {
    return (
      <header className="relative flex h-14 shrink-0 items-center border-b border-zinc-200 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="flex flex-1 justify-end">{blocoMenu}</div>
        <h1 className="pointer-events-none absolute left-1/2 top-1/2 max-w-[min(100%,20rem)] -translate-x-1/2 -translate-y-1/2 text-center text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
          {titulo}
        </h1>
      </header>
    );
  }

  return <div className="relative shrink-0">{blocoMenu}</div>;
}
