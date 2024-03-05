import type { NextRequest } from 'next/server';

// IMPORTANT:
// this route is a mock just for testing and should never be accessible in production
// this is enforced by our route middleware

// USAGE:
// to mock a fetch request to "/api/query" change it to "/mock/api/query"
// send the string 'short' as the query to get a short response

// NOTE:
// currently using hacky setTimeout of 1s to simulate a delay between snippets and response
// this is necessary for the server-sent events to be properly spaced
// should probably fix the actual frontend code to not be dependent on time-spaced messages
// and then the setTimeout can be removed

const loremLines = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, ",
  "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ",
  "nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in ",
  "reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla",
  "pariatur. Excepteur sint occaecat cupidatat non proident, sunt in ",
  "culpa qui officia deserunt mollit anim id est laborum."
]

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const requestBody = await req.text();
  const short = JSON.parse(requestBody).query === 'short';

  const snippetsMessage = {
    type: 'snippets',
    data: loremLines
  }
  const responseMessage = {
    type: 'response',
    data: {
      brainstorm: ['brainstorm1', 'brainstorm2'],
      answer: short ? loremLines[0] : loremLines.join(''),
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
}

