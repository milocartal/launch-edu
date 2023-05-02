import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { BiUserCircle } from "react-icons/bi"

import { api } from "~/utils/api";

function Header (props:{selected: number}) {
    const { data: sessionData } = useSession();
    const admin = sessionData?.user.admin

    return (
        <>
            <div className="fixed w-full  bg-white top-0 h-[4rem]" />
            <div className="fixed w-full pr-40 border-b-4 border-[#63aeab] bg-white top-0 right-0 left-28 h-[4rem]" />

            <div className="flex justify-between gap-12 fixed w-full pr-40 top-0 right-0 left-28 h-[4rem] text-[#63aeab]">
                <div className="flex justify-evenly">
                    {props.selected === 1 ?
                        <Link href={`/userdashboard`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]">Vos cours</button></Link> :
                        <Link href={`/userdashboard`}><button className="px-10 h-full font-semibold border-[#0E6073] transition hover:border-b-4 hover:text-[#0E6073]">Vos cours</button></Link>
                    }
                    {props.selected === 2 ?
                        <Link href={`/formation`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]">Explorer</button></Link>:
                        <Link href={`/formation`}><button className="px-10 h-full font-semibold border-[#0E6073] transition hover:border-b-4 hover:text-[#0E6073]">Explorer</button></Link>
                    }
                    {admin && props.selected === 3 ?
                            <Link href={`/admin/main`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]" autoFocus>Gérez les cours</button></Link>: admin ?
                            <Link href={`/admin/main`}><button className="px-10 h-full font-semibold border-[#0E6073] transition hover:border-b-4 hover:text-[#0E6073]" autoFocus>Gérez les cours</button></Link>:<></>}
                </div>
                <div className="flex justify-center items-center gap-5 mb-1">
                    <div className="bg-white flex flex-row justify-start items-center width w-96 h-12 px-8 rounded-full shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]">
                        <HiMagnifyingGlass className="h-8 w-8 text-[#989898]" />
                        <input className="h-10 shadow-none w-full bg-transparent text-black" type="text" />
                    </div>
                    {sessionData && sessionData.user?.image && props.selected === 4 ? <Link href={`/users/${sessionData.user.id}`} className="flex flex-col justify-center"><img src={sessionData.user.image} className="max-w-[3rem] rounded-full border-4 border-[#0E6073]"></img></Link>:
                    sessionData && sessionData.user?.image && <Link href={`/users/${sessionData.user.id}`} className="flex flex-col justify-center"><img src={sessionData.user.image} className="max-w-[3rem] rounded-full"></img></Link>}
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-2 min-h-screen top-0 left-0 bg-[#0E6073] fixed m-w-xs p-2">
                <Link href="/"><img src="/okto.png" className="max-w-[3rem]"></img></Link>
                <AuthShowcase />
            </div>
        </>
    );
}

export default Header;

const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();

    return (
        <div>
            {sessionData ?
                <button className="rounded-full px-3 py-3 font-semibold  no-underline transition hover:bg-white/10" onClick={() => void signOut()}>
                    <img src="/arrow.png" className="max-w-[1.5rem]"></img>
                </button> :
                <button className="rounded-full px-2 py-3 font-semibold  no-underline transition hover:bg-white/10" onClick={() => void signIn()}>
                    <BiUserCircle className="text-[2rem] text-white" />
                </button>}
        </div>

    );
};