import { type NextPage } from 'next';
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { prisma } from '~/server/db';
import { Formation, Prisma, Technologie } from '@prisma/client';
import { useState } from 'react';
import Header from '../components/header';
import Lesson from '../components/lesson';
import Title from '../components/title';
import { Difficulty } from '../components/difficulties';

export const getServerSideProps: GetServerSideProps<{
    tech: Technologie;
}> = async function (context) {
    const tech = await prisma.technologie.findUnique({
        where: {
            id: context.query.id as string
        },
    });
    return {
        props: {
            tech: JSON.parse(JSON.stringify(tech)) as Technologie
        }
    };
};

const Technologies: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ tech }) => {
  const { data: sessionData } = useSession();
  const idf = tech.id
  const { data: formations } = api.formation.getAllTech.useQuery({ id: idf })
  const { data: technologies } = api.technologie.getAll.useQuery()
  const admin = sessionData?.user.admin
  const [filterType, setFilterType] = useState("alphabetique")

  function changeFilterType(type: string) {
    setFilterType(type)
  }

  technologies as Technologie[] && technologies && technologies.length > 0 && filterType == "alphabetique" ? technologies.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }) : formations as Formation[] && formations && formations.length > 0 && filterType == "diff" && formations.sort(function (a, b) {
    return a.difficulte - b.difficulte;
  })
    const [tab, setTab] = useState("tech")

    

    async function visuAll(event: React.SyntheticEvent) {
        setTab('tech')
    }
    async function etapeTab(event: React.SyntheticEvent) {
        setTab('etape')
    }
    async function formationTab(event: React.SyntheticEvent) {
        setTab('formation')
    }

    return (
        <>
            <Head>
                <title>Liste des formations</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/okto.png" />
            </Head>
            <main className="flex min-h-screen flex-col items-start bg-white dark:bg-[#082F38]">

                <div className="flex flex-col items-start justify-start gap-12 pl-28 pt-20 pr-6 w-full">
                <div className="flex flex-row items-center justify-between w-full">
                    <Title title={"Tous nos cours de " + tech.name} link={"formations"} />
                    <div className="flex flex-row items-center justify-evenly">
                    <p className="mr-2">Trier par : </p>
                    
                    {filterType === "progress" ? <button className="px-4 py-1 bg-[#0E6073] rounded-full mx-1" onClick={() => changeFilterType("progress")}>
                        <p className="text-[#fff]">Progression</p>
                    </button> :
                    <button className="px-4 py-1 bg-[#D9D9D9] dark:bg-[#041F25] rounded-full mx-1" onClick={() => changeFilterType("progress")}>
                        <p className="text-[#0E6073] dark:text-[#0E6073]">Progression</p>
                    </button>
                    }
                    {filterType === "diff" ? <button className="px-4 py-1 bg-[#0E6073] rounded-full mx-1" onClick={() => changeFilterType("diff")}>
                        <p className="text-[#fff]">Niveau</p>
                    </button> :
                    <button className="px-4 py-1 bg-[#D9D9D9] dark:bg-[#041F25] rounded-full mx-1" onClick={() => changeFilterType("diff")}>
                    <p className="text-[#0E6073] dark:text-[#0E6073]">Niveau</p>
                    </button>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 md:gap-8 w-full"> 
                    {formations as Formation[] && formations && formations.length > 0 && formations.map((forma) => {
                        if (!forma.hidden || forma.hidden && admin)
                        return (
                            <Lesson data={forma} />
                        )
                    })}
                </div>
                </div>
                <Header selected={2}/>
            </main>
        </>
    );
};

export default Technologies;

const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();
  
    return (
      <div>
        {sessionData?.user.admin && <Link href="/components/admin"><img src="https://icones.pro/wp-content/uploads/2022/02/services-parametres-et-icone-d-engrenage-gris.png" className="max-w-[3rem]"></img></Link>}
        <button
          className="rounded-full px-3 py-3 font-semibold  no-underline transition hover:bg-white/10"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? <img src="/arrow.png" className="max-w-[1.5rem]"></img> : <img src='https://cdn-icons-png.flaticon.com/512/1250/1250689.png' className="max-w-[1.5rem]"></img>}
        </button>
      </div>
  
    );
  };