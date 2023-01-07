import { useState } from "react";
// import { trpc } from "../utils/trpc";

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

type Props = {
    makeRecipe: (name: string) => void;
    recipes: RecipeWithUses[] | undefined;
};

export default function RecipeMaker({ makeRecipe }: Props) {
    const [input, setInput] = useState("");
    // const [editing, setEditing] = useState("");
    // const editMutation = trpc.recipe.updateRecipe.useMutation({});

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setInput("");
    };

    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <form onSubmit={submit} className="flex flex-col justify-center">
                <input
                    value={input}
                    onChange={({ target: { value } }) => setInput(value)}
                    className="rounded-full bg-white/10 py-2 px-6 text-white"
                ></input>
                <button
                    type="submit"
                    className="m-2 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                    onClick={() => {
                        makeRecipe(input);
                    }}
                >
                    Make recipe!
                </button>
            </form>
        </div>
    );
}
