import { type NextPage } from 'next';
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { prisma } from '~/server/db';
import { Formation, Technologie } from '@prisma/client';

export const getServerSideProps: GetServerSideProps<{
    tech: Technologie;
}> = async function (context) {
    const tech = await prisma.technologie.findUnique({
        where: {
            id: context.query.id as string
        },
    });
    return {
        props: {
            tech: JSON.parse(JSON.stringify(tech)) as Technologie
        }
    };
};

const Technologies: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ tech }) => {
    const { data: sessionData } = useSession();
    const admin = sessionData?.user.admin
    console.log(tech)

    const idf = tech.id
    const { data: formations } = api.formation.getAllTech.useQuery({ id: idf })

    /*async function handleTechnologie(event: React.SyntheticEvent) {
        //event.preventDefault()
        const target = event.target as typeof event.target & {
            formTitle: { value: string };
            description: { value: string };
        };
        const title = target.formTitle.value;
        const desc = target.description.value;
        await addTechnologie.mutateAsync({ title: title, idf: idf, description: desc })
    }*/

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                {tech &&
                    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                            <span className="text-[hsl(280,100%,70%)]">{tech.name}</span> Formation
                        </h1>

                        <div className="flex flex-col items-center gap-2">
                            <AuthShowcase />
                            <Link href="/"><button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">Home</button></Link>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
                            {formations as Formation[] && formations && formations.length > 0 && formations.map((forma) => {
                                return (
                                    <Link
                                        className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                                        href={`/components/formations/${encodeURIComponent(forma.id)}`}
                                        key={forma.id}
                                    >
                                        <h3 className="text-2xl font-bold">{forma.title}</h3>
                                        <div className="text-lg">
                                            {forma.description}
                                        </div>

                                        <div className="text-lg">
                                            <p>{forma.updatedAt.getDate()}/{forma.updatedAt.getMonth()}/{forma.updatedAt.getFullYear()} at {forma.updatedAt.getHours()}:{forma.updatedAt.getMinutes()}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>

                    </div>
                }
            </main>
        </>
    );
};

export default Technologies;

const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
                {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
            </p>
            {sessionData?.user.admin && <Link href="/components/admin"><button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">Admin</button></Link>}
            <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
                {sessionData ? "Sign out" : "Sign in"}
            </button>
        </div>
    );
};