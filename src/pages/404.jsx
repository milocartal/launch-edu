import Head from "next/head";
import Header from "./components/header";
import Techno from "./components/techno";


import { api } from "~/utils/api";
import { useEffect, useState } from "react";

export default function Custom404() {
  
  const { data: techs } = api.technologie.getAll.useQuery();
  const [troisTechs, setTroisTechs] = useState(techs)
  
  useEffect(() => {
    setTroisTechs(techs?.slice(0, 3))
  }, [techs]);

    return (
      <>
      <Head>
        <title>Erreur 404</title>
      </Head>
      <main className="flex flex-col min-h-screen w-full items-center justify-center bg-[#1A808C] ">

        <h4 className="text-[200px] font-Inter text-[#63AEAB]">404</h4>
        <p className="text-[36px] font-Inter text-white -mt-10">Aïe, on n'a pas encore ce cours :(</p>
        <p className="text-base font-Inter text-white mb-16">Quelques thématiques qui pourraient vous intéresser</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-center justify-center w-full gap-y-20 px-52 mb-16">
            {troisTechs && troisTechs.length > 0 && troisTechs.map((tech) => {
              return (
                <Techno data={{
                  id: tech.id,
                  name: tech.name,
                  logo: tech.logo,
                  lien_doc: tech.lien_doc
                }} key={tech.id}/>
              )
            })}
          </div>
      </main>
      <Header selected={404} />
      </>);
  }