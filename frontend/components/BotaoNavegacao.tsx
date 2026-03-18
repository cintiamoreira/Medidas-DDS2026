import { botaoEstilos, TypeBotaoEstilos } from "@/estilos/botaoEstilos";
import Link from "next/link";

type BotaoNavegacaoProps = {
  texto: string;
  href: string;
  tipo?: TypeBotaoEstilos;
};

const BotaoNavegacao = (props: BotaoNavegacaoProps) => {
  //props.tipo = container

  return (
    <Link href={props.href} className={botaoEstilos[props.tipo || "borda"]}>
      {props.texto}
    </Link>
  );
};

export default BotaoNavegacao;
