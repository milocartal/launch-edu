import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";


function Title (props:{title: string, link: string}) {

    return (
        <div className="flex flex-row items-center justify-start px-10 w-8/12">
            <div className="flex flex-row items-center justify-start">
                {props.link && <button className="mr-5"><Link href={`/${props.link}`}><FaArrowLeft className="h-6 w-6 text-[#0E6073]" /></Link></button>}
                <h1 className="text-3xl font-bold tracking-tight text-[#0E6073]">{props.title}</h1>
            </div>
        </div>
    );
}

export default Title;