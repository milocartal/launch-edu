import { type NextPage } from 'next';
import { type GetServerSideProps } from 'next'
import { type InferGetServerSidePropsType } from 'next'
import Head from "next/head";
import Link from "next/link";
import Image from 'next/image'
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { FaArrowLeft, FaPenAlt, FaPlay } from "react-icons/fa";

import { api } from "~/utils/api";
import Header from "../../../components/header";
import { prisma } from '~/server/db';
import { Technologie, Formation, Lecon, Etape, Prisma } from '@prisma/client';
import { DifficultyText } from '../../../components/difficulties';
import etapes from '../../../etapes/[id]';
import { SyntheticEvent, useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import dynamic from 'next/dynamic';
import { RiAddFill } from 'react-icons/ri'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

type LeconWithEtapes = Prisma.LeconGetPayload<{
    include: { etapes: true }
}>

export const getServerSideProps: GetServerSideProps<{
    formation: (Formation & {
        techs: Technologie[];
        lecons: LeconWithEtapes[];
        Prerequis: Formation[]
    });
}> = async function (context) {
    const session = await getSession(context)
    const admin = session?.user.admin

    if (!session || !admin) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const formation = await prisma.formation.findUnique({
        where: {
            id: context.query.id as string
        },
        include: {
            techs: true,
            lecons: {
                include: {
                    etapes: true
                }
            },
            Prerequis: true
        }
    });
    if (!formation) {
        return {
            redirect: {
                destination: '/admin',
                permanent: false,
            },
        }
    }
    return {
        props: {
            formation: JSON.parse(JSON.stringify(formation)) as (Formation & {
                techs: Technologie[];
                lecons: LeconWithEtapes[];
                Prerequis: Formation[]
            })
        }
    };
};

const Formations: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ formation }) => {
    const { data: sessionData } = useSession();
    const admin = sessionData?.user.admin

    console.log(formation)

    const delFormation = api.formation.delete.useMutation()

    const delLecon = api.lecon.delete.useMutation()


    return (
        <>
            <Head>
                <title>{formation.title}</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/okto.png" />
            </Head>

            <main className="flex min-h-screen h-screen bg-white pl-24 pt-20 pb-10 w-full justify-between">

                <section className='w-6/12 h-full flex flex-col justify-between items-center'>
                    <div className="flex flex-col gap-5 w-full">
                        <div className="flex flex-row items-center justify-start">
                            <Link href="/admin"><FaArrowLeft className="h-6 w-6 text-[#0E6073] mr-5" /></Link>
                            <h1 className="text-3xl font-bold tracking-tight text-[#0E6073]">{formation.title}</h1>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <div className="flex flex-row items-center justify-between w-full">
                                <h1 className="text-xl font-bold tracking-tight text-[#0E6073]">Description</h1>
                                <div className="flex flex-row ">
                                    <div className="flex flex-row items-center">
                                        {<DifficultyText level={formation.difficulte} />}
                                    </div>
                                    <div className="flex flex-row items-center ml-4">
                                        <FaPenAlt className="h-7 w-7 text-[#989898]" />
                                        <p className="ml-2 text-sm font-Inter text-[#989898]">{formation.lecons.length} leçon(s)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm font-Inter text-[#222222] self-start mt-6" dangerouslySetInnerHTML={{ __html: formation.description }} />

                            <div className="flex flex-col w-full my-10">
                                <div className='w-full flex justify-between'>
                                    <h1 className="text-xl font-bold tracking-tight text-[#0E6073]">Thématique(s)</h1>
                                    <RiAddFill className='text-[#0E6073] text-2xl hover:cursor-pointer hover:text-green-600' />
                                </div>

                                <div className="w-11/12">
                                    {formation.techs as Technologie[] && formation.techs.length > 0 && formation.techs.map((tech) => {
                                        return (
                                            <div className="w-1/3 flex justify-center py-5 shadow-md mt-1 bg-[#0E6070] text-white rounded-lg" key={tech.id}>
                                                <p className="text-base font-bold tracking-tight">{tech.name}</p>
                                            </div>)
                                    })}
                                </div>
                            </div>
                            <div className="flex flex-col w-full my-10">
                                <div className='w-full flex justify-between'>
                                    <h1 className="text-xl font-bold tracking-tight text-[#0E6073]">Prérequis(s)</h1>
                                    <RiAddFill className='text-[#0E6073] text-2xl hover:cursor-pointer hover:text-green-600' />
                                </div>

                                <div className="w-11/12">
                                    {formation.Prerequis as Formation[] && formation.Prerequis.length > 0 && formation.Prerequis.map((requis) => {
                                        return (
                                            <div className="w-1/3 flex justify-center py-5 shadow-md mt-1 bg-[#0E6070] text-white rounded-lg" key={requis.id}>
                                                <p className="text-base font-bold tracking-tight">{requis.title}</p>
                                            </div>)
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href={`/admin/formations/${formation.id}/modifier`} className="h-[5rem] w-5/6 text-white bg-[#0e6073] rounded-lg flex items-center justify-center hover:cursor-pointer transition hover:bg-[#0E6073]/80">Modifier la formation</Link>

                </section>


                <aside className="w-5/12 right-0 flex flex-col items-center justify-start h-5/6 pt-10 mr-5">
                    <h1 className="text-xl font-bold tracking-tight text-[#0E6073] self-start mb-3">Leçon(s) dans la formation</h1>
                    <div className="flex flex-col max-h-full w-11/12 shadow-xl shadow-black/30 rounded-lg">
                        <div className="flex flex-col w-full rounded-t-lg max-h-[50rem] overflow-y-scroll" id="listTech">
                            {formation.lecons as Lecon[] && formation.lecons.length > 0 && formation.lecons.map((lecon) => {
                                return (
                                    <Link href={`/admin/lecons/${lecon.id}`} className="w-full flex flex-row justify-between px-24 py-6 bg-white shadow-md mt-1 transition hover:bg-[#0E6070]/20" key={lecon.id}>
                                        <p className="text-base font-bold tracking-tight text-[#0E6073] self-start">{lecon.title}</p>
                                        <p className="ml-2 text-sm font-Inter text-[#989898]">{lecon.etapes.length} étape(s)</p>
                                        <button
                                            onClick={() => {
                                                delLecon.mutateAsync({ id: lecon.id });
                                                window.location.reload()
                                            }}
                                            className="rounded-full font-semibold text-red-600 no-underline">
                                            <HiXMark className="text-[1.5rem] text-black hover:text-red-500" />
                                        </button>
                                    </Link>)
                            })}
                        </div>
                        <Link href={`/admin/formations/${formation.id}/addLesson`} className="flex items-center justify-center h-[5rem] w-full bg-[#2ea3a5] text-white hover:cursor-pointer transition hover:bg-[#0e6073] rounded-b-lg">
                            + Ajouter une lecon
                        </Link>
                    </div>
                    <button onClick={() =>{delFormation.mutateAsync({ id: formation.id }); window.location.reload()}} className='mt-6 text-red-600 hover:text-red-800'>Supprimer la Formation</button>
                </aside>

                <Header selected={3} />

            </main>
        </>
    );
};

export default Formations;