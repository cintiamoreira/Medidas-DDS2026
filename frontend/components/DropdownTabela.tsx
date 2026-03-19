import { useEffect, useRef, useState } from "react";

export type ItemDropdownTabela = {
  label: string;
  onClick: () => void;
};

type DropdownTabelaProps = {
  itens: ItemDropdownTabela[];
};

const DropdownTabela = (props: DropdownTabelaProps) => {
  const { itens } = props;
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

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setAberto((v) => !v);
        }}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        aria-expanded={aberto}
        aria-haspopup="menu"
      >
        <span className="text-lg leading-none">⋮</span>
      </button>
      {aberto && (
        <div
          className="absolute right-0 top-full z-10 mt-1 min-w-[140px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-600 dark:bg-zinc-800"
          role="menu"
        >
          {itens.map((item, index) => (
            <button
              key={index}
              type="button"
              role="menuitem"
              onClick={() => {
                item.onClick();
                setAberto(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownTabela;
