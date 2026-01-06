import { GoogleGenAI } from "@google/genai"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { code, issues } = body
        const ai = new GoogleGenAI({});
        const prompt = `You are an expert JavaScript developer. Refactor and optimize the following code. 
Make it cleaner, more efficient, short comments and readable — but do not over-shorten it to the point where it becomes difficult to understand.

If there are no major issues, still do small optimizations (like better variable naming, use of modern JS features, or performance improvements).

Keep the structure human-readable and beginner-friendly. 
Output only the final refactored JavaScript code inside a Markdown code block.
issues:${issues.join("\n")}
Code:${code}`

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ],
            config: {
                temperature: 0.25,      // precise, minimal randomness
                topP: 0.9,             // allows small variation, avoids repetitive patterns
                candidateCount: 1,     // only one best answer (more = slower)
                // maxOutputTokens: 800, // enough room for a function + explanation
                // stopSequences: ["```"], // optional, keeps output clean
            }
        });
        console.log(response.text)
        return Response.json({ 'refactored': response.text })
    }
    catch (err) {
        console.log('Some API error: ',err)
        return Response.json({ 'error': 'Gemini API Limit exceed' }, { status: 500 })
    }
}