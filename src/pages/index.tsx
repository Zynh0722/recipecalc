import { type NextPage } from "next";
import Head from "next/head";
import { getSession, signIn } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>RecipeCalc - Home</title>
                <meta
                    name="description"
                    content="A quick and simple recursive recipe solver"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        <span className="text-teal-700">RecipeCalc</span>
                    </h1>
                    <div className="flex flex-col items-center gap-2">
                        <button
                            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                            onClick={() => signIn()}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;

export const getServerSideProps = async ({
    req,
}: GetServerSidePropsContext) => {
    const session = await getSession({ req });

    if (session) {
        return {
            redirect: { destination: "/create" },
        };
    }

    return {
        props: {},
    };
};
