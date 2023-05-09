import Link from "next/link";
import { type Formation, type Technologie } from "@prisma/client";
import { Difficulty } from "./difficulties";
import { IoCheckmarkCircle } from "react-icons/io5";

interface Props {
    data: Formation | Technologie
  }
const Lesson: React.FC<Props> = ({data}) => {
    return (
            <Link
            className="flex flex-col items-center min-w-[200px] max-w-2xl gap-4 rounded-xl bg-[#0E6070]/10 p-4 hover:bg-[#0E6070]/20 relative mt-6"
            href={`/formations/${encodeURIComponent(data.id)}`}
            key={data.id}
            >
                {data.techs  ?
                    <>
                        <div className="absolute -top-11 flex items-end justify-end w-[100px] h-[100px]">
                            <img src={data.techs[0].logo} alt="" />
                        </div>
                        <h3 className="text-md font-bold mt-12 text-center">{data.title}</h3>
                        <span className="absolute right-5">
                            <Difficulty level={data.difficulte} />
                        </span>
                        <p className="h-7 w-7 text-[#0E6073] absolute left-5">10%</p>
                        {/* <IoCheckmarkCircle className="h-7 w-7 text-[#0E6073] absolute left-5" /> */}
                    </>
                    :
                    <>
                        <div className="absolute -top-11 flex items-end justify-end w-[100px] h-[100px]">
                            <img src={data.logo} alt="" />
                        </div>
                        <h3 className="text-md font-bold mt-12 text-center">{data.name}</h3>
                    </>
                }
            </Link>
    );
}

export default Lesson;