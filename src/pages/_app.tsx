import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import Aside from '../components/Aside';
import AppProvider from '../hooks';
//import "tailwindcss/tailwind.css";

import "../styles/globals.css";

//if (typeof window !== "undefined") document.documentElement.classList.remove('dark');
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <div className="flex flex-row- flex-col-reverse">
        <Aside />
        <main className="h-screen- flex items-center">
          <div className="max-w-[1124px] border-1 mx-auto pl-2 h-full- my-16-">
            <SWRConfig
              value={{
                //refreshInterval: 3000,
                fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
              }}
            >
              <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
              </QueryClientProvider>
            </SWRConfig>
          </div>
        </main>
      </div>
    </AppProvider>
  );
}

export default MyApp
