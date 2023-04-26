import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { type Session as SessionAuth } from 'next-auth'

import { api } from "../../../utils/api";
import { EtapeType, Session, Technologie, User, Formation } from '@prisma/client';

import dynamic from "next/dynamic";
import { MouseEventHandler, useState } from "react";

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
    const [tab, setTab] = useState("normal")
    const [selectedTech, setSelectTech] = useState<string>()

    const { data: sessionData } = useSession();

    const user = sessionData?.user.admin

    const addtech = api.technologie.create.useMutation()
    const deltech = api.technologie.delete.useMutation()
    const { data: techList } = api.technologie.getAll.useQuery()

    const addtype = api.type.create.useMutation()
    const deltype = api.type.delete.useMutation()
    const { data: typeList } = api.type.getAll.useQuery()

    const addFormation = api.formation.create.useMutation()
    const delFormation = api.formation.delete.useMutation()
    const { data: formations } = api.formation.getAll.useQuery()


    async function handlerAddTech(event: React.SyntheticEvent) {
        //event.preventDefault()
        const target = event.target as typeof event.target & {
            techName: { value: string };
            logoTech: { value: string };
        };
        const nameT = target.techName.value; // typechecks!
        const logoUrl = target.logoTech.value;
        const techno = await addtech.mutateAsync({ name: nameT, url: logoUrl })
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
        //console.log("Info Ta mere ",title," ", content," ", diff," ", techno)
        await addFormation.mutateAsync({ title: title, description: content, difficulte: diff, techno: techno })
    }

    async function normal(event: React.SyntheticEvent) {
        setTab('normal')
    }
    async function techAdd(event: React.SyntheticEvent) {
        setTab('tech')
    }


    return (
        <>
            <Head>
                <title>Créer une Formation</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/okto.png" />
            </Head>
            {user ? <main className="flex min-h-screen bg-white justify-between">

                <div className="fixed w-full pr-40 border-b-4 border-[#63aeab] bg-white top-0 right-0 left-28 h-[4rem]" />
                <div className="flex item-center justify-start gap-12 fixed w-full pr-40  top-0 right-0 left-28 h-[4rem] text-[#63aeab]">
                    <button className="px-10 py-3 font-semibold border-[#0E6073] transition hover:border-b-4 hover:text-[#0E6073]">Vos Cours</button>
                    <button className="px-10 py-3 font-semibold  border-[#0E6073] transition hover:border-b-4 hover:text-[#0E6073]">Explorer</button>
                    <button className="px-10 py-3 font-semibold  border-[#0E6073] border-b-4 text-[#0E6073]" autoFocus>Gérez les cours</button>
                    {sessionData && sessionData.user?.image && <Link href={`/components/users/${sessionData.user.id}`}><img src={sessionData.user.image} className="max-w-[3rem]"></img></Link>}
                </div>
                <div className="flex flex-col items-center justify-between gap-2 min-h-screen top-0 left-0 bg-[#0E6073] fixed m-w-xs p-2">
                    <Link href="/"><img src="/okto.png" className="max-w-[3rem]"></img></Link>
                    <AuthShowcase />
                </div>


                <div className="flex w-full max-h-screen ml-[6rem] gap-10 mt-24 mr-10">


                    <form onSubmit={handleFormation} className="flex justify-center gap-[15%] item-center w-full h-full text-[#041f25]" method="POST">
                        <fieldset className="flex flex-col max-h-[70%] w-[40%]">
                            <div className="flex gap-4 w-[100%] mb-10">
                                <Link href="/components/admin/main"><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#0e6073" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                </svg></Link>
                                <h1 className="text-5xl font-extrabold tracking-tight  sm:text-[2.5rem] text-[#0e6073]">Créer une formation</h1>
                            </div>
                            <fieldset className="flex flex-col justify-between h-full w-full shadow-xl shadow-black/30 rounded-lg">
                                <fieldset className="flex flex-col w-full rounded-t-lg" id="listTech">
                                    {techList as Technologie[] && techList && techList.length > 0 && techList.map((techno) => {
                                        return (
                                            <label className={`container flex items-center justify-between p-5 ${selectedTech === techno.id ? 'bg-[#0e6073] text-white' : ''}`} key={techno.id}>
                                                <p className="">{techno.name}</p>
                                                <div className="flex gap-4">
                                                    <input type="radio" name="techno" value={techno.id} onChange={(e) => setSelectTech(e.target.value)} required className="mt-[7px]" />
                                                    <button
                                                        onClick={() => {
                                                            deltech.mutateAsync({ id: techno.id });
                                                            window.location.reload()
                                                        }}
                                                        className="rounded-full bg-[#0E6073]/10 px-3 py-1 font-semibold text-red-600 no-underline transition hover:bg-[#0E6073]/20">
                                                        x
                                                    </button>
                                                </div>

                                            </label>
                                        )
                                    })}
                                </fieldset>
                                <div className="flex items-center justify-center h-[5rem] w-full bg-[#2ea3a5] text-white hover:cursor-pointer transition hover:bg-[#0e6073] rounded-b-lg" onClick={(e) => setTab("tech")}>
                                    + Ajouter une technologie
                                </div>
                            </fieldset>
                        </fieldset>

                        <fieldset className="flex flex-col gap-6 justify-center item-center w-[60%] h-full ">
                            <input name="formTitle" id="formTitle" type="text" placeholder="Titre de la formation" required className="inputAddForm" autoComplete="off" />

                            <QuillNoSSRWrapper theme="snow" onChange={setContent} placeholder="Description" className="h-[30%] shadow-xl pb-11" />
                            <fieldset className="mt-8 flex">
                                <legend>Choisir la difficulté:</legend>

                                <label htmlFor="1" className="mt-8">débutant</label>
                                <input type="radio" name="difficulte" id="1" value="1" required className="shadow-none" />

                                <label htmlFor="2" className="mt-8">normal</label>
                                <input type="radio" name="difficulte" id="2" value="2" required className="shadow-none" />

                                <label htmlFor="3" className="mt-8">hard</label>
                                <input type="radio" name="difficulte" id="3" value="3" required className="shadow-none" />
                            </fieldset>



                            <div className="flex gap-2">
                                <input type="checkbox" id="hid" name="hid" required className="shadow-none" /><label htmlFor="hid"> En cochant cette case, vous êtes au courant que la formation créée sera invisible pour les utilisateurs.</label>
                            </div>
                            <button className="rounded-full bg-[#0E6073] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[#0E6073]/20" type="submit" value="submit">Créer la formation</button>
                        </fieldset>


                    </form>

                    {tab === "tech" &&
                        <div className="fixed w-full h-full bg-[#0E6073]/90 top-0 right-0 left-0 bottom-0 flex justify-center items-center">
                            <form onSubmit={handlerAddTech} className="relative flex flex-col gap-5 item-center justify-start bg-white rounded-xl p-16 w-[30%]" method="POST">
                                <button onClick={normal} className="absolute top-3 right-4 rounded-full font-semibold  no-underline transition hover:text-red-500">
                                    <svg width="15" height="15" viewBox="20 0 10 50" overflow="visible" stroke="#0e6073" stroke-width="10" stroke-linecap="round" className="hover:stroke-red-500">
                                        <line x2="50" y2="50" />
                                        <line x1="50" y2="50" />
                                    </svg>
                                </button>
                                <h1 className="text-xl font-extrabold tracking-tight text-[#0e6073] "><label htmlFor="techName">Nouvelle thématique</label></h1>
                                <input name="techName" id="techName" type="text" placeholder="Nom de la technologie" required className="inputAddForm" autoComplete="off"></input>
                                <input name="logoTech" id="logoTech" type="url" placeholder="URL du Logo" required className="inputAddForm" autoComplete="off"></input>
                                <button className="rounded-full bg-[#0E6073] text-white px-10 py-3 font-semibold  no-underline transition hover:bg-[#0E6073]/20" type="submit">Ajouter</button>

                            </form>
                        </div>}


                </div>


            </main> : <img src="https://media.discordapp.net/attachments/688793736620146689/915869475423813662/20210709_215217.gif" alt="Pas Admnin, Ratio"></img>

            }
        </>
    );
};

export default Admin;

const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();

    return (
        <button
            className="rounded-full px-3 py-3 font-semibold  no-underline transition hover:bg-white/10"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
            {sessionData ? <img src="/arrow.png" className="max-w-[1.5rem]"></img> : "Sign in"}
        </button>
    );
};
