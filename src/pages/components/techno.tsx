import Link from "next/link";
import { Formation, Technologie } from "@prisma/client";
import { Difficulty } from "./difficulties";
import { IoCheckmarkCircle } from "react-icons/io5";

interface Props {
    data: Technologie
}
const Techno: React.FC<Props> = ({ data }) => {
    return (
        <Link
            className="flex flex-col items-center min-w-[200px] max-w-2xl gap-4 rounded-xl bg-[#0E6070]/10 p-4 hover:bg-[#0E6070]/20 relative mt-6"
            href={`/formations/${encodeURIComponent(data.id)}`}
            key={data.id}
        >
            <div className="absolute -top-11 flex items-end justify-end w-[100px] h-[100px]">
                {data.logo && <img src={data.logo} alt="" />}
            </div>
            <h3 className="text-md font-bold mt-12 text-center">{data.name}</h3>


        </Link>
    );
}

export default Techno;