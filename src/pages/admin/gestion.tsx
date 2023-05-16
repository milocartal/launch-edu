import { type NextPage } from 'next';
import Head from "next/head";
import { FaArrowLeft, FaPenAlt, FaPlay } from "react-icons/fa";

import { api } from "~/utils/api";
import Header from "../components/header";
import { prisma } from '~/server/db';
import { Technologie, Formation, Lecon, Etape, Prisma, EtapeType } from '@prisma/client';
import { SyntheticEvent, useState } from 'react';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

import Title from '~/pages/components/title';

import { BiEdit } from 'react-icons/bi'


const Gestionnaire: NextPage = () => {

    const addtech = api.technologie.create.useMutation()
    const deltech = api.technologie.delete.useMutation()
    const updateTech = api.technologie.update.useMutation()
    const { data: techList } = api.technologie.getAll.useQuery()

    const addType = api.type.create.useMutation()
    const delType = api.type.delete.useMutation()
    const updateType = api.type.update.useMutation()
    const { data: typeList } = api.type.getAll.useQuery()

    const [tab, setTab] = useState("normal")
    const [SearchTag, setSearchTag] = useState('');
    const [SearchType, setSearchForma] = useState('');

    const [selectedTech, setTech] = useState<Technologie>()
    const [selectedType, setType] = useState<EtapeType>()

    const [urlLogo, setLogo] = useState("")

    async function handlerAddTech(event: React.SyntheticEvent) {
        //event.preventDefault()
        const target = event.target as typeof event.target & {
            techName: { value: string };
            logoTech: { value: string };
        };
        const nameT = target.techName.value;
        const logoUrl = target.logoTech.value;
        await addtech.mutateAsync({ name: nameT, url: logoUrl })
    }

    async function handlerAddType(event: React.SyntheticEvent) {
        //event.preventDefault()
        const target = event.target as typeof event.target & {
            typeName: { value: string };
        };
        const nameT = target.typeName.value;
        await addType.mutateAsync({ name: nameT })
    }

    async function handlerModifTech(event: React.SyntheticEvent) {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            techName: { value: string };
            logoTech: { value: string };
        };
        const nameT = target.techName.value;
        const logoUrl = target.logoTech.value;
        if (selectedTech){
            await updateTech.mutateAsync({ id: selectedTech.id, name: nameT, url: logoUrl })
        }
        setTech(undefined)
        window.location.reload()
    }

    async function handlerModifType(event: React.SyntheticEvent) {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            typeName: { value: string };
        };
        const nameT = target.typeName.value;
        if (selectedType){
            await updateType.mutateAsync({ id: selectedType.id, name: nameT })
        }
        setType(undefined)
        window.location.reload()
    }

    const handleSearchTag = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        setSearchTag(value);
    };

    const handleSearchType = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        setSearchForma(value);
    };

    return (
        <>
            <Head>
                <title>Gestionnaire</title>
                <meta name="description" content="Generated by create-t3-app" />
            </Head>

            <main className="flex flex-col h-screen bg-white dark:bg-[#082F38] pl-24 pt-20 pb-10 pr-10 w-full">
                <Title title={"Gestion Technique"} link={"/admin"} />
                <div className='flex w-full justify-between h-[100%] items-center pt-10'>
                    <section className="flex flex-col h-full w-[40%]">
                        <p className="mb-3">Les thématiques:</p>
                        <div className="p-2 flex flex-row justify-center rounded-t-lg bg-[#0E6073] dark:bg-[#05262E] w-full">
                            <div className="bg-white dark:bg-[#041F25] flex flex-row justify-start items-center width w-96 h-12 px-8 rounded-full shadow-[inset_4px_5px_12px_4px_rgba(0,0,0,0.25)]">
                                <HiMagnifyingGlass className="h-8 w-8 text-[#989898] dark:text-[#63AEAB]" />
                                <input type='text' name="lecon tag" placeholder='Rechercher un tag' className="h-10 shadow-none w-full bg-transparent text-black dark:text-white ml-1" autoComplete="off" onChange={handleSearchTag}/>
                            </div>
                        </div>
                        <fieldset className="flex flex-col justify-between max-h-[80%] w-full shadow-xl shadow-black/30 rounded-b-lg">
                            <fieldset className="flex flex-col w-full" id="listTech">
                                {techList as Technologie[] && techList && techList.length > 0 && techList.filter((techno) => { return techno.name.toLowerCase().includes(SearchTag.toLowerCase()) }).map((techno) => {
                                    return (
                                        <label className={`container flex items-center justify-between p-5 hover:bg-[#0e6073]/10`} key={techno.id}>
                                            <p className="">{techno.name}</p>
                                            <div className="flex gap-4">
                                                <div
                                                    onClick={() => {
                                                        setTab('techModif'),
                                                        setTech(techno),
                                                        setLogo(techno.logo)
                                                    }}
                                                    className="rounded-full font-semibold text-red-600 no-underline hover:cursor-pointer">
                                                    <BiEdit className="text-[1.5rem] text-black dark:text-white hover:text-green-500 dark:hover:text-green-500" />
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        deltech.mutateAsync({ id: techno.id });
                                                        window.location.reload()
                                                    }}
                                                    className="rounded-full font-semibold text-red-600 no-underline hover:cursor-pointer">
                                                    <HiXMark className="text-[1.5rem] text-black dark:text-white hover:text-red-500 dark:hover:text-red-500" />
                                                </div>
                                            </div>
                                        </label>
                                    )
                                })}
                            </fieldset>
                            <div className="flex items-center justify-center h-20 w-full bg-[#2ea3a5] text-white hover:cursor-pointer transition hover:bg-[#0e6073] rounded-b-lg" onClick={(e) => setTab("tech")}>
                                + Ajouter une thématique
                            </div>
                        </fieldset>
                    </section>

                    <section className="flex flex-col h-full w-[40%]">
                        <p className="mb-3">Les étapes de cours</p>
                        <div className="p-2 flex flex-row justify-center rounded-t-lg bg-[#0E6073] dark:bg-[#05262E] w-full">
                            <div className="bg-white dark:bg-[#041F25] flex flex-row justify-start items-center width w-96 h-12 px-8 rounded-full shadow-[inset_4px_5px_12px_4px_rgba(0,0,0,0.25)]">
                                <HiMagnifyingGlass className="h-8 w-8 text-[#989898] dark:text-[#63AEAB]" />
                                <input type='text' name="lecon tag" placeholder='Rechercher un tag' className="h-10 shadow-none w-full bg-transparent text-black dark:text-white ml-1" autoComplete="off" onChange={handleSearchType}/>
                            </div>
                        </div>
                        <fieldset className="flex flex-col justify-between max-h-[80%] w-full shadow-xl shadow-black/30 rounded-b-lg">
                            <fieldset className="flex flex-col w-full" id="listTech">
                                {typeList as EtapeType[] && typeList && typeList.length > 0 && typeList.filter((type) => { return type.name.toLowerCase().includes(SearchType.toLowerCase()) }).map((type) => {
                                    return (
                                        <label className={`container flex items-center justify-between p-5 hover:bg-[#0e6073]/10`} key={type.id}>
                                            <p className="">{type.name}</p>
                                            <div className="flex gap-4">
                                                <div
                                                    onClick={() => {
                                                        setTab('typeModif'),
                                                            setType(type)
                                                    }}
                                                    className="rounded-full font-semibold text-red-600 no-underline hover:cursor-pointer">
                                                    <BiEdit className="text-[1.5rem] text-black dark:text-white hover:text-green-500 dark:hover:text-green-500" />
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        delType.mutateAsync({ id: type.id });
                                                        window.location.reload()
                                                    }}
                                                    className="rounded-full font-semibold text-red-600 no-underline hover:cursor-pointer">
                                                    <HiXMark className="text-[1.5rem] text-black dark:text-white hover:text-red-500 dark:hover:text-red-500" />
                                                </div>
                                            </div>

                                        </label>
                                    )
                                })}
                            </fieldset>
                            <div className="flex items-center justify-center h-20 w-full bg-[#2ea3a5] text-white hover:cursor-pointer transition hover:bg-[#0e6073] rounded-b-lg" onClick={(e) => setTab("type")}>
                                + Ajouter une étape de cours
                            </div>
                        </fieldset>
                    </section>
                </div>

                <Header selected={3} />

            </main>

            {tab === "tech" &&
                <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                    <form onSubmit={handlerAddTech} className="relative flex flex-col gap-5 justify-center items-center bg-white dark:bg-[#082F38] rounded-xl p-16 w-[30%]" method="POST">
                        <div onClick={() => { setTab("normal"); setLogo("") }} className="absolute top-3 right-4 rounded-full font-semibold  no-underline transition hover:text-red-500 hover:cursor-pointer">
                            <HiXMark className="text-[2rem] text-[#0e6073] hover:text-red-500" />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-[#0e6073] dark:text-[#1A808C] w-full"><label htmlFor="techName">Nouvelle thématique</label></h1>
                        <input name="techName" id="techName" type="text" placeholder="Nom de la technologie" required className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full" autoComplete="off"></input>
                        <input name="logoTech" id="logoTech" type="url" placeholder="URL du Logo" required className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full" autoComplete="off" onChange={(e) => setLogo(e.target.value)}></input>
                        {urlLogo !== "" && urlLogo.length > 8 ? <img src={urlLogo} className="max-w-[6rem] max-h-[6rem] min-x-[0px] min-h-[0px]" /> : <></>}
                        <button className="rounded-full bg-[#0E6073] text-white px-10 py-3 font-semibold w-full no-underline transition hover:bg-[#0E6073]/20" type="submit">Ajouter</button>

                    </form>
                </div>}


            {tab === "type" &&
                <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                    <form onSubmit={handlerAddType} className="relative flex flex-col gap-5 justify-center items-center bg-white dark:bg-[#082F38] rounded-xl p-16 w-[40%]" method="POST">
                        <div onClick={() => { setTab("normal"); setLogo("") }} className="absolute top-3 right-4 rounded-full font-semibold  no-underline transition hover:text-red-500 hover:cursor-pointer">
                            <HiXMark className="text-[2rem] text-[#0e6073] hover:text-red-500" />

                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-[#0e6073] dark:text-[#1A808C] w-full"><label htmlFor="techName">Nouvelle étape de cours</label></h1>
                        <input name="typeName" id="typeName" type="text" placeholder="Nom de l'étape de cours" className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full" autoComplete="off"></input>
                        <button className="rounded-full bg-[#0E6073] text-white px-10 py-3 font-semibold w-full no-underline transition hover:bg-[#0E6073]/20" type="submit">Ajouter</button>
                    </form>
                </div>}

            {tab === "techModif" &&
                <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                    <form onSubmit={handlerModifTech} className="relative flex flex-col gap-5 justify-center items-center bg-white dark:bg-[#082F38] rounded-xl p-16 w-[30%]" method="POST">
                        <div onClick={() => { setTab("normal"); setTech(undefined) }} className="absolute top-3 right-4 rounded-full font-semibold  no-underline transition hover:text-red-500 hover:cursor-pointer">
                            <HiXMark className="text-[2rem] text-[#0e6073] hover:text-red-500" />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-[#0e6073] dark:text-[#1A808C] w-full"><label htmlFor="techName">Modifier thématique</label></h1>

                        <input
                            name="techName"
                            id="techName"
                            type="text"
                            placeholder="Nom de la technologie"
                            required
                            className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full"
                            autoComplete="off"
                            defaultValue={selectedTech?.name} />

                        <input
                            name="logoTech"
                            id="logoTech"
                            type="url"
                            placeholder="URL du Logo"
                            required
                            className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full"
                            autoComplete="off"
                            onChange={(e) => setLogo(e.target.value)}
                            defaultValue={selectedTech?.logo} />

                        {urlLogo !== "" && urlLogo.length > 8 ? <img src={urlLogo} className="max-w-[6rem] max-h-[6rem] min-x-[0px] min-h-[0px]" /> : <></>}
                        <button className="rounded-full bg-[#0E6073] text-white px-10 py-3 font-semibold w-full no-underline transition hover:bg-[#0E6073]/20" type="submit">Enregistrer</button>

                    </form>
                </div>}


            {tab === "typeModif" &&
                <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                    <form onSubmit={handlerModifType} className="relative flex flex-col gap-5 justify-center items-center bg-white dark:bg-[#082F38] rounded-xl p-16 w-[40%]" method="POST">
                        <div onClick={() => { setTab("normal");  setType(undefined)}} className="absolute top-3 right-4 rounded-full font-semibold  no-underline transition hover:text-red-500 hover:cursor-pointer">
                            <HiXMark className="text-[2rem] text-[#0e6073] hover:text-red-500" />
                        </div>
                        <h1 className="text-xl font-extrabold tracking-tight text-[#0e6073] dark:text-[#1A808C] w-full"><label htmlFor="techName">Modifier type</label></h1>

                        <input
                            name="typeName"
                            id="typeName"
                            type="text"
                            placeholder="Nom de l'étape de cours"
                            className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full"
                            autoComplete="off"
                            defaultValue={selectedType?.name} />

                        <button className="rounded-full bg-[#0E6073] text-white px-10 py-3 font-semibold w-full no-underline transition hover:bg-[#0E6073]/20" type="submit">Enregister</button>
                    </form>
                </div>}


        </>
    );
};

export default Gestionnaire;