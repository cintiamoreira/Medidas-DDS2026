import type { InputHTMLAttributes } from "react";

type InputTabelaProps = InputHTMLAttributes<HTMLInputElement> & {
  titulo: string;
};

const inputBase =
  "h-10 min-w-0 flex-1 max-w-xs rounded-lg border px-3 transition-colors";

const inputDesabilitado =
  "border-zinc-200 bg-zinc-100 text-zinc-500 cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-400";

const inputHabilitado =
  "border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 focus:dark:border-zinc-500 focus:dark:ring-zinc-500";

const InputTabela = (props: InputTabelaProps) => {
  const { titulo, className, disabled, ...inputProps } = props;
  const estilosInput = disabled ? inputDesabilitado : inputHabilitado;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 py-2 last:border-0 dark:border-zinc-800">
      <label className="shrink-0 text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {titulo}
      </label>
      <input
        {...inputProps}
        disabled={disabled}
        className={className ?? `${inputBase} ${estilosInput}`}
      />
    </div>
  );
};

export default InputTabela;
