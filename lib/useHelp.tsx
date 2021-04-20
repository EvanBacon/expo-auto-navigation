import * as React from "react";
import { Platform } from "react-native";

export type UseStateHook<T> = [
    { value: T | null; error: Error | null },
    (value: T | null) => void
];

export function useForceUpdate(): {
    readonly forceUpdate: () => void;
} {
    const [, setState] = React.useState(false);
    const forceUpdate = React.useCallback(() => {
        setState((e) => !e);
    }, [setState]);
    return { forceUpdate };
}

export function useSafeState<T>(initialValue?: {
    value: T | null;
    error: Error | null;
}) {
    return React.useReducer(
        (
            state: { value: T | null; error: Error | null },
            action: Partial<{ value: T | null; error: Error | null }>
        ) => ({
            error: action.error === undefined ? null : action.error,
            value: action.value === undefined ? null : action.value,
        }),
        initialValue ?? { value: null, error: null }
    );
}

export function useResolvedValue<T>(
    method: () => Promise<T>
): { value: T | null; error: Error | null } {
    const [state, setState] = useSafeState<T>();
    const isMounted = useMounted();

    React.useEffect(() => {
        setState({});

        method()
            .then((value) => {
                if (isMounted.current) {
                    setState({ value });
                }
            })
            .catch((error) => {
                if (isMounted.current) {
                    setState({ error });
                }
            });
    }, [method]);

    return state;
}

export function useMounted() {
    return React.useRef(true);
}

export function getRemoteFileURLForMetro(
    baseUrl: string,
    filePath: string
): string {
    const shallow = false;
    // `http://192.168.1.76:19000/screens/home.bundle?platform=ios&dev=true&hot=false&minify=false`
    // modulesOnly=true
    // http://192.168.1.76:19000/screens/home.bundle?platform=ios&dev=true&hot=false&minify=false&modulesOnly=true&shallow=true&runModule=false
    return `${baseUrl}${filePath}?platform=${Platform.OS}&dev=${String(
        __DEV__
    )}&hot=false&minify=${String(
        !__DEV__
    )}&modulesOnly=true&shallow=${shallow}&runModule=true`;
    // return `${baseUrl}${filePath}?platform=${Platform.OS}&dev=${String(__DEV__)}&hot=false&minify=${String(!__DEV__)}&modulesOnly=true&shallow=true&runModule=false`
}

export function useJSONRequest<T extends Record<string, any>>(
    url?: string,
    init?: RequestInit
): { value: T | null; error: Error | null } {
    const [state, setState] = useSafeState<T>();
    const isMounted = useMounted();

    React.useEffect(() => {
        if (!url) {
            return;
        }
        fetch(url, init)
            .then((data) => data.json())
            .then((value) => {
                if (isMounted.current) setState({ value });
            })
            .catch((error) => {
                if (isMounted.current) setState({ error });
            });
    }, [url]);

    return state;
}
