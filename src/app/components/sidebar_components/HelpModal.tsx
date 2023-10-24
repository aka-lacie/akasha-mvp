import React from 'react'

export default function HelpModal({ toggleModal }: { toggleModal: () => void }) {
  return (
    <div 
      className="z-50 fixed top-0 left-0 w-full h-full flex items-start justify-start bg-black bg-opacity-50"
      onClick={toggleModal}
    >
      {/* Modal content */}
      <div 
        className="bg-gray-300 dark:bg-gray-600 rounded-lg p-6 w-96 shadow-lg relative lg:self-center slide-in max-h-full overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Close button */}
        <button 
            className="absolute top-2 right-2 text-xl font-bold leading-none hover:text-gray-600 dark:hover:text-gray-400" 
            onClick={toggleModal}
        >
            ×
        </button>

        {/* Rest of the content goes here */}
        <p><i>Akasha Terminal is a powerful & smart search engine knowledgeable about events, people, and things in Teyvat. Simply ask a question and allow Akasha to work its magic.</i></p>
        <br />
        <p><b>What should I ask about?</b></p>
        <p>Ask about anything related to Genshin Impact's lore.</p>
        <br />
        <p><b>What are the limitations?</b></p>
        <p>There are no plans to address gameplay knowledge, and English is the only supported language. Querying outside of the intended scope may cause hallucinations.</p>
        <br />
        <p><b>Can I look up Forbidden Knowledge?</b></p>
        <p>Yes, this advanced version of the Terminal has special privileges and access to even knowledge that has been erased from the Irminsul. However, one type of Forbidden Knowledge that is not included is current patch spoilers, for it is too dangerous. Mind the knowledge cutoff at the bottom of the page.</p>
        <br />
        <p><b>How does this work?</b></p>
        <p>Akasha is an application built using a large language model (LLM) with retrieval-augmented generation (RAG). Currently the knowledge-base is curated from Genshin Wiki.</p>
        <br />

        <p><b>Contact</b></p>
        <div className="flex h-auto w-full items-end lg:items-start justify-start gap-5 lg:h-auto lg:w-auto lg:bg-none">
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
    </div>
  );
}

