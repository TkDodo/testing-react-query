import { rest } from 'msw'
import * as React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { server } from '../setupTests'
import { createWrapper } from './utils'
import { useRepoData } from '../hooks'

describe('query hook', () => {
    test('successful query hook', async () => {
        const { result, waitFor } = renderHook(() => useRepoData(), {
            wrapper: createWrapper()
        })

        await waitFor(() => result.current.isSuccess)

        expect(result.current.data?.name).toBe('mocked-react-query')
    })

    test('isFetching for disabled queries', async () => {
        const { result, waitFor } = renderHook(() => useRepoData(), {
            wrapper: createWrapper()
        })

        expect(result.current).toMatchObject({
            isLoading: true,
            isFetching: true,
            data: undefined,
        });

        await waitFor(() => result.current.isSuccess)

        expect(result.current.data?.name).toBe('mocked-react-query')

        act(() => {
            result.current.refetch()
        })

        await waitFor(() => result.current.isFetching)

        expect(result.current).toMatchObject({
            isLoading: false,
            isFetching: true,
        })

        await waitFor(() => !result.current.isFetching)

        expect(result.current).toMatchObject({
            isLoading: false,
            isSuccess: true,
            isFetching: false,
        })
    })

    test('failure query hook', async () => {
        server.use(
            rest.get('*', (req, res, ctx) => {
                return res(ctx.status(500))
            })
        )

        const { result, waitFor } = renderHook(() => useRepoData(), {
            wrapper: createWrapper()
        })

        await waitFor(() => result.current.isError)

        expect(result.current.error).toBeDefined()
    })
})
