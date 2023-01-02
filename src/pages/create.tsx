import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Recipe } from "@prisma/client";
import RecipeAutoComplete from "../components/RecipeAutoComplete";

type RecipeWithUses = Recipe & {
    uses: {
        id: string;
        name: string;
    }[];
};

const Recipe: React.FC<{ recipe: RecipeWithUses }> = ({ recipe }) => {
    const [opened, setOpened] = useState(false);

    return <li className="flex max-w-xs gap-4 justify-between rounded-xl bg-white/10 p-2 text-white hover:bg-white/20" onClick={() => setOpened(!opened)}>
        <div>
            {recipe.name}
            {(opened) ? <ul>
                {recipe.uses.map(usedRecipe => <li className="text-sm pl-2" key={usedRecipe.id}> {`- ${usedRecipe.name}`}</li>)}
            </ul> : null}
        </div>
        <div className="select-none">{(recipe.uses.length >= 1) ? (!opened) ? "<" : "v" : null}</div>
    </li>
};

const CreatePage: NextPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { data: recipes, ...query } = trpc.recipe.getRecipes.useQuery();
    const addRecipe = trpc.recipe.addRecipe.useMutation({onSuccess: () => query.refetch()});

    // non-inclusive max
    function randIntFromMax(max: number) {
        return Math.floor(Math.random() * max);
    }

    function randomNFromArray(n: number, array: string[]) {
        if (n > array.length) return array;
        if (n <= 0) return []; 

        const indecies: number[] = [];
        while (indecies.length < n) {
            const attempt = Math.min(randIntFromMax(n), randIntFromMax(10));
            if (indecies.indexOf(attempt) === -1) {
                indecies.push(attempt);
            }
        }

        const out: string[] = [];
        for (const i of indecies) {
            const val = array[i];
            if (val !== undefined) {
                out.push(val);
            }
        }

        return out;
    }

    function makeRandomRecipe() {
        const uses = (recipes) ? randomNFromArray(Math.floor(Math.random() * recipes.length), recipes.map(r => r.id)) : [];
        addRecipe.mutate({ name: (Math.random() + 1).toString(36).substring(7), uses})
    }

    function makeRecipe(name: string) {
        const uses = (recipes) ? randomNFromArray(Math.floor(Math.random() * recipes.length), recipes.map(r => r.id)) : [];
        addRecipe.mutate({ name, uses })
    }

    useEffect(() => {
        if (session?.user === undefined && status !== "loading") {
            router.push('/');
        }
    }, [session, router, status]);

    if (!session) { return <div>Access Denied!</div> }

    return <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex justify-between">
            <Link href="/" className="rounded-full m-2 bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                Go Home!
            </Link>
            <div className="font-extrabold tracking-tight text-white sm:text-[2rem] m-2">Hello <span className="text-[hsl(280,100%,70%)]">{session.user?.name}</span></div>
        </div>
        <div className="flex justify-evenly">
            <ul className="flex flex-col gap-1">
                {recipes?.map(recipe => <Recipe key={recipe.id} recipe={recipe} />)}
            </ul>
            <div className="flex-col justify-center text-center">
                <RecipeAutoComplete recipes={recipes} makeRecipe={makeRecipe} />
            </div>
        </div>
    </div>
}

export default CreatePage;