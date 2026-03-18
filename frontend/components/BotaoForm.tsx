import { botaoEstilos, TypeBotaoEstilos } from "@/estilos/botaoEstilos";

type BotaoFormProps = {
  texto: string;
  onClick?: () => void;
  tipo?: TypeBotaoEstilos;
  desabilitado?: boolean;
};

const BotaoForm = (props: BotaoFormProps) => {
  const detectarEstilo = () => {
    if (props.desabilitado === true) {
      return botaoEstilos["desabilitado"];
    }
    if (props.tipo) {
      return botaoEstilos[props.tipo];
    }
    return botaoEstilos["container"];
  };

  return (
    <button
      onClick={props.onClick}
      className={detectarEstilo()}
      disabled={props.desabilitado}
    >
      {props.texto}
    </button>
  );
};

export default BotaoForm;
