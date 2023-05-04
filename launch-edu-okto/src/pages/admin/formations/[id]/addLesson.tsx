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
import { Technologie, type Formation, Lecon, Etape, Prisma } from '@prisma/client';
import { DifficultyText } from '../../../components/difficulties';
import etapes from '../../../etapes/[id]';
import { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import dynamic from 'next/dynamic';
import DiscordProvider from 'next-auth/providers/discord';

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
            }
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
                lecons: LeconWithEtapes[];
            })
        }
    };
};

const Formations: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ formation }) => {
    const { data: sessionData } = useSession();
    const admin = sessionData?.user.admin

    const [tab, setTab] = useState("normal")
    const [type, setType] = useState("texte")
    const [content, setContent] = useState(formation.description);
    const [url, setUrl] = useState("");

    const [txtCours, setScript] = useState('');

    const idf = formation.id

    const addLecon = api.lecon.create.useMutation()
    const find = api.lecon.getLast.useMutation()
    const delLecon = api.lecon.delete.useMutation()
    const { data: lecons } = api.lecon.getAll.useQuery({ id: idf })

    const { data: techList } = api.technologie.getAll.useQuery()


    async function handleCrea(event: React.SyntheticEvent) {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            leconTitle: { value: string };
        };
        const title = target.leconTitle.value;
        await addLecon.mutateAsync({ title: title, idf: idf, description: "" })
        const lec = await find.mutateAsync()
        console.log(lec)
        
    }

    return (
        <>
            <Head>
                <title>Nouvelle leçon dans {formation.title}</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/okto.png" />
            </Head>

            <main className="flex min-h-screen h-screen bg-white pl-24 pt-20 pb-10 pr-10 w-full justify-between">

                <div className="flex flex-col gap-5 w-full h-full">
                    <div className="flex flex-row items-center justify-start px-10">
                        <Link href="/admin/main"><FaArrowLeft className="h-6 w-6 text-[#0E6073] mr-5" /></Link>
                        <h1 className="text-3xl font-bold tracking-tight text-[#0E6073]">Nouvelle leçon dans <em>{formation.title}</em></h1>
                    </div>
                    <form onSubmit={handleCrea} className='flex w-full justify-between h-full'>
                        <fieldset className='w-5/12 flex flex-col justify-between items-center'>
                            <fieldset className='w-full flex flex-col items-center'>
                                <input type='text' name="leconTitle" placeholder='Titre de la leçon' className="inputAddForm w-full" autoComplete="off" />
                                <fieldset className="flex gap-5 w-full justify-center mb-6">
                                    <div className="flex flex-col items-center gap-2">
                                        <label htmlFor="1" className="mt-8">Vidéo</label>
                                        <input type="radio" name="type" id="video" value="video" required className="shadow-none" onClick={(e) => {setType("video"); setScript('')}} />
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <label htmlFor="2" className="mt-8">Texte</label>
                                        <input type="radio" name="type" id="texte" value="texte" required className="shadow-none" onClick={(e) => {setType("texte"); setScript('')}} defaultChecked/>
                                    </div>

                                </fieldset>
                                {type === "video" &&
                                    <fieldset id='video' className='w-full'>
                                        <input type='url' placeholder='Url de la vidéo' className="inputAddForm w-full mb-5" onChange={(e)=> setUrl(e.target.value)} autoComplete="off"></input>
                                        <QuillNoSSRWrapper placeholder='Transcript de la vidéo' className='h-[250px]' />
                                    </fieldset>}

                                {type === "texte" &&
                                    <fieldset id='texte' className='w-full h-max'>
                                        <QuillNoSSRWrapper placeholder='Texte du cours' className='h-[300px]' onChange={setScript}/>
                                    </fieldset>}

                            </fieldset>

                            <div className="flex items-center justify-center h-[5rem] w-full bg-[#2ea3a5] text-white hover:cursor-pointer transition hover:bg-[#0e6073] rounded-3xl" onClick={(e) => setTab("exo")}>+ Ajouter un exercice</div>
                        </fieldset>

                        <fieldset className='w-5/12 flex flex-col justify-between items-center'>
                            <div className='w-full flex flex-col'>
                                <h1 className="text-xl font-bold tracking-tight text-[#0E6073] self-start mb-3">Prévisualisation</h1>
                                {type==="video" &&
                                <iframe
                                    src={`https://www.youtube.com/embed/${url.replace("https://www.youtube.com/watch?v=","")}`}
                                    title={`${formation.title}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className='w-[504px] h-[284px]'>
                                </iframe>}
                                {type==="texte"&& <div className="text-sm font-Inter dark:text-[#2EA3A5]" dangerouslySetInnerHTML={{ __html: txtCours }} />}
                            </div>
                            
                            <button type='submit' className="h-[5rem] w-full text-white bg-[#0e6073] rounded-3xl hover:cursor-pointer transition hover:bg-[#0E6073]/80">Créer la leçon</button>
                        </fieldset>

                    </form>
                </div>



                <Header selected={3} />

                {tab === "exo" &&
                    <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                        <form className="relative flex flex-col gap-5 item-center justify-start bg-white rounded-xl p-16 w-8/12" method="POST">
                            <div className='flex w-full gap-5 justify-center mb-10'>
                                <fieldset className='flex flex-col gap-3'>
                                    <legend className=''>Exercice</legend>
                                    <input type='text' name="leconTitle" placeholder="Url de la vidéo de l'exercice" className="inputAddForm w-full" autoComplete="off" />
                                    <input type='text' name="leconTitle" placeholder="Url du code de l'exercice" className="inputAddForm w-full" autoComplete="off" />
                                    <QuillNoSSRWrapper className='h-[150px]'/>
                                </fieldset>

                                <fieldset className='flex flex-col gap-3'>
                                    <legend>Solution</legend>
                                    <input type='text' name="leconTitle" placeholder='Url de la vidéo de la solution' className="inputAddForm w-full" autoComplete="off" />
                                    <input type='text' name="leconTitle" placeholder='Url du code de la solution' className="inputAddForm w-full" autoComplete="off" />
                                    <QuillNoSSRWrapper className='h-[150px]'/>
                                </fieldset>
                            </div>
                            

                            <div className="rounded-full bg-[#0E6073] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[#0E6073]/80 hover:cursor-pointer text-center" onClick={(e)=> setTab("normal")}>Valider l'exercice</div>

                        </form>
                    </div>}
            </main>
        </>
    );
};

export default Formations;