import { useCallback, useEffect } from "react";

export function useKeybind(key: string, cb: () => void) {
    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === key) {
                cb();
            }
        },
        [key, cb]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);
}
