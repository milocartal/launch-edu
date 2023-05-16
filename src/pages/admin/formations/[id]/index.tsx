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
import { SyntheticEvent, useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { RiAddFill } from 'react-icons/ri'
import Lesson from '~/pages/components/lesson';
import Title from '~/pages/components/title';

type FormationWithAll = Prisma.FormationGetPayload<{
    include: {
        techs: true,
        lecons: {
            include: {
                etapes: true,
                Progression: true
            }
        },
        Prerequis: {
            include: {
                techs: true,
                Progression: true
            }
        },
        Progression: true
    }
}>

type LeconWithEtapes = Prisma.LeconGetPayload<{
    include: { etapes: true, Progression: true }
}>

export const getServerSideProps: GetServerSideProps<{
    formation: FormationWithAll;
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
                    etapes: true,
                    Progression: true
                }
            },
            Prerequis: {
                include: {
                    techs: true,
                    Progression: true,
                }
            },
            Progression: true
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
            formation: JSON.parse(JSON.stringify(formation)) as FormationWithAll
        }
    };
};

const Formations: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ formation }) => {

    const delFormation = api.formation.delete.useMutation()

    const delLecon = api.lecon.delete.useMutation()

    const addTag = api.formation.addTag.useMutation()
    const delTag = api.formation.removeTag.useMutation()

    const addPre = api.formation.addPrerequis.useMutation()
    const delPre = api.formation.removePrerequis.useMutation()

    const [selectedTech, setSelectTech] = useState<string>()
    const { data: techList } = api.technologie.getAll.useQuery()
    const { data: formaList } = api.formation.getAll.useQuery()

    const [tab, setTab] = useState("normal")
    const [SearchTag, setSearchTag] = useState('');
    const [SearchForma, setSearchForma] = useState('');

    async function handleTag(event: React.SyntheticEvent) {
        //event.preventDefault()
        const target = event.target as typeof event.target & {
            techno: { value: string };
        };
        const idT = target.techno.value;

        await addTag.mutateAsync({ id: formation.id, idT: idT })
    }

    async function handlePrerequis(event: React.SyntheticEvent) {
        //event.preventDefault()
        const target = event.target as typeof event.target & {
            prerequis: { value: string };
        };
        const idP = target.prerequis.value;

        await addPre.mutateAsync({ id: formation.id, idP: idP })
    }

    const handleSearchTag = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        setSearchTag(value);
    };

    const handleSearchForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        setSearchForma(value);
    };

    async function handleProg(e: React.SyntheticEvent){
        e.preventDefault()
    }

    return (
        <>
            <Head>
                <title>{formation.title}</title>
                <meta name="description" content="Generated by create-t3-app" />
            </Head>

            <main className="flex min-h-screen h-screen bg-white dark:bg-[#082F38] pl-24 pt-20 pb-10 w-full justify-between">

                <section className='w-6/12 h-full flex flex-col justify-between items-center'>
                    <div className="flex flex-col gap-5 w-full">
                        <Title title={formation.title} link={'/admin'} />
                        <div className="flex flex-col items-center w-full overflow-y-auto max-h-[33rem] scrollbar-hide">
                            <div className="flex flex-row items-center justify-between w-full">
                                <h1 className="text-xl font-bold tracking-tight text-[#0E6073] dark:text-[#1A808C]">Description</h1>
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
                                    <h1 className="text-xl font-bold tracking-tight text-[#0E6073] dark:text-[#1A808C]">Thématique(s)</h1>
                                    <RiAddFill className='text-[#0E6073] text-2xl hover:cursor-pointer hover:text-green-600' onClick={() => setTab("tag")} />
                                </div>

                                <div className="w-11/12 grid grid-cols-1 gap-4 sm:grid-cols-4 w-full max-h-[7rem] pt-2 scrollbar-hide">
                                    {formation.techs as Technologie[] && formation.techs.length > 0 && formation.techs.map((tech) => {
                                        return (
                                            <button
                                                className="w-full flex justify-center py-5 shadow-md mt-1 bg-[#2ea3a5] text-white font-bold tracking-tight rounded-lg hover:bg-[#0e6073]"
                                                onClick={() => {
                                                    delTag.mutateAsync({ id: formation.id, idT: tech.id });
                                                    window.location.reload()
                                                }}
                                                key={tech.id}>
                                                {tech.name}
                                            </button>)
                                    })}
                                </div>
                            </div>
                            <div className="flex flex-col w-full my-10">
                                <div className='w-full flex justify-between pb-4'>
                                    <h1 className="text-xl font-bold tracking-tight text-[#0E6073] dark:text-[#1A808C]">Prérequis(s)</h1>
                                    <RiAddFill className='text-[#0E6073] text-2xl hover:cursor-pointer hover:text-green-600' onClick={() => setTab("Prerequis")} />
                                </div>

                                <div className="w-11/12 grid grid-cols-1 gap-10 sm:grid-cols-2 w-full max-h-[12rem] pt-7">
                                    {formation.Prerequis as FormationWithAll[] && formation.Prerequis.length > 0 && formation.Prerequis.map((requis) => {
                                        return (
                                            <Lesson data={requis as FormationWithAll} />)
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href={`/admin/formations/${formation.id}/modifier`} className="h-[5rem] w-5/6 text-white bg-[#0e6073] rounded-lg flex items-center justify-center hover:cursor-pointer transition hover:bg-[#0E6073]/80">Modifier la formation</Link>

                </section>


                <aside className="w-5/12 right-0 flex flex-col items-center justify-start h-5/6 pt-10 mr-5">
                    <h1 className="text-xl font-bold tracking-tight text-[#0E6073] dark:text-[#1A808C] self-start mb-3">Leçon(s) dans la formation</h1>
                    <div className="flex flex-col max-h-full w-11/12 shadow-xl shadow-black/30 rounded-lg">
                        <div className="flex flex-col w-full rounded-t-lg max-h-[50rem] overflow-y-scroll" id="listTech">
                            {formation.lecons as LeconWithEtapes[] && formation.lecons.length > 0 && formation.lecons.map((lecon) => {
                                return (
                                    <Link href={`/admin/lecons/${lecon.id}`} className="w-full flex flex-row justify-between px-24 py-6 bg-white dark:bg-[#041F25] shadow-md mt-1 transition hover:bg-[#0E6070]/20" key={lecon.id}>
                                        <p className="text-base font-bold tracking-tight text-[#0E6073] self-start">{lecon.title}</p>
                                        <p className="ml-2 text-sm font-Inter text-[#989898]">{lecon.etapes.length} étape(s)</p>
                                        <button
                                            onClick={() => {
                                                delLecon.mutateAsync({ id: lecon.id });
                                                window.location.reload()
                                            }}
                                            className="rounded-full font-semibold text-red-600 no-underline">
                                            <HiXMark className="text-[1.5rem] text-black dark:text-white hover:text-red-500 dark:hover:text-red-500" />
                                        </button>
                                    </Link>)
                            })}
                        </div>
                        <Link href={`/admin/formations/${formation.id}/addLesson`} className="flex items-center justify-center h-32 max-h-20 w-full bg-[#2ea3a5] text-white hover:cursor-pointer transition hover:bg-[#0e6073] rounded-b-lg">
                            + Ajouter une leçon
                        </Link>
                    </div>
                    <button onClick={() => { delFormation.mutateAsync({ id: formation.id }); window.location.reload() }} className='mt-6 text-red-600 hover:text-red-800'>Supprimer cette formation</button>
                </aside>
                <Header selected={3} />

            </main>

            {tab === "tag" &&
                <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                    <form onSubmit={handleTag} className="relative flex flex-col gap-5 justify-center items-center bg-white rounded-xl p-16 max-h-[90%] w-[30%]" method="POST">
                        <div onClick={() => setTab("normal")} className="absolute top-3 right-4 rounded-full font-semibold  no-underline transition hover:text-red-500 hover:cursor-pointer">
                            <HiXMark className="text-[2rem] text-[#0e6073] hover:text-red-500" />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-[#0e6073] w-full"><label htmlFor="techName">Nouveau Tag</label></h1>
                        <input type='text' name="formationTag" placeholder='Rechercher un tag' className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full" autoComplete="off" onChange={handleSearchTag} />
                        <fieldset className="flex flex-col w-full h-96 rounded-t-lg overflow-hidden" id="listTech">
                            {techList as Technologie[] && techList && techList.length > 0 && techList.filter((tech) => {
                                return !formation.techs.find((item => {
                                    return item.name === tech.name
                                }))
                            }).filter((tech) => {
                                return tech.name.toLowerCase().includes(SearchTag.toLowerCase())
                            }).map((techno) => {
                                return (
                                    <label className={`container flex items-center justify-between p-5 ${selectedTech === techno.id ? 'bg-[#0e6073] text-white' : 'hover:bg-[#0e6073]/10'}`} key={techno.id}>
                                        <p className="">{techno.name}</p>
                                        <div className="flex gap-4">
                                            <input type="radio" name="techno" value={techno.id} onChange={(e) => setSelectTech(e.target.value)} required className="mt-[7px]" />
                                        </div>

                                    </label>
                                )
                            })}
                        </fieldset>
                        <button className="rounded-full bg-[#0E6073] text-white px-10 py-3 font-semibold w-full no-underline transition hover:bg-[#0E6073]/20" type="submit">Ajouter</button>


                    </form>
                </div>}


            {tab === "Prerequis" &&
                <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                    <form onSubmit={handlePrerequis} className="relative flex flex-col gap-5 justify-center items-center bg-white rounded-xl p-16 max-h-[90%] w-[40%]" method="POST">
                        <div onClick={() => setTab("normal")} className="absolute top-3 right-4 rounded-full font-semibold  no-underline transition hover:text-red-500 hover:cursor-pointer">
                            <HiXMark className="text-[2rem] text-[#0e6073] hover:text-red-500" />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-[#0e6073] w-full"><label htmlFor="techName">Nouveau Prérequis</label></h1>
                        <input type='text' name="prerequis" placeholder='Rechercher une formation' className="p-[1rem] rounded-lg bg-none shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full" autoComplete="off" onChange={handleSearchForm} />
                        <fieldset className="flex flex-col w-full max-h-[30rem] h-96 rounded-t-lg" id="listTech">
                            {formaList as Formation[] && formaList && formaList.length > 0 && formaList.filter((forma) => {
                                return !formation.Prerequis.find((item => {
                                    return item.title === forma.title
                                }))
                            }).filter((forma) => { return forma.title !== formation.title }).filter((forma) => {
                                return forma.title.toLowerCase().includes(SearchForma.toLowerCase())
                            }).map((forma) => {
                                return (
                                    <label className={`container flex items-center justify-between p-5 ${selectedTech === forma.id ? 'bg-[#0e6073] text-white' : 'hover:bg-[#0e6073]/10'}`} key={forma.id}>
                                        <p className="">{forma.title}</p>
                                        <div className="flex gap-4">
                                            <input type="radio" name="prerequis" value={forma.id} onChange={(e) => setSelectTech(e.target.value)} required className="mt-[7px]" />
                                        </div>

                                    </label>
                                )
                            })}
                        </fieldset>
                        <button className="rounded-full bg-[#0E6073] text-white px-10 py-3 font-semibold w-full no-underline transition hover:bg-[#0E6073]/20" type="submit">Ajouter</button>


                    </form>
                </div>}


        </>
    );
};

export default Formations;