import axios, { AxiosPromise } from "axios";
import {
    QueryClient,
    QueryClientProvider,
    QueryKey,
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { PropsWithChildren } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";

type User = {
    name: string;
    email: string;
};

const createUser: (user: User) => AxiosPromise<User> = (user: User) =>
    axios.post("/api/users", user);

const fetchUsers: () => AxiosPromise<User[]> = () => axios.get("/api/users");

function updateQueryData<T>(
    key: string,
    queryPredicate: (keys: QueryKey) => boolean,
    updater: T | ((data?: T) => T),
    queryClient: QueryClient
) {
    const queries = queryClient.getQueriesData([key]);
    const query = queries.find(([queryKey]) => queryPredicate(queryKey));

    if (!query) {
        return;
    }

    queryClient.setQueryData(
        query[0],
        typeof updater === "function" ? updater : () => updater
    );
}

function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["users", "create"],
        async mutationFn(user: User) {
            const { data } = await createUser(user);
            return data;
        },
        onSuccess(newUser: User) {
            updateQueryData<User[]>(
                "users",
                (queryKey) => queryKey.includes("users"),
                (data) => [...(data ?? []), newUser],
                queryClient
            );
        }
    });
}

const useGetAll = () =>
    useQuery({
        queryKey: ["users", "all"],
        async queryFn() {
            const { data } = await fetchUsers();
            return data;
        }
    });

const MOCK_USERS = [
    {
        name: "John Doe",
        email: "john@doe.com"
    }
] as User[];

const server = setupServer(
    rest.post("*/api/users", (req, res, context) => {
        return res(context.status(201), context.json(req.body));
    }),
    rest.get("*/api/users", (req, res, context) => {
        return res(context.status(200), context.json(MOCK_USERS));
    })
);

const queryClient = new QueryClient({
    logger: { error() {}, log: console.log, warn: console.warn },
    defaultOptions: {
        queries: {
            staleTime: 0,
            retry: false
        }
    }
});

const wrapper = ({ children }: PropsWithChildren<unknown>) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeAll(() => {
    server.listen({ onUnhandledRequest: "bypass" });
});

afterEach(() => {
    server.resetHandlers();
    queryClient.clear();
});

afterAll(() => server.close());

describe("RQ Debug", () => {
    it("should update query data", async () => {
        const { result: query } = renderHook(
            () => useGetAll(),
            { wrapper }
        );
        const { result: mutation } = renderHook(
            () => useCreate(),
            { wrapper }
        );

        await waitFor(() => expect(query.current.isSuccess).toBeTruthy());
        expect(query.current.data).toEqual(MOCK_USERS);

        const newUser = { name: "Bill Gates", email: "bill@gates.com" };

        act(() => {
            mutation.current.mutate(newUser);
        });

        await waitFor(() => expect(mutation.current.isSuccess).toBeTruthy());
        expect(query.current.data).toEqual([...MOCK_USERS, newUser]);
    });
});
