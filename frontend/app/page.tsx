"use client";

import { temSessaoCookie } from "@/helpers/usuariosHelper";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let ativo = true;
    void (async () => {
      if (!(await temSessaoCookie())) {
        if (ativo) router.replace("/login");
      } else {
        if (ativo) router.replace("/medidas");
      }
    })();
    return () => {
      ativo = false;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start"></main>
    </div>
  );
}
