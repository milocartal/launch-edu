import { type NextPage } from "next";
import Link from "next/link";

const Login: NextPage = () => {
    return (
        <main className="flex flex-row h-screen bg-white justify-between dark:bg-[#082F38]">
            <section className="flex max-h-screen flex-col items-center justify-center w-8/12 bg-[#0E6073] bg-[url('/login_bg.png')] bg-no-repeat bg-cover">
                <div className="flex flex-col items-center justify-center w-72">
                    <h2 className="text-3xl mb-16 mt-12 text-white">Connexion</h2>
                    <input
                        type='url'
                        name="urlVideoExo"
                        placeholder="Identifiant"
                        className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full mb-5"
                        autoComplete="off" />
                    <input
                        type='url'
                        name="urlVideoExo"
                        placeholder="Mot de passe"
                        className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full mb-5"
                        autoComplete="off" />
                    <Link href={""} className="text-white w-full bg-[#0E6073] h-14 rounded-full mt-5 self-end hover:bg-[#0a4654] flex flex-row justify-center items-center">Se connecter</Link>
                </div>
            </section>
            <section className="flex max-h-screen flex-col items-center justify-center w-5/12 white">
                <div className="flex flex-col items-center justify-center w-72">
                    <h2 className="text-3xl mb-16 mt-12 text-[#0E6073] dark:text-white">Créer un compte</h2>
                    <input
                        type='url'
                        name="urlVideoExo"
                        placeholder="Identifiant"
                        className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full mb-5"
                        autoComplete="off" />
                    <input
                        type='url'
                        name="urlVideoExo"
                        placeholder="Mot de passe"
                        className="p-[1rem] rounded-lg bg-none dark:bg-[#041F25] shadow-[inset_4px_5px_12px_6px_rgba(0,0,0,0.25)] w-full mb-5"
                        autoComplete="off" />
                    <Link href={""} className="text-white w-full bg-[#0E6073] h-14 rounded-full mt-5 self-end hover:bg-[#0a4654] flex flex-row justify-center items-center">Commencer</Link>
                </div>
            </section>
        </main>
    );
};

export default Login;