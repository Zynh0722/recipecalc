import type { Recipe } from "@prisma/client";
import { useState } from "react";

type Props = {
    makeRecipe: (name: string) => void;
    recipes: Recipe[] | undefined;
};

export default function RecipeAutoComplete({ makeRecipe }: Props) {
    const [input, setInput] = useState("");

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setInput("");
    };

    return (
        <div className="">
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
