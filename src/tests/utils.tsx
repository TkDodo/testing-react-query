import { render } from '@testing-library/react'
import { rest } from "msw";
import * as React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

export const handlers = [
    rest.get(
        "https://api.github.com/repos/tannerlinsley/react-query",
        (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json({
                    name: "mocked-react-query"
                })
            );
        }
    )
];

const testQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})


export function renderWithClient(ui: React.ReactElement) {
    const { rerender, ...result } = render(
        <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    )
    return {
        ...result,
        rerender: (rerenderUi: React.ReactElement) =>
            rerender(
                <QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>
            ),
    }
}

export function createWrapper() {
    return ({ children }: {children: React.ReactNode}) => (
        <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    )
}
