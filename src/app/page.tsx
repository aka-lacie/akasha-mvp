import Image from 'next/image'
import AkashaTerminalInterface from './components/AkashaTerminalInterface'
import { ThemeProvider } from './components/ThemeProvider'
import DarkModeToggle from './components/DarkModeToggle'

export default function Home() {
  return (
    <ThemeProvider attribute="class">
      <main className="flex min-h-screen max-w-[100vw] flex-col items-center justify-between p-24">
        <Image
          src="/akasha_symbol.svg"
          alt="Akasha Symbol"
          className="z-0 fixed top-1/2 scale-110 md:top-[60%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 opacity-30 dark:opacity-50 filter blur md:blur-md"
          width={900}
          height={900}
          priority
        />
        <div className="z-40 fixed top-[5%] left-[5%]">
            <DarkModeToggle />
        </div>
        <div className="z-10 w-full items-center justify-between font-mono text-lg lg:flex">
          <div className="ml-10 flex w-auto justify-center dark:from-inherit lg:static lg:w-auto lg:ml-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold font-serif">AKASHA</h1>
              <h2 className="text-2xl font-medium">-Terminal-</h2>
            </div>
            <span className="ml-1 px-2 py-1 h-[1.8rem] text-justify rounded-full bg-green-200 text-green-800 text-xs font-bold font-sans border-2 border-green-500">alpha</span>
          </div>
          {/* <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href="https://twitter.com/aka_lacie"
              target="_blank"
              rel="noopener noreferrer"
            >
              By aka-lacie
            </a>
          </div> */}
        </div>

        <AkashaTerminalInterface />

      </main>
    </ThemeProvider>
  )
}
