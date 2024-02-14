import Image from 'next/image'
import AkashaTerminalInterface from '@/components/terminal_components/AkashaTerminalInterface'
import { ThemeProvider } from '@/components/ThemeProvider'
import Sidebar from '@/components/sidebar_components/Sidebar'

export default function Home() {
  return (
    <ThemeProvider attribute="class">
      <main className='overflow-hidden h-screen relative z-0 flex flex-col justify-between'>

        <Image
          src="/akasha_symbol.svg"
          alt="Akasha Symbol"
          className="-z-10 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30 dark:opacity-50 md:w-[450px] md:h-[450px] filter blur md:blur-md"
          width={250}
          height={250}
          priority
        />
        
        <Sidebar />


        <div className='flex flex-col items-center'>
          <div className="flex pt-12">
            <div className="text-center pl-12">
              <h1 className="text-4xl font-bold font-serif">AKASHA</h1>
              <h2 className="text-2xl font-medium font-mono">-Terminal-</h2>
            </div>
            <span className="ml-1 px-2 py-1 h-[1.8rem] text-justify rounded-full bg-green-200 text-green-800 text-xs font-bold font-sans border-2 border-green-500">alpha</span>
          </div>
        </div>


        <AkashaTerminalInterface />
        
        <div className='pb-4 sm:pb-12'>
          <p className="font-mono text-center">
            Knowledge cutoff: version 4.2
          </p>
          <div className='sm:py-2'/>
          <div className="flex justify-center gap-5">
            <a
              className="flex items-center gap-2 p-0 lg:p-0"
              href="https://twitter.com/aka_lacie"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-twitter text-[#26a7de] drop-shadow" aria-hidden="true"></i>
              <p className="inline-block font-mono">aka_lacie</p>
            </a>
            <div
              className="flex place-items-center gap-2 pointer-events-auto"
            >
              <i className="fa-brands fa-discord text-[#7289da] drop-shadow font-mono" aria-hidden="true"></i>
              <p className="inline-block font-mono">l_acie</p>
            </div>
          </div>
        </div>
        
      </main>
    </ThemeProvider>
  )
}
