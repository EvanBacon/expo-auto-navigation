import * as React from "react";

export type UseStateHook<T> = [
    { value: T | null; error: Error | null },
    (value: T | null) => void
];

export function useForceUpdate(): () => void {
    const [, setState] = React.useState(false);
    const forceUpdate = React.useCallback(() => {
        setState((e) => !e);
    }, [setState]);
    return forceUpdate;
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
                if (isMounted.current) setState({ value });
            })
            .catch((error) => {
                if (isMounted.current) setState({ error });
            });
    }, [method]);

    return state;
}

export function useMounted() {
    return React.useRef(true);
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
