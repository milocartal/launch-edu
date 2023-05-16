import { GetServerSideProps, InferGetServerSidePropsType, type NextPage } from 'next';
import Head from "next/head";
import { Difficulty, DifficultyText } from "~/pages/components/difficulties"
import { FaPenAlt, FaCheck, FaPlay } from "react-icons/fa";

import Header from './components/header';
import { useState } from 'react';
import Title from './components/title';
import { api } from '~/utils/api';
import { Formation, Technologie, Progression, Prisma } from '@prisma/client';
import { getSession, useSession } from 'next-auth/react';
import { prisma } from '~/server/db';
import { Session } from 'next-auth';
import Link from 'next/link';

type ProgressionWithFormation = Prisma.ProgressionGetPayload<{
    include: {
        formation: {
            include: {
                lecons: true,
                techs: true
            }
        },
        lecon: true
    }
}>

export const getServerSideProps: GetServerSideProps<{
    progression: ProgressionWithFormation[] | null
}> = async function (context) {

    const session = await getSession(context)
    if (session) {
        const progression = await prisma.progression.findMany({
            where: {
                idU: session.user.id
            },
            include: {
                formation: {
                    include: {
                        lecons: true,
                        techs: true
                    }
                },
            },
        })

        const groupedProgress = progression.reduce((previous: any, current) => {
            if (!previous[current.formation.id]) previous[current.formation.id] = [];
            previous[current.formation.id].push(current);
            return previous;
        }, {})

        const result = Object.entries(groupedProgress).map((item: any) => {
            const refValue = item[1][0];
            refValue.finish = item[1].every((element: any) => element.finish)
            return refValue;
        })

        if (progression) {
            return {
                props: {
                    progression: JSON.parse(JSON.stringify(result)) as ProgressionWithFormation[],
                }
            }
        }
        else {
            return {
                props: {
                    progression: null,
                }
            }
        }
    }
    else {
        return {
            props: {
                progression: null,
            }
        };
    }
};

const Dashboard: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ progression }) => {
    const session2 = useSession()

    const [selected, setSelected] = useState("")

    return (
        <>
            <Head>
                <title>Mon dashboard</title>
                <meta name="description" content="Generated by create-t3-app" />
            </Head>

            <main className="flex min-h-screen bg-white flex flex-col justify-between pb-20 dark:bg-[#082F38]">
                <div className="flex flex-col items-start justify-start pl-28 pt-20 pr-6 w-9/12">
                    <Title title={`Reprendre où vous en étiez, ${session2.data?.user.name}`} link={''} />

                    {progression && progression.map((item) =>
                        selected === item.idF ?
                            <div className="flex flex-row items-start justify-between w-full gap-3 rounded-xl bg-white dark:bg-[#041F25] py-7 pr-10 mt-6 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] relative" onClick={() => setSelected(item.idF)} key={item.idF}>
                                <div className="flex flex-col justify-end max-w-20 max-h-20 -top-4 -left-5 absolute">
                                    {item.formation.techs && item.formation.techs[0] && <img src={item.formation.techs[0].logo} width="80" height="80" alt="" />}
                                </div>
                                <div className="ml-20 flex flex-col justify-start items-start w-11/12">
                                    <h3 className="font-bold text-[#0E6073] dark:text-[#2EA3A5] mb-3 text-lg">{item.formation.title}</h3>

                                    <div className="text-sm font-Inter text-[#989898] text-left" dangerouslySetInnerHTML={{ __html: item.formation.description }} />
                                    {item.formation.lecons?.map((lesson) =>
                                        <div key={lesson.id} className="w-full flex flex-col items-center justify-center">
                                            <div className="flex flex-row justify-between items-center py-6 w-11/12">
                                                <h3 className="font-bold text-[#0E6073] text-sm">{lesson.title}</h3>
                                                <Link href={`/lecons/${lesson.id}`}>{/*lesson.status === "finished" ? <FaCheck className="h-6 w-6 text-[#0E6073]" /> :*/ <FaPlay className="h-6 w-6 text-[#0E6073]"/>}</Link>
                                            </div>
                                            <div className="w-11/12 h-0.5 bg-[#989898] dark:bg-[#0E6073] self-center"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col justify-start h-full items-start w-2/12">
                                    <DifficultyText level={item.formation.difficulte} />
                                    <div className="flex flex-row justify-start items-center mt-5">
                                        <FaPenAlt className="h-7 w-7 text-[#989898] dark:text-[#2EA3A5]" />
                                        <p className="text-sm ml-3 font-Inter text-[#989898] dark:text-[#2EA3A5]">{item.formation.lecons.length} leçons</p>
                                    </div>
                                </div>
                            </div> :
                            <div className="flex flex-row items-start justify-between w-full gap-3 rounded-xl bg-white dark:bg-[#041F25] py-7 pr-10 mt-6 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] relative" onClick={() => setSelected(item.idF)} key={item.idF}>
                            <div className="flex flex-col justify-end max-w-20 max-h-20 -top-4 -left-5 absolute">
                                {item.formation.techs && item.formation.techs[0] && <img src={item.formation.techs[0].logo} width="80" height="80" alt="" />}
                            </div>
                            <div className="ml-20 flex flex-col justify-start items-start w-11/12">
                                <h3 className="font-bold text-[#0E6073] dark:text-[#2EA3A5] mb-3 text-lg">{item.formation.title}</h3>
                                <div className="text-sm font-Inter text-[#989898] text-left" dangerouslySetInnerHTML={{ __html: item.formation.description }} />
                            </div>
                            <div className="flex flex-col justify-start items-start h-full w-2/12">
                                <DifficultyText level={item.formation.difficulte} />
                                <div className="flex flex-row justify-start items-center mt-5">
                                    <FaPenAlt className="h-7 w-7 text-[#989898] dark:text-[#2EA3A5]"/>
                                    <p className="text-sm ml-3 font-Inter text-[#989898] dark:text-[#2EA3A5]">{item.formation.lecons.length} leçons</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-3/12 bg-[#0E6073] fixed right-0 flex flex-col items-start justify-start h-full pt-24 px-10">
                    <h3 className="font-bold text-white mb-8 w-full">Cours terminés</h3>
                    {progression && progression.map((forma) => {
                        if(forma.finish)
                            return (
                                <div className="bg-white dark:bg-[#1A808C] w-full h-14 rounded-xl flex flex-row justify-between items-center pr-5 mb-3" key={forma.formation.id}>
                                    <div className="flex flex-row justify-start items-center relative">
                                        {forma.formation.techs && forma.formation.techs[0] && <img src={forma.formation.techs[0].logo} width="60" height="60" className="top-0" alt="" />}
                                        <h3 className="font-bold text-[#0E6073] dark:text-white">{forma.formation.title}</h3>
                                    </div>
                                    <Difficulty level={forma.formation.difficulte} />
                                </div>
                            )
                        })}

                </div>
                <Header selected={1} />
            </main>
        </>
    );
};

export default Dashboard;