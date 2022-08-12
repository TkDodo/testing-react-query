import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const fetchRepoData = (): Promise<{ name: string }> =>
    axios
        .get('https://api.github.com/repos/tannerlinsley/react-query')
        .then((response) => response.data)

export function useRepoData() {
    return useQuery(['repoData'], fetchRepoData)
}
