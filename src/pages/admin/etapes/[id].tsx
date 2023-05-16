import { type NextPage } from 'next';
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { getServerSession } from "next-auth";
import Head from "next/head";
import { getSession } from "next-auth/react";

import { prisma } from '~/server/db';
import { Etape, Lecon, Prisma } from '@prisma/client';

type EtapeWithAll = Prisma.EtapeGetPayload<{
    include: {
        lecon: true
    }
}>

export const getServerSideProps: GetServerSideProps<{
    etape: EtapeWithAll
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
    const etape = await prisma.etape.findUnique({
        where: {
            id: context.query.id as string
        },
        include:{
            lecon: true
        }
    });
    return {
        props: {
            etape: JSON.parse(JSON.stringify(etape)) as EtapeWithAll
        }
    };
};

const etapes: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ etape }) => {
    let x = "https://github.com/milocartal/launch-edu/blob/main/src/pages/index.tsx"
    x=x.replace('https://github.com','https://stackblitz.com/github').replace('/blob/main/','?file=')+ "&embed=1&view=editor&hideExplorer=1"
    console.log(x)
    return (
        <>
            <Head>
                <title>Create T3 App</title>
            </Head>

            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                {etape &&
                    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                            <span className="text-[hsl(280,100%,70%)]">{etape.lecon.title}</span> {etape.name}
                        </h1>

                        <div className="text-lg">
                            {etape.transcript}
                        </div>

                        <div>
                            {etape.video}
                        </div>

                        <div className="text-lg">
                            {etape.code}
                        </div>
                        

                        {/*<iframe src="https://stackblitz.com/github/milocartal/launch-edu?file=src/pages/index.tsx&embed=1&view=editor&hideExplorer=1" />*/}
                        <iframe src={x}/>
                        


                    </div>
                }
            </main>
        </>
    );
};

export default etapes;