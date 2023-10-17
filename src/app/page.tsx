import Image from 'next/image'
import AkashaTerminalInterface from './components/AkashaTerminalInterface'
import { ThemeProvider } from './components/ThemeProvider'
import DarkModeToggle from './components/DarkModeToggle'

export default function Home() {
  return (
    <ThemeProvider attribute="class">
      <main className="flex min-h-[100svh] max-w-[100vw] flex-col items-center justify-between p-24">
        <Image
          src="/akasha_symbol.svg"
          alt="Akasha Symbol"
          className="z-0 fixed top-1/2 scale-110 md:top-[60%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 opacity-30 dark:opacity-50 filter blur md:blur-md"
          width={900}
          height={900}
          priority
        />
        <div className="z-40 fixed top-[5%] left-[5%] flex flex-col justify-center content-center gap-7 lg:gap-10">
            <DarkModeToggle />
            <i className="fas fa-cog fa-2xl ml-1 mb-4 text-gray-600 dark:text-gray-400 drop-shadow" />
            <i className="far fa-circle-question fa-2xl ml-1 text-gray-500 dark:text-gray-400 drop-shadow" />
        </div>
        <div className="z-10 w-full items-center justify-between font-mono text-lg lg:ml-10 lg:flex">
          <div className="ml-10 flex w-auto justify-center dark:from-inherit lg:static lg:w-auto lg:ml-10">
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
              Knowledge cutoff: version 4.0
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
