import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { getSession, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import RecipeMaker from "../components/RecipeMaker";
import Image from "next/image";
import type { GetServerSidePropsContext } from "next";

type RecipeWithUses = {
    id: string;
    name: string;
    uses: {
        quantity: number;
        used: {
            id: string;
            name: string;
        };
    }[];
};

const Recipe: React.FC<{ recipe: RecipeWithUses }> = ({ recipe }) => {
    const [opened, setOpened] = useState(false);

    return <li className="flex snap-start snap-always max-w-xs gap-4 justify-between rounded-xl bg-white/10 p-2 text-neutral-100 hover:bg-white/20" onClick={() => setOpened(!opened)}>
        <div>
            {recipe.name}
            {(opened) ? <ul>
                {recipe.uses.map(({quantity, used}) => <li className="text-sm pl-2" key={used.id}> {`${quantity} - ${used.name}`}</li>)}
            </ul> : null}
        </div>
        <div className="select-none">{(recipe.uses.length >= 1) ? (!opened) ? "<" : "v" : null}</div>
    </li>
};

const CreatePage: NextPage = () => {
    const { data: session } = useSession();
    const { data: recipes, ...query } = trpc.recipe.getRecipes.useQuery();
    const addRecipe = trpc.recipe.addRecipe.useMutation({ onSuccess: () => query.refetch() });
    // const addUse = trpc.recipe.addUse.useMutation({ onSuccess: () => query.refetch() });

    function makeRecipe(name: string) {
        addRecipe.mutate({ name })
    }

    return <div className="min-h-screen max-h-screen bg-neutral-900 overflow-clip">
        {/* Header */}
        <div className="flex justify-between">
            <div className="font-extrabold tracking-tight text-white text-2xl p-4">
                {session && <>
                    <Image className="inline mr-2 mb-1 rounded-full" src={session?.user?.image ?? ""} alt="User profile image" width={35} height={35} />
                    <span className="text-teal-700">{session?.user?.name ?? "Anon"}</span>
                </>}
            </div>
            <button onClick={() => signOut()} className="rounded-full m-4 bg-white/10 px-5 py-2 font-semibold text-neutral-100 no-underline transition hover:bg-white/20">
                Sign Out
            </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-2 justify-evenly max-h-screen">
            {/* Recipes */}
            <ul className="flex flex-col snap-y snap-mandatory gap-1 px-4 pb-8 max-h-screen overflow-scroll">
                {recipes?.map(recipe => <Recipe key={recipe.id} recipe={recipe} />)}
            </ul>

            {/* Form */}
            <div className="flex flex-col max-h-full justify-center text-center">
                <RecipeMaker recipes={recipes} makeRecipe={makeRecipe} />
            </div>
        </div>
    </div>
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: { destination: "/" }
        };
    }

    return {
        props: {}
    }
}

export default CreatePage;