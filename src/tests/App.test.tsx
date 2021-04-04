import { waitFor } from '@testing-library/react'
import { renderWithClient } from './utils'
import { Example } from '../Example'

test('my second test', async () => {
    const result = renderWithClient(<Example />)

    await waitFor(() => result.getByText(/name/))

    expect(result.getByText(/name/)).toHaveTextContent('mocked-react-query')
})
