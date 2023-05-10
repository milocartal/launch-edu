import Link from "next/link";
import { Technologie } from "@prisma/client";

function Techno(props:{ data: Technologie  }) {
    return (
        <Link
            className="flex flex-col items-center min-w-[200px] max-w-2xl gap-4 rounded-xl bg-[#0E6070]/10 p-4 hover:bg-[#0E6070]/20 relative mt-6"
            href={`/formations/${encodeURIComponent(props.data.id)}`}
            key={props.data.id}
        >
            <div className="absolute -top-11 flex items-end justify-end w-[100px] h-[100px]">
                {props.data.logo && <img src={props.data.logo} alt="" />}
            </div>
            <h3 className="text-md font-bold mt-12 text-center">{props.data.name}</h3>


        </Link>
    );
}

export default Techno;