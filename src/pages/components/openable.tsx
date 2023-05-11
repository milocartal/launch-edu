import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";
import Link from "next/link";
import { Etape, Prisma } from "@prisma/client";

type LeconWithEtapes = Prisma.LeconGetPayload<{
    include: { etapes: true }
}>

function Openable(props: { data: LeconWithEtapes, nav: boolean, description: boolean }) {
    const [select, setSelected] = useState(false)
    return (
        <div className="bg-white w-full mt-1 h-fit flex flex-col justify-start shadow-[4px_10px_20px_1px_rgba(0,0,0,0.25)]">
            {select ?
                <>
                    <div className="bg-white w-full h-fit flex flex-col items-center justify-center px-16 py-8 shadow-[4px_10px_20px_1px_rgba(0,0,0,0.25)]" onClick={(e) => setSelected(false)}>
                        <div className="w-full flex flex-row items-center justify-between">
                            <p className="font-semibold text-[#0E6073]">{props.data.title}</p>
                            {props.nav &&
                                <Link href={`/lecons/${props.data.id}`}>
                                    <FaPlay className="h-5 w-5 text-[#0E6073]" />
                                </Link>
                            }
                        </div>
                        {props.description && select && <div className="text-sm font-Inter text-[#989898] text-left w-full" dangerouslySetInnerHTML={{ __html: props.data.description }} />}
                    </div>

                    <div className="w-full mt-2 mb-4">
                        {props.data.etapes as Etape[] && props.data.etapes.length > 0 && props.data.etapes.map((etape)=>{
                            return (<p className="px-20 mt-2 font-semibold text-[#0E6073]">{etape.name}</p>)
                        })}
                    </div>
                </>
                :
                <div className="bg-white w-full h-fit flex flex-row items-center justify-between px-16 py-8 shadow-[4px_10px_20px_1px_rgba(0,0,0,0.25)] hover:cursor-pointer" onClick={() => setSelected(true)}>
                    <p className="font-semibold text-[#0E6073]">{props.data.title}</p>
                    {props.nav &&
                        <Link href={`/lecons/${props.data.id}`}>
                            <FaPlay className="h-5 w-5 text-[#0E6073]" />
                        </Link>
                    }
                </div>
            }
        </div>
    );
}

export default Openable;