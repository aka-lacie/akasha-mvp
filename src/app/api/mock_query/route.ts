import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  if(process.env["CURR_ENV"] === 'DEV'){
    const encoder = new TextEncoder();

    const loremLines = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, ",
      "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ",
      "nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in ",
      "reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla",
      "pariatur. Excepteur sint occaecat cupidatat non proident, sunt in ",
      "culpa qui officia deserunt mollit anim id est laborum."
    ]
    const snippetsMessage = {
      type: 'snippets',
      data: loremLines
    }
    const responseMessage = {
      type: 'response',
      data: {
        brainstorm: ['brainstorm1', 'brainstorm2'],
        answer: loremLines.join(''),
      },
    }
    const start = async (controller: ReadableStreamDefaultController<Uint8Array>) => {
      controller.enqueue(encoder.encode(JSON.stringify(snippetsMessage) + '\n'))
      setTimeout(()=>{
        controller.enqueue(encoder.encode(JSON.stringify(responseMessage) + '\n'))
        controller.close()
      }, 1000)
    }
    const stream = new ReadableStream({start})
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } else {
    return new Response(JSON.stringify({ type: 'error', data: 'This endpoint is not available in production.' }), {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }
}
