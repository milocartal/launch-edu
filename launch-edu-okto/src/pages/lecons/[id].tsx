import { type NextPage } from 'next';
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { prisma } from '~/server/db';
import { Etape, EtapeType, Lecon } from '@prisma/client';

export const getServerSideProps: GetServerSideProps<{
    lecon: Lecon;
}> = async function (context) {

    const session = await getSession(context)

    const lecon = await prisma.lecon.findUnique({
        where: {
            id: context.query.id as string
        },
    });
    const idf = lecon?.idf;

    if (!session) {
      return {
        redirect: {
          destination: '/formations/'+idf,
          permanent: false,
        },
      }
    }
    else {
        
        return {
            props: {
                lecon: JSON.parse(JSON.stringify(lecon)) as Lecon
            }
        };
    }
    
};

const etapes: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ lecon }) => {
    const { data: sessionData } = useSession();
    const admin = sessionData?.user.admin

    const { data: typeList } = api.type.getAll.useQuery()

    const idL = lecon.id
    const idf = lecon.idf
    const addEtape = api.etape.create.useMutation()
    const { data: etapes } = api.etape.getAll.useQuery({ id: idL })

    async function handleEtape(event: React.SyntheticEvent) {
        //event.preventDefault()
        const target = event.target as typeof event.target & {
            etapeName: { value: string };
            idt: { value: string };
            description: { value: string };
            code: { value: string };
        };
        const name = target.etapeName.value;
        const idt = target.idt.value;
        const desc = target.description.value;
        const code = target.code.value;
        await addEtape.mutateAsync({ name: name, idt: idt, description: desc, code: code, idl: idL })
    }

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                {lecon &&
                    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                            <span className="text-[hsl(280,100%,70%)]">{lecon.title}</span> lecon
                        </h1>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
                            {etapes as Etape[] && etapes && etapes.length > 0 && etapes.map((etape) => {

                                return (
                                    <Link
                                        className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                                        href={`/components/etapes/${etape.id}`}
                                        key={etape.id}
                                    >
                                        <h3 className="text-2xl font-bold">{etape.name}</h3>
                                        <div className="text-lg">
                                            {etape.description}
                                        </div>

                                        <div className="text-lg">
                                            <p>{etape.updatedAt.getDate()}/{etape.updatedAt.getMonth()}/{etape.updatedAt.getFullYear()} at {etape.updatedAt.getHours()}:{etape.updatedAt.getMinutes()}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>

                        <div className="flex items-center gap-2">
                            <AuthShowcase />
                            <Link href="/"><button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">Home</button></Link>
                            <Link href={`/components/formations/${idf}`}><button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">Liste Lecon</button></Link>
                        </div>


                        {admin ?
                            <form onSubmit={handleEtape} className="flex flex-col gap-5 item-center justify-center" method="POST">
                                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[3rem]">Etape</h1>

                                <label htmlFor="etapeName" className="text-white">Titre</label>
                                <input name="etapeName" id="etapeName" type="text" placeholder="Title of the etape" required></input>

                                <label htmlFor='idt' className='text-white'>Type</label>
                                <select id="idt" name="idt" required>
                                    {typeList as EtapeType[] && typeList && typeList.length > 0 && typeList.map((type) => {

                                        return (
                                            <option value={type.id} key={type.id}>{type.name}</option>
                                        )
                                    })}
                                </select>

                                <label htmlFor="description" className="text-white">Description</label>
                                <textarea name="description" id="description" placeholder="Description de l'etape" required></textarea>

                                <label htmlFor="code" className="text-white">Titre</label>
                                <input name="code" id="code" type="url" placeholder="url du code" required></input>

                                <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20" type="submit" value="submit">Ajouter</button>
                            </form> :
                            <p></p>
                        }



                    </div>
                }
            </main>
        </>
    );
};

export default etapes;

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