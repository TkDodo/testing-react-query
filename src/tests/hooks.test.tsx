import * as React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { renderHook } from '@testing-library/react-hooks'
import { setupServer } from 'msw/node'
import { useRepoData } from '../hooks'
import { handlers } from '../mocks/handlers'

export const server = setupServer(...handlers)

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })
    return ({ children }: {children: React.ReactNode}) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

test('my first test', async () => {
    const { result, waitFor } = renderHook(() => useRepoData(), {
        wrapper: createWrapper()
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data?.name).toBe('mocked-react-query')
})
