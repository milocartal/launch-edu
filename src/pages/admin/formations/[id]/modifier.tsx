import { GetServerSideProps, InferGetServerSidePropsType, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { type Session as SessionAuth } from 'next-auth'

import Router from "next/router";

import { api } from "../../../../utils/api";
import { EtapeType, Session, Technologie, User, Formation, Prisma } from '@prisma/client';

import dynamic from "next/dynamic";
import { MouseEventHandler, useState } from "react";

import { IconContext } from "react-icons";
import { HiArrowSmLeft } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2"
import { HiMagnifyingGlass } from "react-icons/hi2";
import { BiUserCircle } from "react-icons/bi"

import Header from "../../../components/header"
import { prisma } from "~/server/db";

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
    //document.getElementById("defaultOpen").click();
    const [modif, setModif] = useState(false)

    const [content, setContent] = useState(formation.description);
    const [tech, setTechs] = useState<string[]>([])
    const [hidden, setHide] = useState(() => {
        if (formation.hidden == true) {
            return true
        }
        else
            return false
    });

    const [dif, setdif] = useState(() => {
        let difi;
        switch (formation.difficulte) {
            case 1:
                difi = 'débutant';
                break;
            case 2:
                difi = 'intermédiaire'
                break;
            case 3:
                difi = 'avancée'
                break;
            default:
                difi = 'lol'
                break;
        }
        return difi
    })

    const { data: sessionData } = useSession();

    const user = sessionData?.user.admin

    const updateFormation = api.formation.update.useMutation()

    async function handleFormation(event: React.SyntheticEvent) {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            formTitle: { value: string };
            difficulte: { value: string };
        };
        const title = target.formTitle.value;
        const diff: number = +target.difficulte.value;
        await updateFormation.mutateAsync({ id: formation.id, title: title, description: content, difficulte: diff, hide: hidden });
        Router.push(`/admin/formations/${formation.id}`)
    }


    return (
        <>
            <Head>
                <title>Modifier {formation.title}</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/okto.png" />
            </Head>
            {user ? <main className="flex min-h-screen bg-white justify-between dark:bg-[#041F25]">



                <div className="flex w-full max-h-screen ml-[6rem] gap-10 mt-24 mr-10">


                    <form onSubmit={handleFormation} className="pt-34 flex flex-col w-full h-full items-center gap-6 text-[#041f25] dark:text-white" method="POST">

                        <div className="flex gap-4 w-[100%]">
                            <Link href={`/admin/formations/${formation.id}`}><HiArrowSmLeft className="text-[3rem] text-[#0e6073]" /></Link>
                            <h1 className="text-5xl font-extrabold tracking-tight  sm:text-[2.5rem] text-[#0e6073]">Modifier {formation.title}</h1>
                        </div>
                        <fieldset className="w-[50%] flex flex-col gap-7 h-full">
                            <input name="formTitle" id="formTitle" type="text" placeholder="Titre de la formation" required className="inputAddForm" autoComplete="off" defaultValue={formation.title} />

                            <QuillNoSSRWrapper theme="snow" onChange={setContent} placeholder="Description" className="h-[30%] shadow-xl pb-11" defaultValue={formation.description} />
                            <fieldset className="flex gap-5 w-full justify-center">
                                <legend>Difficulté:</legend>
                                <div className="flex flex-col items-center gap-2">
                                    <label htmlFor="1" className="mt-8">Débutant</label>
                                    <input type="radio" name="difficulte" id="1" value="1" required className="shadow-none" defaultChecked={dif === "débutant"} />
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <label htmlFor="2" className="mt-8">Intermédiaire</label>
                                    <input type="radio" name="difficulte" id="2" value="2" required className="shadow-none" defaultChecked={dif === "intermédiaire"} />
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <label htmlFor="3" className="mt-8">Avancé</label>
                                    <input type="radio" name="difficulte" id="3" value="3" required className="shadow-none" defaultChecked={dif === "avancée"} />
                                </div>

                            </fieldset>


                            <div className="w-full flex gap-4 justify-center">
                                <label className="switch">
                                    <input type="checkbox" className="chk" onClick={() => hidden ? setHide(false) : setHide(true)} defaultChecked={hidden === false}/>
                                    <span className="slider"></span>
                                </label>
                                <div className="flex flex-col h-full justify-between">
                                    <label>Private</label>
                                    <label>Publier</label>
                                </div>
                            </div>

                            <button className="rounded-full bg-[#0E6073] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[#0E6073]/80" type="submit" value="submit">Enregistrer les modifications</button>
                        </fieldset>




                    </form>




                </div>

                <Header selected={3} />

            </main> : <img src="https://media.discordapp.net/attachments/688793736620146689/915869475423813662/20210709_215217.gif" alt="Pas Admnin, Ratio"></img>

            }
        </>
    );
};

export default Formations;

