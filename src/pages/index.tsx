import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from 'next/image'
import { signIn, signOut, useSession } from "next-auth/react";
import { FaPenAlt, FaMoon, FaSun } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { RiAdminLine } from "react-icons/ri";
import { api } from "~/utils/api";
import { DifficultyText } from "~/pages/components/difficulties"
import { Formation, Technologie } from "@prisma/client";
import { useTheme } from "next-themes";
import { useState } from "react";
import Techno from "./components/techno";

const Home: NextPage = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const [SearchTerm, setSearchTerm] = useState('');

  const { data: sessionData } = useSession();
  const user = sessionData?.user
  const admin = sessionData?.user.admin

  const { data: last4 } = api.formation.getLast4.useQuery();

  const { data: techs } = api.technologie.getAll.useQuery();

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setSearchTerm(value);
  };

  return (
    <>
      <Head>
        <title>OktoBidule</title>
        
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
        </style>
      </Head>

      <Image src={theme == "dark" ? "/homescreen-darkmode-wave.svg" : "/homescreen-wave.svg"} width="0" height="1500" className="w-screen z-0 absolute" alt="" />

      <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-[#082F38] z-10">
        <div className="flex flex-row items-start justify-between w-full px-16 z-10 mt-10">
          <Link href={"/"}><Image src="/logo-carre.png" alt="Logo Oktopod" width="64" height="64" /></Link>
          <div className="flex flex-row justify-around items-center gap-1">
            {admin && <Link href="/admin" className="text-white hover:cursor-pointer"><RiAdminLine className="text-white text-[2rem]" /></Link>}

            {user && <Link href={"/dashboard"} className=" px-3 py-3 text-white font-semibold font-Inter rounded-full hover:bg-white/10">MON ESPACE</Link>}
            <button
              className="rounded-full px-3 py-3 font-semibold  no-underline transition hover:bg-white/10"
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
              {sessionData ? <img src="/arrow.png" className="max-w-[1.5rem]"></img> : <p className="text-white font-Inter">CONNEXION</p>}
            </button>
            <button onClick={() => theme === "dark" ? setTheme('light') : setTheme("dark")} className="flex flex-row justify-center items-center ml-3 rounded-full bg-white/10 w-10 h-10 shadow-md">
              {theme == "dark" ? <FaSun className="w-2/5 text-[#fff]" /> : <FaMoon className="w-2/5 text-[#fff]" />}
            </button>
          </div>
        </div>

        <div className="container flex flex-col items-center columns-12 justify-center z-10 pt-10 px-12 ">
          <div className="container flex flex-row items-center justify-center mb-12">
            <div className="w-3/5">
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] mb-12">
                Des cours sur mesure
              </h1>
              <p className="text-white text-xl font-Inter w-10/12">Vendre c'est faire acheter. - Kristen, expert marketing</p>
            </div>
            <img src="/gigaKristen.png" className="h-[600px]" alt="" />
          </div>

          <h1 className="text-4xl self-start mb-24 mt-20 text-[#0E6073] dark:text-white">Nouveautés</h1>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 w-full items-center mt-4">
            {last4 as Formation[] && last4 && last4.length > 0 && last4.map((forma) => {
              if (!forma.hidden || (forma.hidden && admin)) {
                return (
                  <Link href={`/formations/${forma.id}`} className="flex flex-col items-center justify-between bg-white/20 dark:bg-[#041F25] rounded-3xl shadow-lg w-full h-96 mx-2 relative transition hover:scale-[1.05]" key={forma.id}>
                    
                    <div className="absolute -top-20 flex items-end justify-center items-end w-[170px] h-[150px]">
                      {forma.techs[0] && forma.techs[0].logo && <img src={forma.techs[0].logo} alt="" className="max-h-full"/>}
                    </div>

                    <div className="w-full px-4 flex flex-col items-center mt-20">
                      <h3 className="text-3xl mb-3 text-cyan-700 text-[#0E6073] dark:text-[#2EA3A5]">{forma.title}</h3>
                      <div className="text-sm font-Inter text-[#0E6073] dark:text-[#2EA3A5] max-h-36 overflow-hidden" dangerouslySetInnerHTML={{ __html: forma.description }} />
                    </div>

                    <div className="flex flex-row items-center justify-around mt-5 w-full px-5 pb-4">
                      <div className="flex flex-row items-center justify-center">
                        {<DifficultyText level={forma.difficulte} />}
                      </div>
                      <div className="flex flex-row items-center justify-center">
                        <FaPenAlt className="h-7 w-7 text-[#989898] dark:text-[#2EA3A5]" />
                        <p className="ml-2 text-sm font-Inter text-[#989898] dark:text-[#2EA3A5]">{forma.lecons.length.toString()} leçons</p>
                      </div>
                    </div>

                  </Link>
                )
              }
            })}
          </div>

          <h1 className="text-4xl self-start mb-11 mt-12 text-[#0E6073] dark:text-white">Trouvez le bon cours pour vous</h1>
          <div className="bg-white dark:bg-[#041F25] width mb-14 w-8/12 h-16 flex flex-row items-center px-8 rounded-full shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)]">
            <HiMagnifyingGlass className="h-9 w-9 text-[#989898] dark:text-[#0E6073]" />
            <input className=" h-16 w-40 shadow-none w-full bg-transparent dark:text-[#2EA3A5]" type="text" name="searchValue" id="searchValue" onChange={handleSearchTerm} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 w-full items-center gap-y-14 mt-10">
            {techs as Technologie[] && techs && techs.length > 0 && techs.filter((tech) => {
              return tech.name.toLowerCase().includes(SearchTerm.toLowerCase())
            }).map((tech) => {
              return (
                <Techno data={tech} key={tech.id} />
              )
              
            })}
          </div>

        </div>
        <div className="w-full bg-[#0e6370] dark:bg-[#041F25] h-36 bottom-0 mt-12 flex flex-row px-48 justify-between items-center">
          <div className="flex flex-row justify-between items-center">
            <Link target="_blank" href={"https://www.oktopod.io/"}><Image src="/Oktopod-carré-blanc.png" width="100" height="30" className="h-20 mr-4" alt="Logo Oktopod" /></Link>
            <p className="text-sm font-Inter text-white mx-4">© 2023 Oktopod</p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <Link className="text-sm font-Inter text-white mx-4 hover:text-[#63AEAB]" href={'/mentionslegales'}>Mentions légales</Link>
            <button onClick={sessionData ? () => void signOut() : () => void signIn()} className="text-sm font-Inter text-white pl-4 border-l-2 hover:text-[#63AEAB]">{sessionData ? "Déconnexion" : "Connexion"}</button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;