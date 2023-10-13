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
          className="z-0 fixed top-[60%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 opacity-30 dark:opacity-50 filter blur-md"
          width={900}
          height={900}
          priority
        />
        <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
          <div className="z-40 fixed top-[5%] left-[5%]">
            <DarkModeToggle />
          </div>
          <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            AKASHA
          </p>
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
