import type { GetServerSidePropsContext } from "next";
import type { ClientSafeProvider } from "next-auth/react";
import { getProviders, getSession, signIn } from "next-auth/react"

export default function SignIn({ providers }: { providers: ClientSafeProvider[] }) {
    return (
        <>
            <div className="h-screen w-screen bg-neutral-900">
                <ul className="flex flex-col h-full justify-center items-center gap-2">
                    {Object.values(providers).map((provider) => (
                        <li key={provider.name}>
                            <button onClick={() => signIn(provider.id)} className="p-2 px-4 rounded-lg bg-teal-700 text-neutral-200">
                                Sign in with {provider.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const session = await getSession({ req });

    if (session) {
        return {
            redirect: { destination: "/" }
        };
    }

    const providers = await getProviders();
    return {
        props: { providers },
    };
}