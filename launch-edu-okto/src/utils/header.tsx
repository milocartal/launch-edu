import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { HiMagnifyingGlass } from "react-icons/hi2";

import { api } from "~/utils/api";

const Header = () => {
  const { data: sessionData } = useSession();
  const admin = sessionData?.user.admin

    return (
    <>
    <div className="fixed w-full pr-40 border-b-4 border-[#63aeab] bg-white top-0 right-0 left-28 h-[4rem]" /><div className="flex item-center justify-between gap-12 fixed w-full pr-40 top-0 right-0 left-28 h-[4rem] text-[#63aeab]">
         <div className="flex item-center justify-evenly">
             <button className="px-10 py-3 font-semibold border-[#0E6073] transition hover:border-b-4 hover:text-[#0E6073]">Vos cours</button>
             <button className="px-10 py-3 font-semibold border-[#0E6073] border-b-4 text-[#0E6073]">Explorer</button>
             
             {admin && <button className="px-10 py-3 font-semibold border-[#0E6073] transition hover:border-b-4 hover:text-[#0E6073]" autoFocus>Gérez les cours</button>}
         </div>
         <div className="flex item-center justify-center gap-5">
             <div className="bg-white flex flex-row justify-start items-center width mb-24 w-96 h-12 flex flex-row px-8 rounded-full shadow-[inset_4px_4px_12px_4px_rgba(0,0,0,0.25)]">
                 <HiMagnifyingGlass className="h-8 w-8 text-[#989898]" />
                 <input className="h-10 shadow-none w-full bg-transparent" type="text" />
             </div>
             {sessionData && sessionData.user?.image && <Link href={`/components/users/${sessionData.user.id}`}><img src={sessionData.user.image} className="max-w-[3rem]"></img></Link>}
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
          {sessionData?.user.admin && <Link href="/components/admin"><img src="https://icones.pro/wp-content/uploads/2022/02/services-parametres-et-icone-d-engrenage-gris.png" className="max-w-[3rem]"></img></Link>}
          <button
            className="rounded-full px-3 py-3 font-semibold  no-underline transition hover:bg-white/10"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? <img src="/arrow.png" className="max-w-[1.5rem]"></img> : "Sign in"}
          </button>
        </div>
    
      );
    };