import { rest } from 'msw'
import { renderWithClient } from './utils'
import { server } from '../setupTests'
import { Example } from '../Example'

describe('query component', () => {
    test('successful query component', async () => {
        const result = renderWithClient(<Example />)

        expect(await result.findByText(/mocked-react-query/i)).toBeInTheDocument()
    })

    test('failure query component', async () => {
        server.use(
            rest.get('*', (req, res, ctx) => {
                return res(ctx.status(500))
            })
        )

        const result = renderWithClient(<Example />)

        expect(await result.findByText(/an error has occurred/i)).toBeInTheDocument()
    })
})
