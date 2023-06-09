import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from 'next/image'
import { signIn, signOut, useSession } from "next-auth/react";

import { FaMoon, FaSun } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";


import { useTheme } from "next-themes";

const MentionsLegales: NextPage = () => {
  const { theme, setTheme } = useTheme();

  const { data: sessionData } = useSession();
  const user = sessionData?.user
  const admin = sessionData?.user.admin

  return (
    <>
      <Head>
        <title>Mentions légales</title>
        <meta name="description" content="Generated by create-t3-app" />

      </Head>

      <Image src={theme == "dark" ? "/homescreen-darkmode-wave.svg" : "/homescreen-wave.svg"} width="0" height="1500" className="w-screen z-0 absolute -top-80" alt="" />

      <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-[#082F38] z-10">
        <div className="flex flex-row items-start justify-between w-full px-16 z-10 mt-10">
          <Link href={"/"}><Image src="/okto.png" alt="Logo Oktopod" width="64" height="64" /></Link>
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
          <div className="container flex flex-row items-center justify-start mb-36">
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem] mt-12">
                Mentions légales
              </h1>
          </div>

          <h1 className="text-4xl self-start mb-8 mt-40 text-[#0E6073] dark:text-white">Titre 1</h1>
          <p className="text-base self-start text-[#0E6073] dark:text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque felis ex, finibus et magna id, egestas consectetur erat. Nam imperdiet vel quam ultrices rhoncus. Cras sit amet interdum leo, et ultrices ligula. Integer vitae erat quis dui hendrerit placerat ac semper orci. Etiam gravida nisi ut orci imperdiet, id dictum odio auctor. Mauris id scelerisque lorem. Nam id posuere leo, sit amet tempus nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          
          <h1 className="text-4xl self-start mt-20 text-[#0E6073] dark:text-white">Titre 2</h1>
          <h1 className="text-2xl self-start mb-8 mt-5 text-[#0E6073] dark:text-white">Sous titre 1</h1>
          <p className="text-base self-start text-[#0E6073] dark:text-white">Nunc at leo pretium, volutpat enim ac, rhoncus elit. Mauris sagittis, odio vulputate eleifend euismod, mi felis mattis nulla, at ultricies ligula augue ut tellus. Aliquam vestibulum convallis felis, nec sollicitudin erat sollicitudin a. Duis consectetur orci sed purus pulvinar facilisis. Sed vitae purus vel ligula viverra gravida. Proin sed massa eget est feugiat sollicitudin euismod cursus lacus. Mauris pellentesque rutrum urna, nec condimentum urna bibendum et. Vestibulum et accumsan metus. Aenean fringilla sem metus, vel posuere enim egestas et. Maecenas a felis ut leo lacinia efficitur non non magna.</p>

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

export default MentionsLegales;