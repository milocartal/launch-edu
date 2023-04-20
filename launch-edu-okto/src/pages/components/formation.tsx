import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { Formation, Technologie } from "@prisma/client";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: formations } = api.formation.getAll.useQuery()
  const admin = sessionData?.user.admin

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Oktopod <span className="text-[hsl(280,100%,70%)]">Formations</span> List
          </h1>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
            <Link href="/"><button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">Home</button></Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {formations as Formation[] && formations && formations.length > 0 && formations.map((forma) => {
              if (!forma.hidden || forma.hidden && admin)
                return (
                  <Link
                    className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                    href={`/components/formations/${encodeURIComponent(forma.id)}`}
                    key={forma.id}
                  >
                    <h3 className="text-2xl font-bold">{forma.title}</h3>
                    <div className="text-lg">
                      {forma.description}
                    </div>
                    <div className="text-lg">
                      {forma.difficulte}
                    </div>

                    <div className="text-lg">
                      {forma.createdAt !== undefined}
                    </div>
                  </Link>
                )
            })}
          </div>

          
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      {sessionData?.user.admin && <Link href="/components/admin"><button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">Admin</button></Link>}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

