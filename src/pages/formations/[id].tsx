import { type NextPage } from 'next';
import { type GetServerSideProps } from 'next'
import { type InferGetServerSidePropsType } from 'next'
import Head from "next/head";
import Link from "next/link";
import Image from 'next/image'
import { signIn, signOut, useSession } from "next-auth/react";
import { FaArrowLeft, FaPenAlt, FaPlay } from "react-icons/fa";

import { api } from "~/utils/api";
import Header from "../components/header";
import { prisma } from '~/server/db';
import { Technologie, type Formation, Lecon } from '@prisma/client';
import { DifficultyText } from '../components/difficulties';
import Title from '../components/title';

export const getServerSideProps: GetServerSideProps<{
    formation: (Formation & {
        techs: Technologie[];
        lecons: Lecon[];
    });
}> = async function (context) {
    const formation = await prisma.formation.findUnique({
        where: {
            id: context.query.id as string
        },
        include: {
            techs: true,
            lecons: true
        }
    });
    if (!formation) {
        return {
            redirect: {
                destination: '/formation',
                permanent: false,
            },
        }
    }
    return {
        props: {
            formation: JSON.parse(JSON.stringify(formation)) as (Formation & {
                techs: Technologie[];
                lecons: Lecon[];
            })
        }
    };
};

const Formations: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ formation }) => {
    const { data: sessionData } = useSession();
    const admin = sessionData?.user.admin

    const idf = formation.id
    const addLecon = api.lecon.create.useMutation()
    const { data: lecons } = api.lecon.getAll.useQuery({ id: idf })

    const delFormation = api.formation.delete.useMutation()

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

                <div className="container flex flex-col items-start justify-start gap-12 px-4 py-20">
                    <Title title={formation.title} link='formations'/>

                    <div className="flex flex-col items-center pr-10 w-9/12">
                        <div className="flex flex-row items-center justify-between w-full">
                            <h1 className="text-xl font-bold tracking-tight text-[#0E6073]">Description</h1>
                            <div className="flex flex-row ">
                                <div className="flex flex-row items-center">
                                    {<DifficultyText level={formation.difficulte} />}
                                </div>
                                <div className="flex flex-row items-center ml-4">
                                    <FaPenAlt className="h-7 w-7 text-[#989898]" />
                                    <p className="ml-2 text-sm font-Inter text-[#989898]">{formation.lecons.length} leçons</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-sm font-Inter text-[#222222] self-start mt-3" dangerouslySetInnerHTML={{ __html: formation.description }} />
                       {formation.lecons[0]?.id && <Link href={`/lecons/${formation.lecons[0]?.id}`} className="self-end">
                            <button className="text-white w-full bg-[#0E6073] h-14 rounded-full my-3 self-end mt-3 px-14 hover:bg-[#0a4654]">
                                Commencer
                            </button>
                        </Link>}

                        <h1 className="text-xl font-bold tracking-tight text-[#0E6073] self-start mb-3">Vue d'ensemble</h1>

                        <div className="w-10/12 shadow-lg">
                            {formation.lecons as Lecon[] && formation.lecons.length > 0 && formation.lecons.map((lecon) => {
                                return (
                                    <Link href={`/lecons/${lecon.id}`} className="w-full flex flex-row justify-between px-24 py-6 bg-white shadow-md mt-1 transition hover:bg-[#0E6070]/20">
                                        <p className="text-base font-bold tracking-tight text-[#0E6073] self-start">{lecon.title}</p>
                                        <button>
                                            <FaPlay className="h-6 w-6 text-[#0E6073]" />
                                        </button>
                                    </Link>)
                            })}
                        </div>

                    </div>

                    <div className="w-3/12 absolute right-0 flex flex-col items-center justify-between h-5/6 pt-10 mr-5">
                        {formation.techs[0] && formation.techs[0].logo && <img src={formation.techs[0].logo} width="100" height="100" className="w-7/12" alt="" />}
                        {admin &&
                            <div>
                                <Link href={`/admin/formations/${formation.id}`}>
                                    <button className="text-white w-full bg-[#2EA3A5] h-14 rounded-full my-3 hover:bg-[#27888a]">
                                        Modifier les données du cours
                                    </button>
                                </Link>
                                <button onClick={() => { delFormation.mutateAsync({ id: formation.id }); window.location.reload() }} className="text-white w-full bg-[#920000] h-14 rounded-full my-3 hover:bg-[#6e0000]">
                                    Supprimer
                                </button>
                            </div>
                        }
                    </div>
                </div>
                <Header selected={2} />
            </main>
        </>
    );
};

export default Formations;