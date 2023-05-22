import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useTheme } from "next-themes";
import { BiUserCircle } from "react-icons/bi"

import { api } from "~/utils/api";
import { FaMoon, FaSun } from "react-icons/fa";

function Header (props:{selected: number}) {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const { data: sessionData } = useSession();
    const admin = sessionData?.user.admin

    return (
        <>
            <div className="fixed w-full bg-transparent top-0 h-[4rem]" />
            {props.selected === 404 ? <div className="fixed w-full pr-40 border-b-4 border-[#fff] bg-transparent top-0 right-0 left-28 h-[4rem]" /> : <div className="fixed w-full pr-40 border-b-4 border-[#63aeab] bg-white dark:bg-[#082F38] top-0 right-0 left-28 h-[4rem]" />}

            <div className="flex justify-between gap-12 fixed w-full pr-40 top-0 right-0 left-28 h-[4rem] text-[#63aeab]">
                <div className="flex justify-evenly">
                    {props.selected === 1 ?
                        <Link href={`/dashboard`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]">Vos cours</button></Link> :
                        props.selected === 404 ?
                            <Link href={`/dashboard`}><button className="px-10 h-full font-semibold border-[#fff] border-b-4 text-[#fff]">Vos cours</button></Link> :
                            <Link href={`/dashboard`}><button className="px-10 h-full font-semibold border-transparent border-b-4 hover:text-[#0E6073] hover:border-[#0E6073]">Vos cours</button></Link>
                    }
                    {props.selected === 2 ?
                        <Link href={`/formations`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]">Explorer</button></Link> :
                        props.selected === 404 ?
                            <Link href={`/formations`}><button className="px-10 h-full font-semibold border-[#fff] border-b-4 text-[#fff]">Explorer</button></Link> :
                            <Link href={`/formations`}><button className="px-10 h-full font-semibold border-transparent border-b-4 hover:text-[#0E6073] hover:border-[#0E6073]">Explorer</button></Link>
                    }
                    {admin && props.selected === 3 ?
                        <Link href={`/admin`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]" autoFocus>Gérez les cours</button></Link> :
                        admin && props.selected === 404 ?
                            <Link href={`/admin`}><button className="px-10 h-full font-semibold border-[#fff] border-b-4 text-[#fff]" autoFocus>Gérez les cours</button></Link> :
                            admin ? <Link href={`/admin`}><button className="px-10 h-full font-semibold border-transparent border-b-4 hover:text-[#0E6073] hover:border-[#0E6073]" autoFocus>Gérez les cours</button></Link>:<></>
                    }
                    {admin && props.selected === 5 ?
                        <Link href={`/admin/users`}><button className="px-10 h-full font-semibold border-[#0E6073] border-b-4 text-[#0E6073]" autoFocus>Gérez les utilisateurs</button></Link> :
                        admin && props.selected === 404 ?
                            <Link href={`/admin/users`}><button className="px-10 h-full font-semibold border-[#fff] border-b-4 text-[#fff]" autoFocus>Gérez les utilisateurs</button></Link> :
                            admin ? <Link href={`/admin/users`}><button className="px-10 h-full font-semibold border-transparent border-b-4 hover:text-[#0E6073] hover:border-[#0E6073]" autoFocus>Gérez les utilisateurs</button></Link>:<></>
                    }
                </div>
                <div className="flex justify-center items-center gap-5 mb-1">
                    <div className="bg-white dark:bg-[#041F25] flex flex-row justify-start items-center width w-96 h-12 px-8 rounded-full shadow-[inset_4px_5px_12px_4px_rgba(0,0,0,0.25)]">
                        <HiMagnifyingGlass className="h-8 w-8 text-[#989898] dark:text-[#63AEAB]" />
                        <input className="h-10 shadow-none w-full bg-transparent text-black dark:text-[#63AEAB] ml-1" type="text" />
                    </div>
                    {sessionData && sessionData.user?.image && props.selected === 4 ? <Link href={`/users/${sessionData.user.id}`} className="block h-[3rem] w-[3rem]"><img src={sessionData.user.image} className="w-full h-full rounded-full border-4 border-[#0E6073] dark:border-[#63AEAB] object-cover"></img></Link>:
                    sessionData && sessionData.user?.image && <Link href={`/users/${sessionData.user.id}`} className="block h-[3rem] w-[3rem]"><img src={sessionData.user.image} className="w-full h-full rounded-full object-cover"></img></Link>}
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-2 min-h-screen top-0 left-0 bg-[#0E6073] fixed m-w-xs p-2">
                <Link href="/"><img src="/logo-carre.png" className="max-w-[3rem]"></img></Link>
                <div className="flex flex-col items-center justify-between">
                    <button onClick={() => theme === "dark" ? setTheme('light') : setTheme("dark")} className="flex flex-row justify-center items-center rounded-full bg-white/10 w-10 h-10 shadow-md">
                    {theme == "dark" ? <FaSun className="w-2/5 text-[#fff]" /> : <FaMoon className="w-2/5 text-[#fff]" />}
                    </button>
                    <AuthShowcase />
                </div>
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