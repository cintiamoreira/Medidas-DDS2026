import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  titulo: string;
};

const InputForm = (props: InputProps) => {
  return (
    <div>
      <p>{props.titulo}</p>
      <input
        {...props}
        className="flex h-12 w-full items-center rounded-full border border-foreground/20 bg-background px-5 text-foreground placeholder:text-foreground/50 transition-colors focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 md:w-full"
      />
    </div>
  );
};

export default InputForm;
