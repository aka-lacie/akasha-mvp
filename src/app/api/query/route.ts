import type { NextRequest } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

// MODELS
const EMBEDDING_MODEL = 'text-embedding-ada-002'
const GPT_MODEL = 'gpt-3.5-turbo-1106'

// CONFIG
const openai = new OpenAI()

const supabase_url = process.env["AKASHA_SUPABASE_URL"] || ''
const supabase_key = process.env["AKASHA_SUPABASE_KEY"] || ''
const supabaseClient : SupabaseClient = createClient(supabase_url, supabase_key)

const systemPrompt = `You are the Akasha Terminal, a smart answer engine able to access the collective knowledge of Teyvat stored in the Irminsul database. Each piece of provided data may or may not be relevant to the question – discern using your best judgement and refuse questions outside of the scope of your data pertaining to Genshin Impact. Use the data provided by the Irminsul to answer the given question. Answer in exactly TWO parts labeled "Brainstorm:" and "Answer:". Note important info relevant to the question in "Brainstorm" deliminated by dashes (-). Write your conclusion and brief explanation in "Answer", but keep it concise - every word counts. If you cannot determine any answer, it is okay to say so. Format example: \`\`\`Question: "What happened in Scaramouche's past?"
GPT Response: """Brainstorm:
- Scaramouche was originally created as a test puppet body by Ei.
- He settled in Tatarasuna and became close with Katsuragi.
- Dottore infiltrated Tatarasuna and caused chaos with Crystal Marrow.
-...[rest of brainstorm]
Answer: Scaramouche was created as a test puppet body by Ei. He settled in Tatarasuna and formed a close relationship with Katsuragi. However, chaos ensued...[rest of answer]"""\`\`\``

class AkashaError extends Error {
  constructor(message?: string) {
    super(message); // Pass the message up to the Error constructor
    this.name = 'AkashaError'; // Set the name property to the name of your custom error class

    // This line is necessary to make the instanceof operator work correctly with TypeScript transpiled code
    Object.setPrototypeOf(this, AkashaError.prototype);
  }
}

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
    throw new AkashaError(`PostgresError when querying Supabase: ${error.message}`);
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
    if (!string) {
      continue;
    }
    
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

  let message = ``;

  message += '\n\nIrminsul data:';
  for (const [string, _relatedness] of stringsAndRelatednesses) {
    const nextArticle = `\n\n"""\n${string}\n"""`;
    message += nextArticle;
  }

  message += `\n\nQuestion: "${query}"`;
  return message.trim();
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
    throw new AkashaError(`Error when awaiting OpenAI completion: ${err.message}`);
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
  if (!response.includes('Brainstorm:') || !response.includes('Answer:')) {
    throw new AkashaError('Akasha was unable to produce a valid answer. Try another question.');
  }
  const brainstorm = response.split('Brainstorm:')[1]?.split('Answer:')[0];
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
  const encoder = new TextEncoder();
  const readable: ReadableStream<Uint8Array> = new ReadableStream({
    async start(controller) {
      let keepAliveInterval: NodeJS.Timeout | null = null; 

      try {
        keepAliveInterval = setInterval(() => {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'keep-alive', data: ' ' })));
        }, 5000);  // Sends a keep-alive packet every 5 seconds

        const requestBody = await req.text();
        const { query: queryParam } = JSON.parse(requestBody);
        const query = sanitizeText(queryParam);
      
        if (!query) {
          throw new AkashaError('No query provided.');
        }
        
        const searchData = await getRelatedTextFromSupabase(query);
        const snippets = generateSnippetsFromRelatedText(searchData);
    
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'snippets', data: snippets })));
    
        const response = sanitizeText(await ask(query, searchData));
        
        if (!response) {
          throw new AkashaError('No response received.');
        }

        const brainstormAndAnswer = parseResponse(response);
        const brainstormArray = parseBrainstorm(brainstormAndAnswer[0]);
    
        controller.enqueue(encoder.encode(JSON.stringify({
          type: 'response',
          data: {
            brainstorm: brainstormArray,
            answer: brainstormAndAnswer[1],
          }
        })));

        await logQA(query, response);
      } catch (err : any) {
        const errorMessage = err instanceof AkashaError ? err.message : 'An unexpected error occurred.';
        if(process.env["CURR_ENV"] === 'DEV'){
          console.error(err);
        }
        if (controller) {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', data: errorMessage })));
        }
      } finally {
        if (keepAliveInterval) {
          clearInterval(keepAliveInterval);
        }
        if (controller) {
          controller.close();
        }
      }
    },
  });
  
  // Set necessary headers for SSE
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};
