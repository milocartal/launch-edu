import { type NextPage } from 'next';
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { prisma } from '~/server/db';
import { FaArrowLeft, FaGithub, FaVideo } from "react-icons/fa";
import { Etape, EtapeType, Lecon, Formation, Prisma, Progression } from '@prisma/client';
import Header from '../components/header';
import Title from '../components/title';
import { useEffect, useState } from 'react';
import Router from 'next/router';

type LeconWithEtapes = Prisma.LeconGetPayload<{
    include: { etapes: true }
}>

type FormationWithLecon = Prisma.FormationGetPayload<{
    include: {
        lecons: {
            include: {
                etapes: true
            }
        }
    }
}>

export const getServerSideProps: GetServerSideProps<{
    lecon: LeconWithEtapes;
    formation: FormationWithLecon;
    progression: Progression[]
}> = async function (context) {

    const session = await getSession(context)
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const user = session.user

    const lecon = await prisma.lecon.findUnique({
        where: {
            id: context.query.id as string
        },
        include: {
            etapes: true
        }
    });

    if (!lecon) {
        return {
            redirect: {
                destination: '/formations',
                permanent: false,
            },
        }
    }

    const idf = lecon.idf;

    const formation = await prisma.formation.findUnique({
        where: {
            id: lecon?.idf as string
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

    const progression = await prisma.progression.findMany({
        where: {
            idL: lecon.id,
            idU: user.id
        }
    })

    return {
        props: {
            lecon: JSON.parse(JSON.stringify(lecon)) as LeconWithEtapes,
            formation: JSON.parse(JSON.stringify(formation)) as FormationWithLecon,
            progression: JSON.parse(JSON.stringify(progression)) as Progression[]
        }
    };


};

const etapes: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ lecon, formation, progression }) => {
    const { data: session } = useSession()

    const [current, setCurrent] = useState(lecon);
    const [currentEtape, setCurrentEtape] = useState(0);

    useEffect(() => {
        setCurrent(lecon)
    });
    const one = api.progression.getOne.useMutation()
    const addProgression = api.progression.create.useMutation()
    const finishProg = api.progression.setFinished.useMutation()

    async function handleUpdateProg(lecon: Lecon) {

        if (formation && session) {
            if (lecon !== current) {
                const test = await one.mutateAsync({ idu: session.user.id, idL: current.id, idF: formation.id })
                if (!test) {
                    await addProgression.mutateAsync({ idu: session.user.id, idL: current.id, idF: formation.id })
                    await finishProg.mutateAsync({ idu: session.user.id, idL: current.id, idF: formation.id })
                }
                else {
                    await finishProg.mutateAsync({ idu: session.user.id, idL: current.id, idF: formation.id })
                }
                const testSuivant = await one.mutateAsync({ idu: session.user.id, idL: lecon.id, idF: formation.id })
                if (!testSuivant) {
                    await addProgression.mutateAsync({ idu: session.user.id, idL: lecon.id, idF: formation.id })
                }
            }
        }
    }

    return (
        <>
            <Head>
                <title>{lecon.title}</title>
                <meta name="description" content="Generated by create-t3-app" />
            </Head>

            <main className="flex min-h-screen bg-white dark:bg-[#082F38] pl-28 pt-10 w-full justify-between">

                <section className='w-10/12 h-full flex flex-col justify-between items-center pt-10 mb-10'>
                    <div className="flex flex-col w-full items-start">
                        <Title title={lecon.title} link={`formations/${encodeURIComponent(lecon.idf)}`} />

                        {lecon.etapes[currentEtape]?.video && <iframe className="w-11/12 h-[9/16] mt-5" width="560" height="315" src={lecon.etapes[currentEtape]?.video} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>}

                        <div className="flex flex-col items-center pr-10 w-10/12">
                            <div className="flex flex-col items-start w-full mt-5">
                                {lecon.etapes[currentEtape]?.video && <h3 className="text-xl font-bold tracking-tight text-[#0E6073]">Transcript</h3>}
                                {lecon.etapes && lecon.etapes[currentEtape] ? <div className="text-sm font-Inter text-[#222222] self-start mt-3" dangerouslySetInnerHTML={{ __html: lecon.etapes[currentEtape]!.transcript }} /> : <p className="text-sm font-Inter text-[#222222] self-start mt-3">Pas de transcript disponible</p>}
                            </div>
                        </div>
                    </div>
                </section>
                <div className="w-2/12 fixed right-0 flex bg-[#0E6073] flex-col items-center h-full pt-6">
                    {formation.lecons as Lecon[] && formation.lecons.length > 0 && formation.lecons.map((lecon, index) => {
                        return (
                            current.id === lecon.id ?
                                <div className="w-full bg-[#1A808C] flex flex-col items-start" key={lecon.id}>
                                    <div className="w-full py-3 flex flex-row items-center px-8">
                                        <p className="text-sm font-Inter text-[#63AEAB] mr-3">{index + 1}</p>
                                        <p className="text-sm font-Inter text-white">{lecon.title}</p>
                                    </div>
                                    {lecon.etapes && lecon.etapes.length > 0 && lecon.etapes.map((etape, indexetape) => {
                                        return (
                                            currentEtape === indexetape ?
                                                <button className="bg-[#2EA3A5] w-full px-8 flex flex-row justify-start" key={etape.id}>
                                                    <p className="px-8 py-2 text-sm font-Inter text-white">{etape.name}</p>
                                                </button>
                                                :
                                                <button onClick={() => setCurrentEtape(indexetape)} className="w-full px-8 flex flex-row justify-start" key={etape.id}>
                                                    <p className="px-8 py-2 text-sm font-Inter text-white">{etape.name}</p>
                                                </button>
                                        )
                                    })}
                                </div>
                                :
                                <button
                                    onClick={() => {
                                        setCurrentEtape(0);
                                        handleUpdateProg(lecon);
                                        Router.push(`/lecons/${lecon.id}`)
                                    }}
                                    className="w-full py-3 flex flex-row items-center px-8"
                                    key={lecon.id}>
                                    <p className="text-sm font-Inter text-[#63AEAB] mr-3">{index + 1}</p>
                                    <p className="text-sm font-Inter text-white">{lecon.title}</p>
                                </button>
                        )
                    })}
                </div>
            </main>

            <Header selected={2} />
        </>
    );
};

export default etapes;