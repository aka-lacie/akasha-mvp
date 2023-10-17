import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

// MODELS
const EMBEDDING_MODEL = 'text-embedding-ada-002'
const GPT_MODEL = 'gpt-3.5-turbo-16k'

// CONFIG
const openai = new OpenAI()

const supabase_url = process.env["AKASHA_SUPABASE_URL"] || ''
const supabase_key = process.env["AKASHA_SUPABASE_KEY"] || ''
const supabaseClient : SupabaseClient = createClient(supabase_url, supabase_key)

const systemPrompt = 'You are the Akasha Terminal, a smart database able to access the collective knowledge of Teyvat stored in the Irminsul. You do not answer questions outside of the scope of Genshin Impact.'
const initialPrompt = `
  Use the data provided by the Irminsul to answer the given question. Answer in two parts labeled "Brainstorm" and "Answer". Note any info you read in the data relevant to the question in "Brainstorm". Write your conclusion and brief justification in "Answer", but keep it concise - every word counts. If you cannot determine any answer, write "The answer was not found within the Irminsul." Example: \
  1. Question: "What happened in Scaramouche\'s past?" \
  GPT Response: """Brainstorm: - Scaramouche was originally created as a test puppet body by Ei. - He settled in Tatarasuna and became close with Katsuragi. - Dottore infiltrated Tatarasuna and caused chaos with Crystal Marrow. -...[rest of brainstorm] Answer: Scaramouche was created as a test puppet body by Ei. He settled in Tatarasuna and formed a close relationship with Katsuragi. However, chaos ensued...[rest of answer]"""
`
// 2. Relevant but Unanswerable Question: "Where did Celestia come from?" \
// """Brainstorm: - Celestia is a place that floats in the sky and is said to be where the gods reside. - It is not mentioned in the provided data where Celestia came from. - Celestia is associated with the gods and is the place where humans may ascend if they obtain godhood...[rest of brainstorm] Answer: It is not clear where Celestia came from. However, Celestia is described as a place that floats in the sky and is associated with the gods. It is depicted as a floating island...[rest of answer]"""
// 3. Irrelevant Question: "What is the best car to buy right now?" \
// """"Brainstorm: [irrelevant data] Answer: This knowledge is beyond my reach. The answer was not found within the Irminsul.""" \
// 4. Meta Question: "Who/What are you?" \
// """Brainstorm: [irrelevant data] Answer: I am the Akasha Terminal, a knowledge interface connected to the collective data repository of the Irminsul."""'

const TESTMODE = false; // Doesn't make API calls in test mode
const testLoremIpsum: string[] = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Id donec ultrices tincidunt arcu non sodales neque sodales ut.",
  "Nulla posuere sollicitudin aliquam ultrices sagittis orci a. Mauris pharetra et ultrices neque ornare aenean euismod elementum nisi.",
  "Mauris pharetra et ultrices neque ornare aenean euismod elementum nisi.",
  "Mauris nunc congue nisi vitae suscipit tellus mauris.",
  "Imperdiet proin fermentum leo vel orci porta non.",
  "Odio euismod lacinia at quis risus sed.",
  "Iaculis at erat pellentesque adipiscing.",
  "Volutpat lacus laoreet non curabitur gravida.",
  "Elementum nibh tellus molestie nunc non blandit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
]
const testResponse: string = `Brainstorm:\n- Celestia is a place that floats in the sky and is said to be where the gods reside.\n- It is not mentioned in the provided data where Celestia came from.\n- Celestia is associated with the gods and is the place where humans may ascend if they obtain godhood.\n- The envoys of the gods walked among humanity in ancient times when life was weak and the earth was covered in unending ice.\n- Celestia is depicted as a floating island comprised of several landmasses with a central rock and smaller satellites.\n- The architecture of Celestia appears to have signs of disrepair and wear.\n- The central mass of Celestia descends deep below the surface level with a distinct inverted dome peeking out from the bottom.\n- Celestia is connected to the ley lines in the earth through the white Irminsul trees.\n\nAnswer:\nIt is not explicitly stated where Celestia came from. However, Celestia is described as a place that floats in the sky and is associated with the gods. While the origin of Celestia is not directly mentioned, it can be inferred that it is a celestial realm where the gods reside and is closely connected to the earth and its history.`;

console.log("Hello from Query API!")

// ============================================================
// SEARCH
// ============================================================
/**
 * Returns the embedding of the given query using OpenAI's embedding API.
 * @param query - The query to embed.
 * @returns A Promise that resolves to an array of numbers representing the embedding.
 */
const getQueryEmbedding = async (query: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
  })

  return response.data[0].embedding;
};

/**
 * Retrieves related text from Supabase based on a given query.
 * @param query - The query to search for related text.
 * @param matchThreshold - The minimum similarity threshold for a match to be considered.
 * @param matchCount - The maximum number of matches to return.
 * @param minContentLength - The minimum length of the content to be considered.
 * @returns An array of tuples containing the related text and their similarity score.
 * @throws An error if there was an issue with the Supabase query.
 */
const getRelatedTextFromSupabase = async (
  query: string,
  matchThreshold: number = 0.7,
  matchCount: number = 10,
  minContentLength: number = 100
): Promise<[string, number][]> => {
  const queryEmbedding = await getQueryEmbedding(query);
  const params = {
    embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
    min_content_length: minContentLength,
  };

  const { data, error } = await supabaseClient.rpc('match_page_sections', params);
  if (error) {
    throw new Error(`PostgresError when querying Supabase: ${error.message}`);
  }
  return (data as any[]).map((record) => [cleanText(record.content), record.similarity]);
};

// ============================================================
// POST-PROCESS SEARCH RESULTS
// ============================================================
/**
 * Removes unwanted characters and extra whitespace from a given string.
 * @param text - The string to be cleaned.
 * @returns The cleaned string.
 */
const cleanText = (text: string): string => {
  return text.replace(/[\t]/g, ' ')
              .replace(/ +/g, ' ')
              .replace(/[=<>[\]{}|]/g, '')
              .trim();
}

/**
 * Generates snippets from related text.
 * @param relatedText - An array of tuples containing the related text and its relatedness score.
 * @param snippetCount - The number of snippets to generate.
 * @param snippetMinLength - The minimum length of each snippet.
 * @param snippetMaxLength - The maximum length of each snippet.
 * @returns An array of strings containing the generated snippets.
 */
const generateSnippetsFromRelatedText = (
  relatedText: [string, number][],
  snippetCount: number = 30,
  snippetMinLength: number = 50,
  snippetMaxLength: number = 150
): string[] => {
  const factor = Math.max(1, Math.floor(snippetCount / relatedText.length));
  
  const snippets: string[] = [];

  for (const [string, _relatedness] of relatedText) {
    // Deliminate by newlines and periods.
    const lines = string.split(/[.\n]/);
    // Return first line that is at least snippetMinLength characters long.
    const filteredLines = lines.filter((line) => line.length >= snippetMinLength);

    if (filteredLines.length === 0) {
      continue;
    }

    // Push the first `factor` lines to snippets.
    const newSnippets = filteredLines.slice(0, factor);
    for (const snippet of newSnippets) {
      snippets.push(snippet.trim().slice(0, snippetMaxLength));
    }
  }

  return snippets;
};

// ============================================================
// ASK
// ============================================================
/**
 * Queries the Irminsul data to answer a given question.
 * @param query - The question to be answered.
 * @param relatedText - Optional related text. If not provided, runs a semantic search API call.
 * @param _model - Unused parameter.
 * @param _tokenBudget - Unused parameter.
 * @returns A string containing the brainstorming process, answer, and relevant Irminsul data.
 */
const queryMessage = async (
  query: string,
  relatedText: [string, number][] | null,
  _model: string,
  _tokenBudget: number
): Promise<string> => {
  const stringsAndRelatednesses = relatedText || await getRelatedTextFromSupabase(query);

  let message = initialPrompt;

  message += '\n\nIrminsul data:';
  for (const [string, _relatedness] of stringsAndRelatednesses) {
    const nextArticle = `\n\n"""\n${string}\n"""`;
    message += nextArticle;
  }

  return message + `\n\nQuestion: "${query}"`;
};

/**
 * Asks a question to the Akasha Terminal and returns the response.
 * @param query - The question to ask.
 * @param relatedText - Optional related text to provide context for the question.
 * @param model - The OpenAI model to use for generating the response.
 * @param tokenBudget - The maximum number of tokens to use for generating the response.
 * @returns The response from the Akasha Terminal.
 * @throws An error if there was an issue with the OpenAI API call.
 */
const ask = async (
  query: string,
  relatedText: [string, number][] | null = null,
  model: string = GPT_MODEL,
  tokenBudget: number = 16385 - 500 - 489
): Promise<string> => {
  try {
    const message = await queryMessage(query, relatedText, model, tokenBudget);
    const messages: { role: "system" | "user"; content: string }[]= [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: message,
      },
    ];

    const chatCompletion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0,
    });

    return chatCompletion.choices[0].message.content || '';
  } catch (err : any) {
    throw new Error(`Error when awaiting OpenAI completion: ${err.message}`);
  }
};

// ============================================================
// POST-PROCESS ASK RESULTS
// ============================================================
/**
 * Parses the response string and returns an array containing the brainstorm and answer.
 * @param response - The response string to be parsed.
 * @returns An array containing the brainstorm and answer.
 */
const parseResponse = (response: string): string[] => {
  const brainstorm = response.split('Brainstorm:')[1].split('Answer:')[0];
  const answer = response.split('Answer:')[1];
  return [brainstorm, answer];
}

/**
 * Parses a brainstorm string into an array of trimmed non-empty lines.
 * @param brainstorm - The brainstorm string to parse.
 * @returns An array of trimmed non-empty lines.
 */
const parseBrainstorm = (brainstorm: string): string[] => {
  return brainstorm.split('- ').map((line) => line.trim()).filter((line) => line !== '');
}

// ============================================================
// MAIN
// ============================================================
const sanitizeText = (text: string): string => {
  return text
          .replace(/[;()\[\]{}]/g, '-')
          .replace(/[^a-zA-Z0-9'".,?:\- ]/g, '')
          ;
}

const logQA = async (query: string, response: string) => {
  await supabaseClient.from('query_logs').insert([
    { user_query: query, llm_answer: response }
  ])
}

export const runtime = 'edge';
export const preferredRegion = 'sfo1'

export async function POST(req: NextRequest) {
  console.log("Received POST request.")
  const encoder = new TextEncoder();
  const readable: ReadableStream<Uint8Array> = new ReadableStream({
    async start(controller) {
      try {
        const requestBody = await req.text();
        const { query: queryParam } = JSON.parse(requestBody);      
        const query = sanitizeText(queryParam);
      
        if (!query) {
          throw new Error('No query provided.');
        }
      
        console.log("Searching Irminsul for: " + query);
        
        const searchData = TESTMODE ?
          [] :
          await getRelatedTextFromSupabase(query);
    
        console.log("Received search data. Processing...")
        const snippets = TESTMODE ?
          testLoremIpsum :
          generateSnippetsFromRelatedText(searchData);
    
        console.log("Sending preliminary data...")
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'snippets', data: snippets })));
    
        console.log("Constructing answer...")
        // if TESTMODE, sleep for some seconds to simulate API call
        if (TESTMODE) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        const response = TESTMODE ? 
          testResponse :
          sanitizeText(await ask(query, searchData));

        !TESTMODE && await logQA(query, response);
    
        console.log(response);
        console.log("Received response! Processing...");
        const brainstormAndAnswer = parseResponse(response);
        const brainstormArray = parseBrainstorm(brainstormAndAnswer[0]);
    
        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'response',
          data: {
            brainstorm: brainstormArray,
            answer: brainstormAndAnswer[1],
          }
        })));
        console.log("Finished!")
      } catch (err : any) {
        const errorMessage = err?.message ?? 'An unexpected error occurred.';
        console.log(errorMessage);
        if (controller) {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', data: errorMessage })));
        }
      } finally {
        if (controller) {
          controller.close();
        }
        console.log("Closed connection.")
      }

    },
  });
  
  // Set necessary headers for SSE
  const response = new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};
