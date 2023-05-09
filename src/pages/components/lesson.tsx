import Link from "next/link";
import { type Formation, type Technologie } from "@prisma/client";
import { Difficulty } from "./difficulties";
import { IoCheckmarkCircle } from "react-icons/io5";


function Lesson (props:{data: Formation | Technologie}) {

    return (
            <Link
            className="flex flex-col items-center min-w-[200px] max-w-2xl gap-4 rounded-xl bg-[#0E6070]/10 p-4 hover:bg-[#0E6070]/20 relative mt-6"
            href={`/formations/${encodeURIComponent(props.data.id)}`}
            key={props.data.id}
            >
                {props.data.techs[0] && props.data.techs[0].logo ? 
                <div className="absolute -top-11 flex items-end justify-end w-[100px] h-[100px]">
                    <img src={props.data.techs[0].logo} alt="" />
                </div> :
                <div className="absolute -top-11 flex items-end justify-end w-[100px] h-[100px]">
                    <img src={props.data.logo} alt="" />
                </div>
                }
                <h3 className="text-md font-bold mt-12 text-center">{props.data.title}</h3>
                {props.data.difficulte && <span className="absolute right-5">
                    <Difficulty level={props.data.difficulte} />
                </span>
                }
                <p className="h-7 w-7 text-[#0E6073] absolute left-5">10%</p>
                <IoCheckmarkCircle className="h-7 w-7 text-[#0E6073] absolute left-5" />
            </Link>
    );
}

export default Lesson;


