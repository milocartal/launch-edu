import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { type Session as SessionAuth } from 'next-auth'

import { api } from "~/utils/api";
import { EtapeType, Formation, Session, Technologie, User } from "@prisma/client";
import { EasyText, MedText, HardText } from "~/pages/components/difficulties"
import Header from "../components/header"

import dynamic from "next/dynamic";
import { MouseEventHandler, useState } from "react";

import { HiXMark } from "react-icons/hi2"
import { HiMagnifyingGlass } from "react-icons/hi2";
import { BiUserCircle } from "react-icons/bi"

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
    const [tab, setTab] = useState("tech")

    const { data: sessionData } = useSession();

    const admin = sessionData?.user.admin

    const addFormation = api.formation.create.useMutation()
    const delFormation = api.formation.delete.useMutation()
    const { data: formations } = api.formation.getAll.useQuery()

    return (
        <>
            <Head>
                <title>Administration</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/okto.png" />
            </Head>
            {admin ?

                <main className="flex min-h-screen bg-white justify-between dark:bg-[#041F25]">
                    <div className="flex flex-col items-center justify-between gap-2 min-h-screen pt-16 right-0 bg-[#0E6073] fixed m-w-xs p-2 w-[28rem]">
                        <Link href="/admin/addFormation"><button>Créer une formation</button></Link>
                    </div>

                    <div className="flex w-full max-h-screen flex-col items-center ml-[6rem] mt-[6rem] mr-[30rem]">
                        <div className="flex flex-col w-full">
                            {formations as Formation[] && formations && formations.length > 0 && formations.map((forma) => {
                                let hide: string;
                                if (forma.hidden)
                                    hide = "Non postée"
                                else
                                    hide = "Postée"
                                return (
                                    <Link
                                        className="flex w-full gap-4 rounded-xl bg-[#0E6070]/10 p-4 justify-between hover:bg-[#0E6070]/20"
                                        href={`/admin/formations/${encodeURIComponent(forma.id)}`}
                                        key={forma.id}
                                    >
                                        <h3 className="text-md font-bold">{forma.title}</h3>

                                        <span className="text-lg">
                                            {forma.difficulte === 1 && <EasyText />}
                                            {forma.difficulte === 2 && <MedText />}
                                            {forma.difficulte === 3 && <HardText />}
                                        </span>
                                        <span className="text-lg">
                                            {hide}
                                        </span>
                                        <button
                                            onClick={() => {
                                                delFormation.mutateAsync({ id: forma.id });
                                                window.location.reload()
                                            }}
                                            className="rounded-full px-3 py-1 font-semibold no-underline">
                                            <HiXMark className="text-[2rem] text-[#0e6073] hover:text-red-500" />
                                        </button>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                    <Header selected={3}/>


                </main> : <img src="https://media.discordapp.net/attachments/688793736620146689/915869475423813662/20210709_215217.gif" alt="Pas Admnin, Ratio"></img>

            }
        </>
    );
};

export default Admin;

const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();

    return (
        <div>
            {sessionData ?
                <button className="rounded-full px-3 py-3 font-semibold  no-underline transition hover:bg-white/10" onClick={() => void signOut()}>
                    <img src="/arrow.png" className="max-w-[1.5rem]"></img>
                </button> :
                <button className="rounded-full px-2 py-3 font-semibold  no-underline transition hover:bg-white/10" onClick={() => void signIn()}>
                    <BiUserCircle className="text-[2rem] text-white" />
                </button>}
        </div>

    );
};
