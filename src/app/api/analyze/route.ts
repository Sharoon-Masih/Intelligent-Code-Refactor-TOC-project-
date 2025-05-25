import { detectColor, detectEmptyBlocks, detectEmptyCatchBlocks, detectLongFn, detectNestedIfs, detectUnreachableCode } from "@/utils/dfa";
import tokenize from "@/utils/tokenize";

export async function POST(req: Request) {
    const body = await req.json();
    const { code } = body
    const token = tokenize(code);
    const rawIssues = [...detectNestedIfs(token), ...detectEmptyCatchBlocks(token), ...detectLongFn(code),...detectEmptyBlocks(token),...detectUnreachableCode(token)]
    if(rawIssues.length === 0){
        
        return Response.json({ issues:rawIssues, token, message:"Your code is optimized ✅"})
    }
    const issues = detectColor(rawIssues);
    return Response.json({ issues, token, message:""})
    
}