import { Token } from "./tokenize";

// input: "if", "}" (NFA)
export function detectNestedIfs(token: Token[]) {
    let nestingLevel = 0;
    const issues: string[] = [];
    token.forEach((tok)=>{
        if (tok.value === "if") {
            nestingLevel++;
            if (nestingLevel > 2) {
                issues.push(`Too much nesting detected at line ${tok.lineNumber}`)
            }
        }
        if (tok.value === "}") {
            nestingLevel = Math.max(0, nestingLevel - 1)
        }
    })
    return issues
}

// input: "catch", "{", "}", "(", ")"
export function detectEmptyCatchBlocks(token: Token[]) {
    let terminator:number;
    const issues: string[] = []
    token.forEach((tok,i) => {
        
        if (tok.value === "catch" && token[i + 1].value === "{" && token[i + 2].value === "}") {
            issues.push(`Empty catch block detected at line ${tok.lineNumber}`);
        }
        if (tok.value === "catch" && token[i + 1].value === "(") {
            for (let j = i; j < token.length; j++) {
                if (token[j].value === ")") {
                    terminator = j;
                    break;
                }
            }
            if (terminator && token[terminator + 1].value === "{" && token[terminator + 2].value === "}") {
                issues.push(`Empty catch block detected at line ${tok.lineNumber}`);
            }
        }

    })

    return issues;
}

// input: '{' and '}'
export function detectEmptyBlocks(token: Token[]) {
    const issues: string[] = []
    token.forEach((tok,i) => {
        
        if (tok.value === "{" && token[i + 1].value === "}" ) {
            issues.push(`Empty block detected at line ${tok.lineNumber}`);
        }
    })

    return issues;
}

// input: "function", "=>", "{", "}"
export function detectLongFn(code: string) {
    const lines = code.split('\n');
    const issues: string[] = [];

    let inFunction = false;
    let startLine = 0;
    let braceCount = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect function start
        if (!inFunction && (line.startsWith('function') || line.includes('=>') && line.includes('{'))) {
            inFunction = true;
            startLine = i;
            braceCount += (line.match(/{/g) || []).length;
        } else if (inFunction) {
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;

            // If function ended
            if (braceCount === 0) {
                const length = i - startLine + 1;
                if (length > 50) {
                    issues.push(`Long function detected from line ${startLine + 1} to ${i + 1} (${length} lines)`);
                }
                inFunction = false;
            }
        }
    }

    return issues;
}

export function detectUnreachableCode(token:Token[]) {
    const issues:string[] = [];
    token.forEach((val,i)=>{
        if((val.value === "return" || val.value === "throw" || val.value === "break" || val.value === "continue") && (val.lineNumber !== token[i+1].lineNumber && token[i+1].value !== "}")){
            issues.push(`Unreachable code detected at line ${token[i+1].lineNumber}`)
        }
    })
    return issues;
}

export interface Issue {
    value:string,
    color:string,
    symbol:string
}
export function detectColor(issues:string[]){
    const modifiedIssues:Issue[] = []
    issues.forEach((value)=>{
        if(value.includes("nesting")){
            modifiedIssues.push({value,color:"#FF6B35",symbol:"💦"})
        }
        if(value.includes("block")){
            modifiedIssues.push({value,color:"#000000",symbol:"⚠️"})
        }
        if(value.includes("Long function")){
            modifiedIssues.push({value,color:"#008000",symbol:"💡"})
        }
        if(value.includes("Unreachable code")){
            modifiedIssues.push({value,color:"#fc2d2d",symbol:"🚨"})
        }
    });
    return modifiedIssues
}