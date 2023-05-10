import Head from "next/head";
import {TbError404} from "react-icons/tb"
import Header from "./components/header";

export default function Custom404() {
    return (
      
      <>
      <Head>
        <title>ERROR 404</title>
      </Head>
      <main className="flex flex-col h-screen w-full items-center justify-center bg-[#1A808C]">

        <h4 className="text-[200px] font-Inter text-[#63AEAB]">404</h4>
        <p className="text-[36px] font-Inter text-white">Aïe, on n'a pas encore ce cours :(</p>
        <p className="text-base font-Inter text-white">Quelques thématiques qui pourraient vous intéresser</p>
      </main>
      <Header />
      </>);
  }