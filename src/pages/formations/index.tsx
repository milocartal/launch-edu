import { type NextPage } from "next";
import React, { useState } from 'react';
import Head from "next/head";
import Header from "../components/header";
import Link from "next/link";
import Image from 'next/image'
import { signIn, signOut, useSession } from "next-auth/react";
import { IoCheckmarkCircle } from "react-icons/io5";

import { api } from "~/utils/api";
import { Difficulty } from "~/pages/components/difficulties";
import { Formation, Technologie } from "@prisma/client";
import Lesson from "../components/lesson";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: formations } = api.formation.getAll.useQuery()
  const { data: technologies } = api.technologie.getAll.useQuery()
  const admin = sessionData?.user.admin
  const [filterType, setFilterType] = useState("alphabetique")

  function changeFilterType(type: string) {
    setFilterType(type)
  }

  technologies as Technologie[] && technologies && technologies.length > 0 && filterType == "alphabetique" ? technologies.sort(function (a, b) {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  }) : formations as Formation[] && formations && formations.length > 0 && filterType == "diff" && formations.sort(function (a, b) {
    return a.difficulte - b.difficulte;
  })

  return (
    <>
      <Head>
        <title>Liste des formations</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/okto.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-white">


        <div className="flex flex-col items-start justify-start gap-12 pl-24 pt-20 pr-6">
          <div className="flex flex-row items-center justify-between w-full px-10">
            <Title title={"Trouvez le cours parfait"} link={""} />
            <div className="flex flex-row items-center justify-evenly">
              <p className="mr-2">Trier par : </p>

              {filterType === "alphabetique" ? <button className="px-4 py-1 bg-[#0E6073] rounded-full mx-1" onClick={() => changeFilterType("alphabetique")}>
                <p className="text-[#fff]">Thématique</p>
              </button> :
                <button className="px-4 py-1 bg-[#D9D9D9] rounded-full mx-1" onClick={() => changeFilterType("alphabetique")}>
                  <p className="text-[#0E6073]">Thématique</p>
                </button>
              }
              {filterType === "progress" ? <button className="px-4 py-1 bg-[#0E6073] rounded-full mx-1" onClick={() => changeFilterType("progress")}>
                <p className="text-[#fff]">Progression</p>
              </button> :
                <button className="px-4 py-1 bg-[#D9D9D9] rounded-full mx-1" onClick={() => changeFilterType("progress")}>
                  <p className="text-[#0E6073]">Progression</p>
                </button>
              }
              {filterType === "diff" ? <button className="px-4 py-1 bg-[#0E6073] rounded-full mx-1" onClick={() => changeFilterType("diff")}>
                <p className="text-[#fff]">Niveau</p>
              </button> :
                <button className="px-4 py-1 bg-[#D9D9D9] rounded-full mx-1" onClick={() => changeFilterType("diff")}>
                  <p className="text-[#0E6073]">Niveau</p>
                </button>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 md:gap-8 w-full">
            {filterType === "alphabetique" ? 
              technologies as Technologie[] && technologies && technologies.length > 0 && technologies.map((techno) => {
                return (
                  <Link
                    className="flex flex-col items-center min-w-[50px] max-w-2xl gap-4 rounded-xl bg-[#0E6070]/10 p-4 hover:bg-[#0E6070]/20 relative mt-6"
                    href={`/formations/${encodeURIComponent(forma.id)}`}
                    key={forma.id}
                  >
                    <div className="absolute -top-11 flex items-end justify-center w-[100px] h-[100px]">
                      {forma.techs[0] && forma.techs[0].logo && <img src={forma.techs[0].logo} alt="" className="max-h-[7rem]" />}
                    </div>
                    <h3 className="text-md font-bold mt-12 text-center">{forma.title}</h3>

                    <span className="absolute right-5">
                      <Difficulty level={forma.difficulte} />
                    </span>
                    <p className="h-7 w-7 text-[#0E6073] absolute left-5">10%</p>
                    {/* <IoCheckmarkCircle className="h-7 w-7 text-[#0E6073] absolute left-5"/> */}
                  </Link>
                )
              }) : formations as Formation[] && formations && formations.length > 0 && formations.map((forma) => {
                if (!forma.hidden || forma.hidden && admin)
                  return (
                    <Lesson forma={forma} techno={undefined} />
                  )
              })
            }
          </div>
        </div>
        <Header selected={2} />
      </main>
    </>
  );
};

export default Home;