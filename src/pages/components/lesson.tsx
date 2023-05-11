import Link from "next/link";
import { Formation, Prisma, Technologie } from "@prisma/client";
import { Difficulty } from "./difficulties";
import { IoCheckmarkCircle } from "react-icons/io5";

type FormationWithAll = Prisma.FormationGetPayload<{
    include: {
        techs: true,
        lecons: true,
        Prerequis: {
            include: {
                techs: true
            }
        }
    }
}>

function Lesson (props: {data : FormationWithAll}) {
    return (
        <Link
            className="flex flex-col items-center min-w-[200px] max-w-2xl gap-4 rounded-xl bg-white p-4 hover:bg-[#d6d4d4]/20 relative mt-6 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)]"
            href={`/formations/${encodeURIComponent(props.data.id)}`}
            key={props.data.id}
        >

            <div className="absolute -top-11 flex items-end justify-end w-[100px] h-[100px]">
                {props.data.techs && props.data.techs[0] && props.data.techs[0].logo && <img src={props.data.techs[0].logo} alt="" />}
            </div>
            <h3 className="text-md font-bold mt-12 text-center">{props.data.title}</h3>
            <span className="absolute right-5">
                <Difficulty level={props.data.difficulte} />
            </span>
            <p className="h-7 w-7 text-[#0E6073] absolute left-5">10%</p>
            {/* <IoCheckmarkCircle className="h-7 w-7 text-[#0E6073] absolute left-5" /> */}


        </Link>
    );
}

export default Lesson;