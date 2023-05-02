import { type NextPage } from 'next';
import { type GetServerSideProps } from 'next'
import { type InferGetServerSidePropsType } from 'next'
import Head from "next/head";
import Link from "next/link";
import Image from 'next/image'
import { signIn, signOut, useSession } from "next-auth/react";
import { FaArrowLeft, FaPenAlt, FaPlay } from "react-icons/fa";

import { api } from "~/utils/api";
import Header from "../../components/header";
import { prisma } from '~/server/db';
import { type Formation } from '@prisma/client';
import { DifficultyText } from '../../components/difficulties';

export const getServerSideProps: GetServerSideProps<{
    formation: Formation;
}> = async function (context) {
    const formation = await prisma.formation.findUnique({
        where: {
            id: context.query.id as string
        },
    });
    return {
        props: {
            formation: JSON.parse(JSON.stringify(formation)) as Formation
        }
    };
};

const Formations: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ formation }) => {
    const { data: sessionData } = useSession();
    const admin = sessionData?.user.admin

    const idf = formation.id
    const addLecon = api.lecon.create.useMutation()
    const { data: lecons } = api.lecon.getAll.useQuery({ id: idf })

    async function handleLecon(event: React.SyntheticEvent) {
        //event.preventDefault()
        const target = event.target as typeof event.target & {
            leconTitle: { value: string };
            description: { value: string };
        };
        const title = target.leconTitle.value;
        const desc = target.description.value;
        await addLecon.mutateAsync({ title: title, idf: idf, description: desc })
    }
    return (
    <>
        <Head>
            <title>{formation.title}</title>
            <meta name="description" content="Generated by create-t3-app" />
            <link rel="icon" href="/okto.png" />
        </Head>

        <main className="flex min-h-screen flex-col items-center bg-white">
    
        <Header />

        <div className="container flex flex-col items-start justify-start gap-12 px-4 py-20">
            <div className="flex flex-row items-center justify-between px-10 w-9/12">
                <div className="flex flex-row items-center justify-start">
                    <button className="mr-5"><FaArrowLeft className="h-6 w-6 text-[#0E6073]"/></button>
                    <h1 className="text-3xl font-bold tracking-tight text-[#0E6073]">{formation.title}</h1>
                </div>
                <div className="flex flex-row items-center justify-end">
                    {sessionData && sessionData.user?.image && <Link href={`/components/users/${sessionData.user.id}`}><img src={sessionData.user.image} className="max-w-[3rem]"></img></Link>}
                    <p className="text-[#222222] ml-3">{formation.prof}</p>
                </div>
            </div>
            <div className="flex flex-col items-center pr-10 w-9/12">
                <div className="flex flex-row items-center justify-between w-full">
                    <h2 className="text-xl font-bold tracking-tight text-[#0E6073]">Description</h2>
                    <div className="flex flex-row ">
                        <div className="flex flex-row items-center">
                            {formation.difficulte === 1 && <DifficultyText level={1} />}
                            {formation.difficulte === 2 && <DifficultyText level={2} />}
                            {formation.difficulte === 3 && <DifficultyText level={3} />}
                        </div>
                        <div className="flex flex-row items-center ml-4">
                            <FaPenAlt className="h-7 w-7 text-[#989898]"/>
                            <p className="ml-2 text-sm font-Inter text-[#989898]">3 leçons</p>
                        </div>
                    </div>
                </div>
                <div className="text-sm font-Inter text-[#222222] self-start mt-3" dangerouslySetInnerHTML={{ __html: formation.description }} />
                <button className="w-3/12 bg-[#0E6073] h-14 rounded-full my-3 self-end mt-3 hover:bg-[#0a4654]">
                    <p>Commencer</p>
                </button>
                <h2 className="text-xl font-bold tracking-tight text-[#0E6073] self-start mb-3">Vue d'ensemble</h2>
                <div className="w-10/12 shadow-lg">
                    <div className="w-full flex flex-row justify-between px-24 py-6 bg-white shadow-md mt-1">
                        <p className="text-base font-bold tracking-tight text-[#0E6073] self-start">Lesson 1</p>
                        <button>
                            <FaPlay className="h-6 w-6 text-[#0E6073]"/>
                        </button>
                    </div>
                    <div className="w-full flex flex-row justify-between px-24 py-6 bg-white shadow-md mt-1">
                        <p className="text-base font-bold tracking-tight text-[#0E6073] self-start">Lesson 1</p>
                        <button>
                            <FaPlay className="h-6 w-6 text-[#0E6073]"/>
                        </button>
                    </div>
                    <div className="w-full flex flex-row justify-between px-24 py-6 bg-white shadow-md mt-1">
                        <p className="text-base font-bold tracking-tight text-[#0E6073] self-start">Lesson 1</p>
                        <button>
                            <FaPlay className="h-6 w-6 text-[#0E6073]"/>
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-3/12 absolute right-0 flex flex-col items-center justify-between h-5/6 pt-10 mr-5">
                <Image src="/python.png" width="100" height="100" className="w-7/12 z-10" alt=""/>
                {admin && 
                <div>
                    <button className="w-full bg-[#2EA3A5] h-14 rounded-full my-3 hover:bg-[#27888a]">
                        <p>Modifier les données du cours</p>
                    </button>
                    <button className="w-full bg-[#920000] h-14 rounded-full my-3 hover:bg-[#6e0000]">
                        <p>Supprimer</p>
                    </button>
                </div>
                }
            </div>
        </div>
      </main>
    </>
    );
};

export default Formations;

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