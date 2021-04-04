import * as React from "react";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";



export function Example() {
    const { isLoading, error, data, isFetching } = useQuery("repoData", () =>
        fetch(
            "https://api.github.com/repos/tannerlinsley/react-query"
        ).then((res) => res.json())
    );

    if (isLoading) return <div>Loading...</div>;

    if (error instanceof Error)
        return <div>An error has occurred: {error.message}</div>;

    return (
        <div>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
            <strong>👀 {data.subscribers_count}</strong>{" "}
            <strong>✨ {data.stargazers_count}</strong>{" "}
            <strong>🍴 {data.forks_count}</strong>
            <div>{isFetching ? "Updating..." : ""}</div>
            <ReactQueryDevtools initialIsOpen />
        </div>
    );
}
