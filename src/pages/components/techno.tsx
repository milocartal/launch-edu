import Link from "next/link";
import { Technologie } from "@prisma/client";

function Techno(props:{ data: Technologie  }) {
    return (
        <Link
            className="flex flex-col items-center min-w-[200px] max-w-2xl gap-4 rounded-xl bg-white dark:bg-[#041F25] p-4 hover:bg-[#d6d4d4]/20 dark:hover:bg-[#083039] relative mt-6 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)]"
            href={`/technologies/${encodeURIComponent(props.data.id)}`}
            key={props.data.id}
        >
            <div className="absolute -top-11 flex items-end justify-center w-[100px] h-[100px]">
                {props.data.logo && <img src={props.data.logo} alt="" className="max-h-24"/>}
            </div>
            <h3 className="text-base font-bold mt-12 text-center">{props.data.name}</h3>


        </Link>
    );
}

export default Techno;