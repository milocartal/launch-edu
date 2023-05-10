import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { type Session as SessionAuth } from 'next-auth'

import { api } from "../../utils/api";
import { EtapeType, Session, Technologie, User, Formation } from '@prisma/client';

import dynamic from "next/dynamic";
import { MouseEventHandler, useState } from "react";

import { IconContext } from "react-icons";
import { HiArrowSmLeft } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2"
import { HiMagnifyingGlass } from "react-icons/hi2";
import { BiUserCircle } from "react-icons/bi"

import Header from "../components/header"

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

export const getServerSideProps: GetServerSideProps<{
    session: SessionAuth;
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

    return {
        props: { session }
    }
};

const Admin: NextPage = () => {
    //document.getElementById("defaultOpen").click();

    const [content, setContent] = useState('');
    const [hidden, setHide] = useState(true);
    const [tab, setTab] = useState("normal")
    const [selectedTech, setSelectTech] = useState<string>()
    const [urlLogo, setLogo] = useState("")
    const [SearchTag, setSearchTag] = useState('');

    const { data: sessionData } = useSession();

    const user = sessionData?.user.admin

    const addtech = api.technologie.create.useMutation()
    const deltech = api.technologie.delete.useMutation()
    const { data: techList } = api.technologie.getAll.useQuery()

    const addFormation = api.formation.create.useMutation()

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

    async function handleFormation(event: React.SyntheticEvent) {
        //event.preventDefault()
        const target = event.target as typeof event.target & {
            formTitle: { value: string };
            description: { value: string };
            difficulte: { value: string };
            techno: { value: string }
        };
        const title = target.formTitle.value;
        //const desc = target.description.value;
        const diff: number = +target.difficulte.value;
        const techno = target.techno.value;

        await addFormation.mutateAsync({ title: title, description: content, difficulte: diff, techno: techno, hide: hidden })
    }

    const handleSearchTag = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        setSearchTag(value);
    };

    return (
        <>
            <Head>
                <title>Créer une Formation</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/okto.png" />
            </Head>
            {user ? <main className="flex min-h-screen bg-white justify-between dark:bg-[#041F25]">



                <div className="flex w-full max-h-screen ml-[6rem] gap-10 mt-24 mr-10">


                    <form onSubmit={handleFormation} className="flex justify-center gap-[15%] item-center w-full h-full text-[#041f25] dark:text-white" method="POST">
                        <fieldset className="flex flex-col max-h-[70%] w-[40%]">
                            <div className="flex gap-4 w-[100%] mb-10">
                                <Link href="/admin"><HiArrowSmLeft className="text-[3rem] text-[#0e6073]" /></Link>
                                <h1 className="text-5xl font-extrabold tracking-tight  sm:text-[2.5rem] text-[#0e6073]">Créer une formation</h1>
                            </div>
                            <p className="mb-3">Choisir une thématique:</p>
                            <input type='text' name="lecon tag" placeholder='Rechercher un tag' className="p-[1rem] rounded-t-lg bg-none shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)] w-full" autoComplete="off" onChange={handleSearchTag} />
                            <fieldset className="flex flex-col justify-between h-full w-full shadow-xl shadow-black/30 rounded-b-lg">
                                <fieldset className="flex flex-col w-full rounded-t-lg" id="listTech">
                                    {techList as Technologie[] && techList && techList.length > 0 && techList.map((techno) => {
                                        return (
                                            <label className={`container flex items-center justify-between p-5 ${selectedTech === techno.id ? 'bg-[#0e6073] text-white' : 'hover:bg-[#0e6073]/10'}`} key={techno.id}>
                                                <p className="">{techno.name}</p>
                                                <div className="flex gap-4">
                                                    <input type="radio" name="techno" value={techno.id} onChange={(e) => setSelectTech(e.target.value)} required className="mt-[7px]" />
                                                    <div
                                                        onClick={() => {
                                                            deltech.mutateAsync({ id: techno.id });
                                                            window.location.reload()
                                                        }}
                                                        className="rounded-full font-semibold text-red-600 no-underline hover:cursor-pointer">
                                                        <HiXMark className="text-[1.5rem] text-black hover:text-red-500" />
                                                    </div>
                                                </div>

                                            </label>
                                        )
                                    })}
                                </fieldset>
                                <div className="flex items-center justify-center h-[5rem] w-full bg-[#2ea3a5] text-white hover:cursor-pointer transition hover:bg-[#0e6073] rounded-b-lg" onClick={(e) => setTab("tech")}>
                                    + Ajouter une nouvelle technologie
                                </div>
                            </fieldset>
                        </fieldset>

                        <fieldset className="flex flex-col gap-6 justify-center item-center w-[60%] h-full ">
                            <input name="formTitle" id="formTitle" type="text" placeholder="Titre de la formation" required className="inputAddForm" autoComplete="off" />

                            <QuillNoSSRWrapper theme="snow" onChange={setContent} placeholder="Description" className="h-[30%] shadow-xl pb-11" />
                            <fieldset className="mt-8 flex gap-5 w-full justify-center">
                                <legend>Difficulté:</legend>
                                <div className="flex flex-col items-center gap-2">
                                    <label htmlFor="1" className="mt-8">Débutant</label>
                                    <input type="radio" name="difficulte" id="1" value="1" required className="shadow-none" />
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <label htmlFor="2" className="mt-8">Intermédiaire</label>
                                    <input type="radio" name="difficulte" id="2" value="2" required className="shadow-none" defaultChecked/>
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <label htmlFor="3" className="mt-8">Avancé</label>
                                    <input type="radio" name="difficulte" id="3" value="3" required className="shadow-none" />
                                </div>

                            </fieldset>


                            <div className="flex gap-2">
                                <label className="switch">
                                    <input type="checkbox" onClick={() => hidden ? setHide(false) : setHide(true)} />
                                    <span className="slider round"></span>
                                </label>
                                <label>Publier</label>
                            </div>

                            <button className="rounded-full bg-[#0E6073] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[#0E6073]/80" type="submit" value="submit">Créer la formation</button>
                        </fieldset>


                    </form>

                    


                </div>

            <Header selected={3}/>

            {tab === "tech" &&
                        <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                            <form onSubmit={handlerAddTech} className="relative flex flex-col gap-5 justify-center items-center bg-white rounded-xl p-16 w-[30%]" method="POST">
                                <div onClick={()=> {setTab("normal"); setLogo("")}} className="absolute top-3 right-4 rounded-full font-semibold  no-underline transition hover:text-red-500 hover:cursor-pointer">
                                    <HiXMark className="text-[2rem] text-[#0e6073] hover:text-red-500" />
                                </div>
                                <h1 className="text-xl font-extrabold tracking-tight text-[#0e6073] w-full"><label htmlFor="techName">Nouvelle thématique</label></h1>
                                <input name="techName" id="techName" type="text" placeholder="Nom de la technologie" required className="inputAddForm w-full" autoComplete="off"></input>
                                <input name="logoTech" id="logoTech" type="url" placeholder="URL du Logo" required className="inputAddForm w-full" autoComplete="off" onChange={(e)=>setLogo(e.target.value)}></input>
                                {urlLogo !== "" && urlLogo.length > 8 ? <img src={urlLogo} className="max-w-[6rem] max-h-[6rem] min-x-[0px] min-h-[0px]"/>:<></>}
                                <button className="rounded-full bg-[#0E6073] text-white px-10 py-3 font-semibold w-full no-underline transition hover:bg-[#0E6073]/20" type="submit">Ajouter</button>
                                

                            </form>
                        </div>}

            </main> : <img src="https://media.discordapp.net/attachments/688793736620146689/915869475423813662/20210709_215217.gif" alt="Pas Admnin, Ratio"></img>

            }
        </>
    );
};

export default Admin;

