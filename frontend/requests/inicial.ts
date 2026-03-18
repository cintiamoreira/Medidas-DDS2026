export const getRotaInicial = async () => {
  //logica HTTP para pegar a rota inicial usando o FETCH -> /
  const resposta = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/");
  console.log({ resposta });
  const dado = await resposta.text();
  console.log({ dado });
};

export const getHealth = async () => {
  const resposta = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/health");
  const dado = await resposta.json();
  console.log({ dado });
};
