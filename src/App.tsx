import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Example } from './Example'

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Example />
            <ReactQueryDevtools initialIsOpen />
        </QueryClientProvider>
    );
}

export default App;
