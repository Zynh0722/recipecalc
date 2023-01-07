import type { GetServerSidePropsContext } from "next";
import type { ClientSafeProvider } from "next-auth/react";
import { getProviders, getSession, signIn } from "next-auth/react";

export default function SignIn({
    providers,
}: {
    providers: ClientSafeProvider[];
}) {
    return (
        <main className="h-screen w-screen bg-neutral-900">
            <ul className="flex h-full flex-col items-center justify-center gap-2">
                {Object.values(providers).map((provider) => (
                    <li key={provider.name}>
                        <button
                            onClick={() => signIn(provider.id)}
                            className="rounded-lg bg-teal-700 p-2 px-4 text-neutral-200"
                        >
                            Sign in with {provider.name}
                        </button>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export const getServerSideProps = async ({
    req,
}: GetServerSidePropsContext) => {
    const session = await getSession({ req });

    if (session) {
        return {
            redirect: { destination: "/" },
        };
    }

    const providers = await getProviders();
    return {
        props: { providers },
    };
};
