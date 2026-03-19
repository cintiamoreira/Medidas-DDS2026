type BotaoTabelaProps = {
  texto: string;
  onClick: () => void;
  tipo?: "contained" | "border";
};

const estilos = {
  contained:
    "flex h-10 w-[120px] items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]",
  border:
    "flex h-10 w-[120px] items-center justify-center rounded-full border-2 border-foreground bg-transparent text-foreground transition-colors hover:bg-foreground/10 dark:hover:bg-foreground/10",
} as const;

const BotaoTabela = (props: BotaoTabelaProps) => {
  const { texto, onClick, tipo = "contained" } = props;
  const estilo = estilos[tipo];
  return (
    <button type="button" onClick={onClick} className={estilo}>
      {texto}
    </button>
  );
};

export default BotaoTabela;
