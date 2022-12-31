import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const CreatePage: NextPage = () => {
    const mutation = trpc.recipe.addRecipe.useMutation();
    const { data: recipes } = trpc.recipe.getRecipes.useQuery();
    const makeRecipe = () => {
        const recipe = recipes?.at(Math.floor(Math.random() * recipes.length))?.id;
        mutation.mutate({ name: (Math.random() + 1).toString(36).substring(7), uses: recipe ? [recipe] : [] })
    };

    return <>
        <Link href="/">Go Home!</Link>
        <div className="flex justify-center">
            <ul className="flex flex-col gap-1">
                {recipes?.map(recipe => <li className="bg-gray-200 px-2 py-1 rounded-md" key={recipe.id}>
                    {recipe.name}
                    <ul>
                        {recipe.uses.map(usedRecipe => <li key={usedRecipe.id}> - {usedRecipe.name}</li>)}
                    </ul>
                </li>)}
            </ul>
            <div className="flex">
                <button onClick={makeRecipe}>Make recipe!</button>
            </div>
        </div>
    </>
}

export default CreatePage;