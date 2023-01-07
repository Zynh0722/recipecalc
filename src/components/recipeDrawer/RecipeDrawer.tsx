type Props = {
    enabled: boolean;
    closeDrawer: () => void;
    recipes: { id: string; name: string }[] | undefined;
};

export default function RecipeDrawer({ enabled, closeDrawer, recipes }: Props) {
    return (
        <div
            className={`fixed z-10 h-screen w-96 overflow-y-auto bg-neutral-800 p-4 ${
                enabled ? "" : "-translate-x-96"
            } duration-250 transition-transform ease-in`}
        >
            <h5 className="mb-4 inline-flex items-center text-base font-semibold text-neutral-100">
                Recipes
            </h5>
            <button
                onClick={closeDrawer}
                className="absolute top-2.5 right-2.5 inline-flex rounded-lg bg-transparent p-1.5 text-neutral-100 transition hover:bg-white/20"
            >
                <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    ></path>
                </svg>
            </button>
            <ul>
                {recipes?.map((recipe) => (
                    <li key={recipe.id}>{recipe.name}</li>
                ))}
            </ul>
        </div>
    );
}
