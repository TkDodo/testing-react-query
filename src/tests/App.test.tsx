import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Example } from '../Example'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

function renderWithClient(ui: React.ReactElement) {
    const { rerender, ...result } = render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    )
    return {
        ...result,
        rerender: (rerenderUi: React.ReactElement) =>
            rerender(
                <QueryClientProvider client={queryClient}>{rerenderUi}</QueryClientProvider>
            ),
    }
}

test('my second test', async () => {
    const result = renderWithClient(<Example />)

    await waitFor(() => result.getByText(/name/))

    expect(result.getByText(/name/)).toHaveTextContent('mocked-react-query')
})
