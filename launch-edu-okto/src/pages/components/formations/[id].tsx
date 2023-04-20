import { type NextPage } from 'next';
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { prisma } from '~/server/db';
import { Formation, Lecon } from '@prisma/client';

export const getServerSideProps: GetServerSideProps<{
    formation: Formation;
}> = async function (context) {
    const formation = await prisma.formation.findUnique({
        where: {
            id: context.query.id as string
        },
    });
    return {
        props: {
            formation: JSON.parse(JSON.stringify(formation)) as Formation
        }
    };
};

const Formations: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ formation }) => {
    const { data: sessionData } = useSession();
    const admin = sessionData?.user.admin

    const idf = formation.id
    const addLecon = api.lecon.create.useMutation()
    const { data: lecons } = api.lecon.getAll.useQuery({ id: idf })

    async function handleLecon(event: React.SyntheticEvent) {
        //event.preventDefault()
        const target = event.target as typeof event.target & {
            leconTitle: { value: string };
            description: { value: string };
        };
        const title = target.leconTitle.value;
        const desc = target.description.value;
        await addLecon.mutateAsync({ title: title, idf: idf, description: desc })
    }

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                {formation &&
                    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                            <span className="text-[hsl(280,100%,70%)]">{formation.title}</span> Formation
                        </h1>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
                            {lecons as Lecon[] && lecons && lecons.length > 0 && lecons.map((lec) => {
                                if (!lec.hidden || lec.hidden && admin)
                                    return (
                                        <Link
                                            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                                            href={`/components/lecons/${lec.id}`}
                                            key={lec.id}
                                        >
                                            <h3 className="text-2xl font-bold">{lec.title}</h3>
                                            <div className="text-lg">
                                                {lec.description}
                                            </div>

                                            <div className="text-lg">
                                                <p>{lec.updatedAt.getDate()}/{lec.updatedAt.getMonth()}/{lec.updatedAt.getFullYear()} at {lec.updatedAt.getHours()}:{lec.updatedAt.getMinutes()}</p>
                                            </div>
                                        </Link>
                                    )
                            })}
                        </div>

                        <div className="flex items-center gap-2">
                            <AuthShowcase />
                            <Link href="/"><button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">Home</button></Link>
                            <Link href="/components/formation"><button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">Liste Formations</button></Link>
                        </div>

                        <form onSubmit={handleLecon} className="flex flex-col gap-5 item-center justify-center" method="POST">
                            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[3rem]">Lecon</h1>

                            <label htmlFor="leconTitle" className="text-white">Titre</label>
                            <input name="leconTitle" id="leconTitle" type="text" placeholder="Title of the lecon" required></input>

                            <label htmlFor="description" className="text-white">Description</label>
                            <textarea name="description" id="description" placeholder="Description de la lecon" required></textarea>

                            <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" type="submit" value="submit">Ajouter</button>
                        </form>
                        

                    </div>
                }
            </main>
        </>
    );
};

export default Formations;

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