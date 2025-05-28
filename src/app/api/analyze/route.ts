import { detectColor, detectEmptyBlocks, detectLongFn, detectNestedIfs, detectUnreachableCode, detectUnusedVariables } from "@/utils/dfa";
import tokenize from "@/utils/tokenize";

export async function POST(req: Request) {
    const body = await req.json();
    const { code } = body
    const token = tokenize(code);
    const rawIssues = [...detectNestedIfs(token), ...detectLongFn(code),...detectEmptyBlocks(token),...detectUnreachableCode(token),...detectUnusedVariables(token)]
    if(rawIssues.length === 0 && token.length !== 0){ 
        return Response.json({ issues:rawIssues, token, message:"Your code is optimized ✅"})
    }

    if(token.length === 0){
        return Response.json({ issues:rawIssues, token, message:"Please enter the code 👆"})
    }

    const issues = detectColor(rawIssues);
    return Response.json({ issues, token, message:""})
    
}