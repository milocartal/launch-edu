import { type NextPage } from 'next';
import { type GetServerSideProps } from 'next'
import { type InferGetServerSidePropsType } from 'next'
import Head from "next/head";
import Link from "next/link";
import Image from 'next/image'
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { FaArrowLeft, FaPenAlt, FaPlay } from "react-icons/fa";

import { api } from "~/utils/api";
import Header from "../components/header";
import { prisma } from '~/server/db';
import { Technologie, type Formation, Lecon, Prisma, Progression, Session, Etape } from '@prisma/client';
import { DifficultyText } from '../components/difficulties';
import Title from '../components/title';
import Openable from '../components/openable';
import { type Session as SessionAuth } from 'next-auth';
import { useState } from 'react';
import Router from 'next/router';

type LeconWithEtapes = Prisma.LeconGetPayload<{
    include: { etapes: true }
}>

export const getServerSideProps: GetServerSideProps<{
    session: SessionAuth | undefined
    formation: (Formation & {
        techs: Technologie[];
        lecons: LeconWithEtapes[];
    });
    progression: Progression[] | undefined
}> = async function (context) {


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
            }
        }
    });
    if (!formation) {
        return {
            redirect: {
                destination: '/formations',
                permanent: false,
            },
        }
    }

    const session = await getSession(context)

    if (session) {
        const progression = await prisma.progression.findMany({
            where: {
                idF: formation.id,
                idU: session.user.id
            }
        })
        return {
            props: {
                session: JSON.parse(JSON.stringify(session)) as SessionAuth,
                formation: JSON.parse(JSON.stringify(formation)) as (Formation & {
                    techs: Technologie[];
                    lecons: LeconWithEtapes[];
                }),
                progression: JSON.parse(JSON.stringify(progression)) as Progression[]
            }
        }
    }
    else {
        return {
            props: {
                session: undefined,
                formation: JSON.parse(JSON.stringify(formation)) as (Formation & {
                    techs: Technologie[];
                    lecons: LeconWithEtapes[];
                }),
                progression: undefined
            }
        };
    }
};

const Formations: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ formation, progression }) => {
    const{data: session}= useSession()
    const admin = session?.user.admin

    const addProgression = api.progression.create.useMutation()

    const idf = formation.id

    const [select, setSelected] = useState("")

    const delFormation = api.formation.delete.useMutation()
    const one = api.progression.getOne.useMutation()

    async function handleProgression(idl: string) {
        if (formation && session) {
            const test = await one.mutateAsync({idu: session.user.id, idL: idl, idF: formation.id})
            if(!test){
                await addProgression.mutateAsync({ idu: session.user.id, idL: idl, idF: formation.id })
            }
        }
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
                    <Title title={formation.title} link='formations' />

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
                        <button className="text-white w-3/12 bg-[#0E6073] h-14 rounded-full my-3 self-end mt-3 hover:bg-[#0a4654]">
                            Commencer
                        </button>

                        <h1 className="text-xl font-bold tracking-tight text-[#0E6073] self-start mb-3">Vue d'ensemble</h1>

                        <div className="w-10/12 shadow-lg">
                            {formation.lecons as Lecon[] && formation.lecons.length > 0 && formation.lecons.map((lecon) => {
                                return (
                                    <div className="bg-white w-full mt-1 h-fit flex flex-col justify-start shadow-[4px_10px_20px_1px_rgba(0,0,0,0.25)]" key={lecon.id}>
                                        {select === lecon.id ?
                                            <>
                                                <div className="bg-white w-full h-fit flex flex-col items-center justify-center px-16 py-8 shadow-[4px_10px_20px_1px_rgba(0,0,0,0.25)]" onClick={(e) => setSelected("")}>
                                                    <div className="w-full flex flex-row items-center justify-between">
                                                        <p className="font-semibold text-[#0E6073]">{lecon.title}</p>
                                                        <div className="hover:cursor-pointer" onClick={() => {
                                                            handleProgression(lecon.id);
                                                            Router.push(`/lecons/${lecon.id}`)
                                                        }}>
                                                            <FaPlay className="h-5 w-5 text-[#0E6073]" />
                                                        </div>
                                                    </div>
                                                    {lecon.description && select && <div className="text-sm font-Inter text-[#989898] text-left w-full" dangerouslySetInnerHTML={{ __html: lecon.description }} />}
                                                </div>

                                                <div className="w-full mt-2 mb-4">
                                                    {lecon.etapes as Etape[] && lecon.etapes.length > 0 && lecon.etapes.map((etape) => {
                                                        return (<p className="px-20 mt-2 font-semibold text-[#0E6073]">{etape.name}</p>)
                                                    })}
                                                </div>
                                            </>
                                            :
                                            <div className="bg-white w-full h-fit flex flex-row items-center justify-between px-16 py-8 shadow-[4px_10px_20px_1px_rgba(0,0,0,0.25)] hover:cursor-pointer" onClick={() => setSelected(lecon.id)}>
                                                <p className="font-semibold text-[#0E6073]">{lecon.title}</p>
                                                <div className="hover:cursor-pointer" onClick={() => {
                                                    handleProgression(lecon.id);
                                                    Router.push(`/lecons/${lecon.id}`)
                                                }}>
                                                    <FaPlay className="h-5 w-5 text-[#0E6073]" />
                                                </div>
                                            </div>
                                        }
                                    </div>)
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
            </main >
        </>
    );
};

export default Formations;