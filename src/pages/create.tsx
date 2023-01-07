import type { NextPage } from "next";
import { trpc } from "utils/trpc";
import { getSession, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import RecipeMaker from "components/RecipeMaker";
import Image from "next/image";
import type { GetServerSidePropsContext } from "next";
import RecipeDrawer from "components/recipeDrawer/RecipeDrawer";
import { useKeybind } from "hooks/useKeybind";

const CreatePage: NextPage = () => {
    const context = trpc.useContext();
    const { data: session } = useSession();
    const { data: recipes } = trpc.recipe.getRecipes.useQuery();
    const [drawer, setDrawer] = useState(false);
    const addRecipe = trpc.recipe.addRecipe.useMutation({
        onSuccess: () => context.recipe.invalidate(),
    });

    useKeybind("Escape", () => {
        setDrawer(false);
    });

    function makeRecipe(name: string) {
        addRecipe.mutate({ name });
    }

    return (
        <div className="h-screen bg-neutral-900">
            {/* Header */}
            <div className="absolute flex w-screen justify-between bg-neutral-900">
                <div className="p-4 text-2xl font-extrabold tracking-tight text-white">
                    {session && (
                        <>
                            <Image
                                className="mr-2 mb-1 hidden rounded-full sm:inline"
                                src={session?.user?.image ?? ""}
                                alt="User profile image"
                                width={35}
                                height={35}
                            />
                            <span className="text-teal-700">
                                {session?.user?.name ?? "Anon"}
                            </span>
                        </>
                    )}
                </div>
                <button
                    onClick={() => setDrawer(!drawer)}
                    className="m-4 rounded-full bg-white/10 px-5 py-2 font-semibold text-neutral-100 no-underline transition hover:bg-white/20"
                >
                    Drawaruwu
                </button>
                <button
                    onClick={() => signOut()}
                    className="m-4 rounded-full bg-white/10 px-5 py-2 font-semibold text-neutral-100 no-underline transition hover:bg-white/20"
                >
                    Sign&nbsp;Out
                </button>
            </div>

            <RecipeDrawer
                recipes={recipes}
                closeDrawer={() => setDrawer(false)}
                enabled={drawer}
            />
            <RecipeMaker recipes={recipes} makeRecipe={makeRecipe} />
        </div>
    );
};

export const getServerSideProps = async ({
    req,
}: GetServerSidePropsContext) => {
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: { destination: "/" },
        };
    }

    return {
        props: {},
    };
};

export default CreatePage;
