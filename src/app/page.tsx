import Image from 'next/image'
import AkashaTerminalInterface from '@/components/terminal_components/AkashaTerminalInterface'
import { ThemeProvider } from '@/components/ThemeProvider'
import Sidebar from '@/components/sidebar_components/Sidebar'

export default function Home() {
  return (
    <ThemeProvider attribute="class">
      <main className="flex min-h-[100svh] max-w-[100vw] flex-col items-center justify-between p-24">
        <Image
          src="/akasha_symbol.svg"
          alt="Akasha Symbol"
          className="z-0 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30 dark:opacity-50 md:w-[450px] md:h-[450px] filter blur md:blur-md"
          width={250}
          height={250}
          priority
        />
        
        <Sidebar />

        <div className="z-10 w-auto items-center justify-between font-mono text-lg xl:absolute xl:top-[5%] xl:left-[10%] xl:flex">
          <div className="ml-10 flex w-auto justify-center dark:from-inherit lg:static">
            <div className="text-center">
              <h1 className="text-4xl font-bold font-serif">AKASHA</h1>
              <h2 className="text-2xl font-medium">-Terminal-</h2>
            </div>
            <span className="ml-1 px-2 py-1 h-[1.8rem] text-justify rounded-full bg-green-200 text-green-800 text-xs font-bold font-sans border-2 border-green-500">alpha</span>
          </div>
        </div>

        <AkashaTerminalInterface />
        
        <div className="z-40 static bottom-0 left-0 mt-10 flex flex-col font-mono gap-4">
          <p className="flex whitespace-nowrap place-items-center p-0 lg:p-0">
            Knowledge cutoff: version 4.2
          </p>
          <div className="flex h-auto w-full items-end lg:items-start justify-center gap-5 lg:h-auto lg:w-auto lg:bg-none">
            <a
              className="flex items-center gap-2 p-0 lg:p-0"
              href="https://twitter.com/aka_lacie"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-twitter text-[#26a7de] drop-shadow" aria-hidden="true"></i>
              <p className="inline-block">aka_lacie</p>
            </a>
            <p
              className="flex place-items-center gap-2 p-0 pointer-events-auto lg:p-0"
            >
              <i className="fa-brands fa-discord text-[#7289da] drop-shadow" aria-hidden="true"></i>
              l_acie
            </p>
          </div>
        </div>
      </main>
    </ThemeProvider>
  )
}
