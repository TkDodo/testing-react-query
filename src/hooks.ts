import { useQuery } from "@tanstack/react-query";

const fetchRepoData = (): Promise<{ name: string }> =>
  fetch("https://api.github.com/repos/tannerlinsley/react-query")
    .then((response) => response.json())
    .then((data) => data);

export function useRepoData() {
  return useQuery({
    queryKey: ["repoData"],
    queryFn: fetchRepoData,
  });
}
