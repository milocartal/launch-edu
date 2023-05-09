import { type NextPage } from 'next';
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { FaArrowLeft, FaVideo, FaGithub, FaPenAlt } from "react-icons/fa";

import { api } from "~/utils/api";
import { prisma } from '~/server/db';
import { Etape, EtapeType, Lecon, Formation, Prisma } from '@prisma/client';
import Header from '~/pages/components/header';
import etapes from '../../../etapes/[id]';

type LeconWithEtapes = Prisma.LeconGetPayload<{
    include: { etapes: true }
}>

export const getServerSideProps: GetServerSideProps<{
    lecon: LeconWithEtapes;
    formation: Formation
}> = async function (context) {

    const session = await getSession(context)
    const admin = session?.user.admin

    const lecon = await prisma.lecon.findUnique({
        where: {
            id: context.query.id as string
        },
        include: {
            etapes: true
        }
    });
    const idf = lecon?.idf;

    const formation = await prisma.formation.findUnique({
        where: {
            id: lecon?.idf as string
        },
        include: {
            techs: true,
            lecons: true
        }
    });

    if (!lecon) {
        return {
            redirect: {
                destination: '/admin/formations'+idf,
                permanent: false,
            },
        }
    }

    if (!session || !admin) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    else {

        return {
            props: {
                lecon: JSON.parse(JSON.stringify(lecon)) as LeconWithEtapes,
                formation: JSON.parse(JSON.stringify(formation)) as Formation
            }
        };
    }

};

const Lecons: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ lecon, formation }) => {

    const idL = lecon.id
    const idf = lecon.idf
    const addEtape = api.etape.create.useMutation()
    const { data: etapes } = api.etape.getAll.useQuery({ id: idL })
    const delLecon = api.lecon.delete.useMutation()

    console.log("api ", etapes)
    console.log("props ", lecon.etapes)

    return (
        <>
            <Head>
                <title>{lecon.title}</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/okto.png" />
            </Head>

            <main className="flex min-h-screen flex-col items-center bg-white">

                <div className="container flex flex-col items-start justify-start gap-12 px-4 py-20">
                    <div className="flex flex-row items-center justify-between px-10 w-7/12">
                        <div className="flex flex-row items-center justify-start">
                            <button className="mr-5"><Link href={`/formations/${encodeURIComponent(lecon.idf)}`}><FaArrowLeft className="h-6 w-6 text-[#0E6073]" /></Link></button>
                            <h1 className="text-3xl font-bold tracking-tight text-[#0E6073]">{lecon.title} de {formation.title}</h1>
                        </div>
                    </div>
                    <div className="flex flex-col items-center pr-10 w-7/12">
                        <div className="flex flex-row items-center justify-between w-full">
                            <h3 className="text-xl font-bold tracking-tight text-[#0E6073]">Description</h3>

                            {lecon.etapes && lecon.etapes.length > 0 && lecon.etapes[0] && lecon.etapes[0].video !== "" ?
                                <div className="flex flex-row items-center ml-4">
                                    <FaVideo className="h-7 w-7 text-[#989898]" />
                                    <p className="ml-2 text-sm font-Inter text-[#989898]">Cours vidéo</p>
                                </div> :
                                <div className="flex flex-row items-center ml-4">
                                    <FaPenAlt className="h-7 w-7 text-[#989898] dark:text-[#2EA3A5]" />
                                    <p className="ml-2 text-sm font-Inter text-[#989898]">Cours écrit</p>
                                </div>}

                        </div>
                        <div className="text-sm font-Inter text-[#222222] self-start mt-3" dangerouslySetInnerHTML={{ __html: lecon.description }} />
                        <div className="self-end flex flex-row items-center justify-end w-8/12">
                            {lecon.etapes && lecon.etapes.length > 0 && lecon.etapes[0] && lecon.etapes[0].video !== "" ? <Link href={`${lecon.etapes[0].video.replace("embed/", "watch?v=")}`} target="_blank" className="text-white flex items-center justify-center w-8/12 bg-[#0E6073] h-14 rounded-full my-3 self-end ml-2 hover:bg-[#0a4654]">
                                Voir la vidéo du cours
                            </Link> : <></>}
                            <Link href={`${lecon.etapes[0]?.code}`} target="_blank" className="text-white w-3/12 bg-[#2EA3A5] flex flex-row items-center justify-center h-14 rounded-full my-3 ml-2 self-end hover:bg-[#248082] hover:cursor-pointer">
                                <FaGithub className="h-7 w-7 text-white" />
                            </Link>
                        </div>
                        <div className="flex flex-col items-start w-full mt-5">
                            <h3 className="text-xl font-bold tracking-tight text-[#0E6073]">Transcript</h3>
                            {lecon.etapes && lecon.etapes[0] ? <div className="text-sm font-Inter text-[#222222] self-start mt-3" dangerouslySetInnerHTML={{ __html: lecon.etapes[0].transcript }} /> : <p className="text-sm font-Inter text-[#222222] self-start mt-3">Pas de Transcript</p>}
                        </div>
                    </div>
                </div>
                <div className="w-5/12 fixed right-0 flex flex-col items-center justify-between h-5/6 pt-10 mr-5">

                    <div className="bg-white mt-24 w-4/6 h-52 flex flex-col justify-start shadow-[4px_10px_20px_1px_rgba(0,0,0,0.25)]">
                        <div className="bg-white w-full h-2/6 mb-4 flex flex-row items-center justify-start px-16 shadow-[4px_10px_20px_1px_rgba(0,0,0,0.25)]">
                            <p className="font-semibold text-[#0E6073]">{lecon.title}</p>
                        </div>
                        {lecon.etapes as Etape[] && lecon.etapes.length > 0 && lecon.etapes.map((etape) => {
                            return (
                                <Link href={`/etapes/${etape.id}`} className="px-20 mt-2 font-semibold text-[#0E6073]">{etape.name}</Link>
                            )
                        })}
                    </div>
                    <div className='flex flex-col gap-4 w-4/6'>
                        <Link href={`/admin/lecons/${lecon.id}/modifier`} className="flex justify-center items-center text-white w-full bg-[#0E6073] h-14 rounded-full hover:bg-[#0a4654]">
                            Modifier la leçon
                        </Link>
                        <button onClick={(e) => {delLecon.mutateAsync({ id: lecon.id }); window.location.reload()}} className="flex justify-center items-center text-white w-full bg-[#920000] h-14 rounded-full hover:bg-[#6e0000]">
                            Supprimer la leçon
                        </button>
                    </div>


                </div>
            </main>
            <Header selected={3} />
        </>
    );
};

export default Lecons;