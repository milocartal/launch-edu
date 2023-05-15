import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { type Session as SessionAuth } from 'next-auth'

import { api } from "~/utils/api";
import { EtapeType, Formation, Session, Technologie, User } from "@prisma/client";
import { DifficultyText } from "~/pages/components/difficulties"
import Header from "../components/header"

import dynamic from "next/dynamic";
import { MouseEventHandler, useEffect, useState } from "react";

import { HiXMark } from "react-icons/hi2"
import { HiMagnifyingGlass } from "react-icons/hi2";
import { BiUserCircle } from "react-icons/bi"
import { FaLock, FaLockOpen, FaPenAlt } from "react-icons/fa";
import Title from "../components/title";

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
    const { data: sessionData } = useSession();

    const admin = sessionData?.user.admin

    const { data: formations } = api.formation.getAll.useQuery()
    const { data: technologies } = api.technologie.getAll.useQuery()

    const [filterType, setFilterType] = useState("")

    formations as Formation[] && formations && formations.length > 0 && filterType == "theme" ? formations?.sort(function (a, b) {
        if (a.techs[0]!.name < b.techs[0]!.name) {
            return -1;
        }
        if (a.techs > b.techs) {
            return 1;
        }
        return 0;
    }) : formations as Formation[] && formations && formations.length > 0 && filterType == "sanslecon" ? formations?.sort(function (a, b) {
        return a.lecons.length - b.lecons.length;
    }) : formations as Formation[] && formations && formations.length > 0 && filterType == "private" && formations?.sort(function (a, b) {
        return b.hidden - a.hidden;
    })

    function changeFilterType(type: string) {
        setFilterType(type)
    }

    return (
        <>
            <Head>
                <title>Administration</title>
                <meta name="description" content="Generated by create-t3-app" />
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
                </style>
            </Head>
            {admin ?

                <main className="flex min-h-screen bg-white justify-between dark:bg-[#082F38] pb-12">
                    <div className="w-3/12 bg-[#0E6073] fixed right-0 flex flex-col items-center justify-between h-full pt-36 pb-14 px-5">
                        <div>
                            <div className="flex flex-row justify-center items-center">
                                <h3 className="text-[130px] font-Inter text-[#63AEAB]/30 leading-none">{formations?.length}</h3>
                                <p className="text-2xl font-Inter text-white absolute">Cours créés</p>
                            </div>
                            <div className="flex flex-row justify-center items-center">
                                <h3 className="text-[130px] font-Inter text-[#63AEAB]/30 leading-none">{technologies?.length}</h3>
                                <p className="text-2xl font-Inter text-white absolute">Thématiques</p>
                            </div>
                        </div>
                        <div className="w-full">
                            <Link href={"/admin/gestion"} className="flex justify-center items-center text-white bg-[#2EA3A5] h-14 rounded-full hover:bg-[#1e818c] mb-3">
                                Gestion technique
                            </Link>
                            <Link href={"/admin/addFormation"} className="flex justify-center items-center text-white bg-[#2EA3A5] h-14 rounded-full hover:bg-[#1e818c]">
                                Créer une formation
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col items-start justify-start gap-12 pl-28 pt-20 pr-6 w-9/12">
                        <div className="flex flex-row items-center justify-between w-full">
                            <Title title={"Gérez vos cours"} link={""} />
                            <div className="flex flex-row items-center justify-evenly">
                                <p className="mr-2">Trier par : </p>
                                {filterType === "theme" ? <button className="px-4 py-1 bg-[#0E6073] rounded-full mx-1" onClick={() => changeFilterType("theme")}>
                                    <p className="text-[#fff]">Thématique</p>
                                </button> :
                                <button className="px-4 py-1 bg-[#D9D9D9] dark:bg-[#041F25] rounded-full mx-1" onClick={() => changeFilterType("theme")}>
                                    <p className="text-[#0E6073] dark:text-[#0E6073]">Thématique</p>
                                </button>
                                }
                                {filterType === "sanslecon" ? <button className="px-4 py-1 bg-[#0E6073] rounded-full mx-1" onClick={() => changeFilterType("sanslecon")}>
                                    <p className="text-[#fff]">Sans leçons</p>
                                </button> :
                                <button className="px-4 py-1 bg-[#D9D9D9] dark:bg-[#041F25] rounded-full mx-1" onClick={() => changeFilterType("sanslecon")}>
                                    <p className="text-[#0E6073] dark:text-[#0E6073]">Sans leçons</p>
                                </button>
                                }
                                {filterType === "private" ? <button className="px-4 py-1 bg-[#0E6073] rounded-full mx-1" onClick={() => changeFilterType("private")}>
                                    <p className="text-[#fff]">Privées</p>
                                </button> :
                                <button className="px-4 py-1 bg-[#D9D9D9] dark:bg-[#041F25] rounded-full mx-1" onClick={() => changeFilterType("private")}>
                                <p className="text-[#0E6073] dark:text-[#0E6073]">Privées</p>
                                </button>}
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            {formations as Formation[] && formations && formations.length > 0 && formations.map((forma) => {
                                let hide: string;
                                if (forma.hidden)
                                    hide = "Non publiée"
                                else
                                    hide = "Publiée"
                                return (
                                    <Link
                                        className="flex flex-row justify-between items-center mb-1 w-full bg-white dark:bg-[#041F25] shadow-[4px_5px_12px_6px_rgba(0,0,0,0.25)] py-2 pl-16 pr-6 justify-between hover:bg-[#ebebeb]/20 dark:hover:bg-[#083039] h-[5rem]"
                                        href={`/admin/formations/${encodeURIComponent(forma.id)}`}
                                        key={forma.id}
                                    >
                                        <span className="flex flex-row items-center justify-between">
                                            {forma.hidden ? <FaLock className="h-4 w-4 text-[#0E6073]" /> : <FaLockOpen className="h-4 w-4 text-[#989898]" />}
                                            <p className="text-base ml-3 font-bold text-[#0E6073]">{forma.title}</p>
                                        </span>

                                        <span className="flex flex-row items-center justify-between w-5/12">
                                            <DifficultyText level={forma.difficulte} />
                                            <span className="flex flex-row items-center">
                                                <FaPenAlt className="h-6 w-6 text-[#989898]" />
                                                <p className="ml-2 text-sm font-Inter text-[#989898]">{forma.lecons.length} leçon(s)</p>
                                            </span>
                                            <div className="w-[5rem] h-[5rem] flex flex-row justify-center items-center">
                                                {forma.techs && forma.techs[0] && forma.techs[0].logo && <img src={forma.techs[0].logo} alt="" className="max-h-[4rem] max-w-[4rem]" />}
                                            </div>
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                    <Header selected={3} />


                </main> : <img src="https://media.discordapp.net/attachments/688793736620146689/915869475423813662/20210709_215217.gif" alt="Pas Admnin, Ratio"></img>

            }
        </>
    );
};

export default Admin;