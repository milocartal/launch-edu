import React from "react";
import { FaPlay } from "react-icons/fa";
import Link from "next/link";

interface Props {
    data: any
    setSelected: any
    selected: any
    nav: string
    description: string
  }
const Openable: React.FC<Props> = ({data, setSelected, selected, nav, description}) => {
    return (
        <div className="bg-white w-full mt-1 h-fit flex flex-col justify-start shadow-[4px_10px_20px_1px_rgba(0,0,0,0.25)]">
            {selected === data.id ?
            <>
                <div className="bg-white w-full h-fit flex flex-col items-center justify-center px-16 py-8 shadow-[4px_10px_20px_1px_rgba(0,0,0,0.25)]" onClick={setSelected}>
                    <div className="w-full flex flex-row items-center justify-between">
                        <p className="font-semibold text-[#0E6073]">{data.title}</p>
                        { nav &&
                        <Link href={`${nav}`}>
                            <FaPlay className="h-5 w-5 text-[#0E6073]"/>
                        </Link>
                        }
                    </div>
                   {description && <div className="text-sm font-Inter text-[#989898] text-left" dangerouslySetInnerHTML={{ __html: description }} />}
                </div>

                <div className="w-full mt-2 mb-4">
                    <p className="px-20 mt-2 font-semibold text-[#0E6073]">Cours</p>
                    <p className="px-20 mt-2 font-semibold text-[#0E6073]">Exercice</p>
                    <p className="px-20 mt-2 font-semibold text-[#0E6073]">Solution</p>
                </div>
            </>
            :
            <div className="bg-white w-full h-fit flex flex-row items-center justify-between px-16 py-8 shadow-[4px_10px_20px_1px_rgba(0,0,0,0.25)]" onClick={setSelected}>
                <p className="font-semibold text-[#0E6073]">{data.title}</p>
                { nav &&
                <Link href={`/admin/lecons/${data.id}`}>
                    <FaPlay className="h-5 w-5 text-[#0E6073]"/>
                </Link>
                }
            </div>
        }
        </div>
    );
}

export default Openable;