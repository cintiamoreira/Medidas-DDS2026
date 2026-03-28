import type { ReactNode } from "react";

export type TomBotaoMenu = "neutro" | "primario" | "danger";

const classesTom: Record<TomBotaoMenu, string> = {
  neutro:
    "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700",
  primario:
    "text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/60",
  danger:
    "text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/60",
};

type BotaoItemMenuDropdownProps = {
  label: string;
  onClickCallback: () => void;
  aoFecharMenu: () => void;
  tom?: TomBotaoMenu;
  icone?: ReactNode;
};

export default function BotaoItemMenuDropdown({
  label,
  onClickCallback,
  aoFecharMenu,
  tom = "neutro",
  icone,
}: BotaoItemMenuDropdownProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onClickCallback();
        aoFecharMenu();
      }}
      className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${classesTom[tom]}`}
    >
      {icone != null ? (
        <span className="inline-flex shrink-0 [&_svg]:size-4">{icone}</span>
      ) : null}
      {label}
    </button>
  );
}
