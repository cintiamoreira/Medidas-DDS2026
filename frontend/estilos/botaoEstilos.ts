export const botaoEstilos = {
  container:
    "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[200px]",
  texto:
    "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-transparent px-5 text-foreground transition-colors hover:bg-foreground/10 dark:hover:bg-foreground/10 md:w-[200px]",
  borda:
    "flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-foreground bg-transparent px-5 text-foreground transition-colors hover:bg-foreground/10 dark:hover:bg-foreground/10 md:w-[200px]",
  desabilitado:
    "flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-foreground/40 px-5 text-background opacity-60 transition-colors md:w-[200px] pointer-events-none",
} as const;

export type TypeBotaoEstilos = keyof typeof botaoEstilos;
