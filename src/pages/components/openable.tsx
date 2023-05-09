import Image from "next/image";
import { DifficultyText } from "./difficulties";
import { FaCheck, FaPenAlt, FaPlay } from "react-icons/fa";


function Openable (props: data, selected) {
    return (
        <div className="flex flex-row items-center w-full gap-3 rounded-xl bg-white py-7 pr-10 mt-6 shadow-[0px_10px_30px_0px_rgba(0,0,0,0.25)] relative" onClick={props.selected} key={props.data.id}>
            <div className="flex flex-col justify-end max-w-20 max-h-20 -top-4 -left-5 absolute">
                <Image src="/Expressjs.png" width="100" height="100" alt=""/>
            </div>
            <div className="ml-20 flex flex-col justify-start items-start">
                <h3 className="font-bold text-[#0E6073] mb-3 text-lg">{props.data.title}</h3>
                <p className="text-sm font-Inter text-[#989898] text-left">{props.data.description}</p>
                {props.data.lessons?.map((lesson)=>
                <div key={lesson.id} className="w-full flex flex-col items-center justify-center">
                    <div className="flex flex-row justify-between items-center py-4 w-11/12">
                        <h3 className="font-bold text-[#0E6073] text-sm">{lesson.title}</h3>
                        <button>{lesson.status === "finished" ? <FaCheck className="h-6 w-6 text-[#0E6073]" /> : <FaPlay className="h-6 w-6 text-[#0E6073]" />}</button>
                    </div>
                    <div className="w-11/12 h-0.5 bg-[#989898] self-center"></div>
                </div>
                )}
            </div>
            <div className="flex flex-col justify-start h-full">
                <DifficultyText level={props.data.diff}/>
                <div className="flex flex-row justify-start items-center mt-5">
                    <FaPenAlt className="h-7 w-7 text-[#989898] dark:text-[#2EA3A5]" />
                    <p className="text-sm ml-3 font-Inter text-[#989898] dark:text-[#2EA3A5]">3 leçons</p>
                </div>
            </div>
        </div>
    );
}

export default Openable;


