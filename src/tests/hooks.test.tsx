import * as React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { createWrapper } from './utils'
import { useRepoData } from '../hooks'

test('my first test', async () => {
    const { result, waitFor } = renderHook(() => useRepoData(), {
        wrapper: createWrapper()
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data?.name).toBe('mocked-react-query')
})
