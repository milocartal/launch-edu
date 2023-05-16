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
import { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import dynamic from 'next/dynamic';

import Router from 'next/router'
import Title from '~/pages/components/title';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

type LeconWithEtapes = Prisma.LeconGetPayload<{
    include: { etapes: true }
}>

export const getServerSideProps: GetServerSideProps<{
    lecon: LeconWithEtapes;
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
                lecon: JSON.parse(JSON.stringify(lecon)) as LeconWithEtapes
            }
        };
    }

};

const Formations: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ lecon }) => {
    const idf = lecon.idf //id de la formation

    //UseState
    const [tab, setTab] = useState("normal") //Pop up
    const [type, setType] = useState(() => {
        let typy;
        if(lecon.etapes[0]!.video.length > 0)
            typy = "video"
        else
            typy = "texte"
        return typy
    }) //Type de lecon (video ou texte)
    const [haveExo, setHave] = useState(false) //boolean qui regarde si on vaut faire un exercice
    const [haveVid, setHaveVid] = useState(false) //boolean qui regarde si on vaut faire un exercice

    //Liste des urls
    const [vC, setVC] = useState(lecon.etapes[0]?.video || ""); //video cours
    const [cC, setCC] = useState(lecon.etapes[0]?.code || ""); //code cours

    const [vE, setVE] = useState(lecon.etapes[1]?.video || ""); //video exo
    const [cE, setCE] = useState(lecon.etapes[1]?.code || ""); //code exo

    const [vS, setVS] = useState(lecon.etapes[2]?.video || ""); //video soluce
    const [cS, setCS] = useState(lecon.etapes[2]?.code || ""); //code soluce

    //List des textarea
    const [description, setDesc] = useState(lecon.description); //description de la leçon
    const [txtCours, setScript] = useState(lecon.etapes[0]?.transcript || ""); //transcript/text du cours
    const [txtExo, setTxtExo] = useState(lecon.etapes[1]?.transcript || ""); //texte de l'exo
    const [txtSoluce, setTxtSoluce] = useState(lecon.etapes[2]?.transcript || ""); //texte solution

    //API
    const updateLecon = api.lecon.update.useMutation()
    const find = api.lecon.getLast.useMutation()
    const updateEtape = api.etape.update.useMutation()
    const addEtape = api.etape.create.useMutation()
    const { data: Cours } = api.type.getIdType.useQuery({ name: "Cours" })
    const { data: Exercice } = api.type.getIdType.useQuery({ name: "Exercice" })
    const { data: Soluce } = api.type.getIdType.useQuery({ name: "Solution" })

    //fonction de création
    async function handleCrea(event: React.SyntheticEvent) {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            leconTitle: { value: string };
        };
        const title = target.leconTitle.value;
        await updateLecon.mutateAsync({ id: lecon.id, title: title, description: description })

        if (lecon.etapes[0]) {
            await updateEtape.mutateAsync({ id: lecon.etapes[0].id, code: cC, video: vC, transcript: txtCours })
            if (lecon.etapes[1] && lecon.etapes[2]) {
                await updateEtape.mutateAsync({ id: lecon.etapes[1].id, code: cE, video: vE, transcript: txtExo })
                await updateEtape.mutateAsync({ id: lecon.etapes[2].id, code: cS, video: vS, transcript: txtSoluce })
            }
            else if ((txtExo && txtSoluce && cE && cS) !== "" && haveExo) {
                if (Exercice && Soluce) {
                    await addEtape.mutateAsync({ name: "Exercice", idt: Exercice.id, code: cE, video: vE, transcript: txtExo, idl: lecon.id })
                    await addEtape.mutateAsync({ name: "Solution", idt: Soluce.id, code: cS, video: vS, transcript: txtSoluce, idl: lecon.id })
                }
            }
        }
        Router.push(`/admin/lecons/${lecon.id}`)
    }

    return (
        <>
            <Head>
                <title>Modifier {lecon.title}</title>
                <meta name="description" content="Generated by create-t3-app" />
            </Head>

            <main className="flex min-h-screen h-screen bg-white dark:bg-[#082F38] pl-24 pt-20 pb-10 pr-10 w-full justify-between">

                <div className="flex flex-col gap-5 w-full h-full">
                    <Title title={"Modifier " + lecon.title} link={`/admin/lecons/${lecon.id}`} />
                    <form onSubmit={handleCrea} className='flex w-full justify-between h-full'>
                        <fieldset className='w-5/12 flex flex-col justify-between items-center'>
                            <fieldset className='w-full flex flex-col items-center w-full gap-5'>
                                <input
                                    type='text'
                                    name="leconTitle"
                                    placeholder='Titre de la leçon'
                                    className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full"
                                    autoComplete="off"
                                    defaultValue={lecon.title} />

                                <QuillNoSSRWrapper placeholder='Description' className='h-64 w-full mb-5 pb-10 dark:bg-[#041F25] dark:text-white' onChange={setDesc} defaultValue={lecon.description} />

                                <fieldset className="flex gap-5 w-full justify-center text-[#0E6073]">
                                    <div className="flex flex-col items-center gap-2">
                                        <label htmlFor="1" className="mt-8">Vidéo</label>
                                        <input type="radio" name="type" id="video" value="video" required className="shadow-none" onClick={(e) => { setType("video") }} defaultChecked={type === "video"}/>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <label htmlFor="2" className="mt-8">Texte</label>
                                        <input type="radio" name="type" id="texte" value="texte" required className="shadow-none" onClick={(e) => { setType("texte"); setVC("") }} defaultChecked={type === "texte"} />
                                    </div>

                                </fieldset>

                               {type==="video" && <input
                                    type='url'
                                    name='urlVideoCour'
                                    placeholder='Url de la vidéo du cours'
                                    className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full"
                                    onChange={(e) => setVC(e.target.value)}
                                    autoComplete="off"
                                    defaultValue={vC}>
                                </input>}

                                <input
                                    type='url'
                                    name="urlCodeCour"
                                    placeholder='Url du code du cours'
                                    className={"p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full"}
                                    onChange={(e) => setCC(e.target.value)}
                                    autoComplete="off"
                                    defaultValue={cC}>
                                </input>

                            </fieldset>

                        </fieldset>

                        <fieldset className='w-5/12 max-w-5/12 flex flex-col justify-between items-center'>

                            <QuillNoSSRWrapper placeholder={type !== "video" ? 'TexteV' : 'Transcript'} className='w-full max-h-64 h-64 mb-10 pb-10 dark:bg-[#041F25] dark:text-white' onChange={setScript} defaultValue={lecon.etapes[0]?.transcript} />

                            <div className='flex flex-col w-full gap-5'>
                                <div className="flex items-center justify-center h-[5rem] w-full bg-[#2ea3a5] text-white hover:cursor-pointer transition hover:bg-[#0e6073] rounded-3xl" onClick={(e) => setTab("exo")}>Modifier l'exercice</div>
                                <button type='submit' className="h-[5rem] w-full text-white bg-[#0e6073] rounded-3xl hover:cursor-pointer transition hover:bg-[#0E6073]/80">Enregistrer les modifications</button>
                            </div>

                        </fieldset>

                    </form>
                </div>

                <Header selected={3} />

                {tab === "exo" &&
                    <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                        <form className="relative flex flex-col gap-5 item-center justify-start bg-white rounded-xl p-16 w-8/12 text-[#041f25]">

                            <button
                                onClick={(e) => 
                                    setTab('normal')
                                }
                                className="absolute top-3 right-4 rounded-full font-semibold  no-underline transition hover:text-red-500">
                                <HiXMark className="text-[2rem] text-[#0e6073] hover:text-red-500" />
                            </button>

                            <div className='flex w-full gap-5 justify-center mb-10'>
                                <fieldset className='flex flex-col gap-3 w-[45%] max-w-[45%]'>
                                    <legend className="text-xl font-bold tracking-tight text-[#0E6073] mb-2">Exercice</legend>

                                    <input
                                        type='url'
                                        name="urlVideoExo"
                                        placeholder="Url de la vidéo de l'exercice"
                                        className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                                        onChange={(e) => setVE(e.target.value)}
                                        autoComplete="off"
                                        defaultValue={vE} />

                                    <input
                                        type='url'
                                        name="urlCodeExo"
                                        placeholder="Url du code de l'exercice"
                                        className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                                        onChange={(e) => setCE(e.target.value)}
                                        autoComplete="off"
                                        defaultValue={cE}
                                        required />

                                    <QuillNoSSRWrapper
                                        className='h-[150px]'
                                        placeholder="Transcript de la vidéo de l'exercice"
                                        onChange={setTxtExo}
                                        defaultValue={txtExo} />
                                </fieldset>

                                <fieldset className='flex flex-col gap-3 w-[45%] max-w-[45%]'>
                                    <legend className="text-xl font-bold tracking-tight text-[#0E6073] mb-2">Solution</legend>

                                    <input
                                        type='url'
                                        name="urlVideoSoluce"
                                        placeholder='Url de la vidéo de la solution'
                                        className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                                        onChange={(e) => setVS(e.target.value)}
                                        autoComplete="off"
                                        defaultValue={vS} />

                                    <input
                                        type='url'
                                        name="urlCodeSoluce"
                                        placeholder='Url du code de la solution'
                                        className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full"
                                        onChange={(e) => setCS(e.target.value)}
                                        autoComplete="off"
                                        defaultValue={cS}
                                        required />

                                    <QuillNoSSRWrapper
                                        className='h-[150px]'
                                        placeholder="Transcript de la vidéo de la solution"
                                        onChange={setTxtSoluce}
                                        defaultValue={txtSoluce} />
                                </fieldset>
                            </div>


                            <div className="rounded-full bg-[#0E6073] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[#0E6073]/80 hover:cursor-pointer text-center" onClick={(e) => { setTab("normal"), setHave(true) }}><p>Valider l'exercice</p></div>

                        </form>
                    </div>}
            </main>
        </>
    );
};

export default Formations;