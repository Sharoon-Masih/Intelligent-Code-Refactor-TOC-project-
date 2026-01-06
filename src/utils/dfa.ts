import { Token } from "./tokenize";

// input: "if", "}"
export function detectNestedIfs(token: Token[]) {
    let nestingLevel = 0;
    const issues: string[] = [];
    token.forEach((tok) => {
        if (tok.value === "if") {
            nestingLevel++;
            console.log('tok:',tok)
            console.log('if nest-lvl: ',nestingLevel)
            if (nestingLevel > 2) {
                issues.push(`Too much nesting detected at line ${tok.lineNumber}`)
            }
        }
        if (tok.value === "}") {
            nestingLevel = Math.max(0, nestingLevel - 1)
            console.log('} nest lvl: ',nestingLevel)
        }
    })
    return issues
}

// input: "catch", "{", "}", "(", ")"
export function detectEmptyBlocks(token: Token[]) {
    const issues: string[] = []
    token.forEach((tok, i) => {

        if (tok.value === "{") {
            if (token[i + 1].value === "/" && token[i + 2].value === "/") {

                const index = detectComment(token, i);
                if (index && token[index! + 1].value === "}") {
                    issues.push(`Empty block detected near line ${tok.lineNumber}`);
                }
            }

            if (token[i + 1].value === "/*") {
                const terminator = detectComment(token, i);
                if (terminator && token[terminator + 1].value === "}") {
                    issues.push(`Empty block detected near line ${tok.lineNumber}`);
                }
            }

            if (token[i + 1].value === "}") {
                issues.push(`Empty block detected near line ${tok.lineNumber}`);
            }
        }
        // if (tok.value === "catch" && token[i + 1].value === "(") {
        //     for (let j = i; j < token.length; j++) {
        //         if (token[j].value === ")") {
        //             terminator = j;
        //             break;
        //         }
        //     }
        //     if (terminator && token[terminator + 1].value === "{") {
        //         let index;
        //         if ((token[terminator + 2].value === "/" && token[terminator + 3].value === "/") || (token[terminator + 2].value === "/" && token[terminator + 3].value === "*")) {
        //             let j = terminator + 3;
        //             while (token[j].lineNumber === token[terminator + 3].lineNumber) {
        //                 index = j;
        //                 j++;
        //             }
        //             if (index && token[index! + 1].value === "}") {
        //                 issues.push(`Empty catch block detected near line ${tok.lineNumber}`);
        //             }
        //         }
        //         if (token[terminator + 2].value === "}") {
        //             issues.push(`Empty catch block detected near line ${tok.lineNumber}`);
        //         }
        //     }
        // }

    })

    return issues;
}

export function detectComment(token: Token[], idx: number) {

    let exactIndex;
    while ((token[idx + 1].value === "/" && token[idx + 2].value === "/") || token[idx + 1].value === "/*") {
        let i = idx;
        if (token[i + 1].value === "/" && token[i + 2].value === "/") {
            let index;
            while (token[i + 1].value === "/" && token[i + 2].value === "/") {
                const k = i
                if (token[k + 1].value === "/" && token[k + 2].value === "/") {
                    let j = k + 2;
                    while (token[j].lineNumber === token[k + 2].lineNumber) {
                        index = j;
                        i = j;
                        idx = j;
                        j++;
                    }
                }
            }
            exactIndex = index
        }
        if (token[i + 1].value === "/*") {
            let terminator;
            while (token[i + 1].value === "/*") {
                const k = i;
                if (token[k + 1].value === "/*") {
                    let j = k + 1
                    while (token[j].value !== "*/") {
                        terminator = j + 1;
                        i = j + 1;
                        idx = j + 1;
                        j++;
                    }
                }
            }
            exactIndex = terminator;
        }
    }
    return exactIndex
}
// // input: '{' and '}'
// export function detectEmptyBlocks(token: Token[]) {
//     const issues: string[] = []
//     token.forEach((tok, i) => {

//         if (tok.value === "{" && token[i + 1].value === "}") {
//             issues.push(`Empty block detected at line ${tok.lineNumber}`);
//         }
//     })

//     return issues;
// }

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

// export function detectUnreachableCode(token: Token[]) {
//     const issues: string[] = [];
//     token.forEach((val, i) => {
//         // if ((val.value === "return" || val.value === "throw" || val.value === "break" || val.value === "continue") && (val.lineNumber !== token[i + 1].lineNumber && token[i + 1].value !== "}")) {
//         //     issues.push(`Unreachable code detected at line ${token[i + 1].lineNumber}`)
//         // }
//         if (val.value === "return" || val.value === "throw" || val.value === "break" || val.value === "continue") {
//             let j = i;
//             let l = i;
//             while (token[j].lineNumber === token[i].lineNumber) {
//                 l = j
//                 j++;
//             }
//             let k = l
//             let startLine = k + 1;
//             while (typeof token[k + 1] !== 'undefined' && (val.lineNumber !== token[k + 1].lineNumber && token[k + 1].value !== "}")) {

//                 console.log("k:",k + " " + token[k].value)
//                 if ((token[k + 1].value === "/" && token[k + 2].value === "/") || token[k + 1].value === "/*") {
//                     let index = detectComment(token, k)
//                     k = index!; 
//                     if (index && token[index + 1].value !== "}") {
//                         let j1 = index + 1;
//                     while (token[j1].lineNumber === token[index + 1].lineNumber) {
//                         console.log("j1: ",j1)
//                         k = j1+1 //here increment value of k with 1 so that comment ka jo last index return hua hai, uskay baad already we check in above line that Unreachable code detect hua hai, therefore now in the next iteration it should check the next value from the value which occurs at "j+1" bcuz agar k=j hi rahega toh next iteration mabi wo same index pa jo value hogi usko check krega and then jo "else-if" hai below wo run hojayega and due to which same error for the same line dubara print hojayega.
//                         j1++;
//                     }
//                         issues.push(`Unreachable code detected at line ${token[index + 1].lineNumber}`)
//                     }

//                     console.log("k1:",k)
//                     // **skip the rest of this iteration** now that we’ve handled the comment
//                     continue;
//                 }
//                 else if ((val.lineNumber !== token[k + 1].lineNumber && token[k + 1].value !== "}")) {
//                     let j2 = k + 1;
//                     let index = k +1;
//                 console.log("k+1 value:",k+1)
//                     while (token[j2].lineNumber === token[index + 1].lineNumber) {
//                         k = j2
//                         j2++;
//                     } 
//                     console.log("k2:", k)
//                     issues.push(`Unreachable code detected at line ${token[k].lineNumber}`)
//                 }

//             }
//         }
//     })
//     return issues;
// }
export function detectUnreachableCode(tokens: Token[]) {
    const issues: string[] = [];

    let next: Token | null = null;
    tokens.forEach((tok, i) => {
        // Only care about return/throw/break/continue
        if (!["return", "throw", "break", "continue"].includes(tok.value)) return;

        // 1) find the last token on this same line
        let k = i;
        while (
            k + 1 < tokens.length &&
            tokens[k + 1].lineNumber === tok.lineNumber
        ) {
            k++;
        }
        console.log("k:", tokens[k])
        // 2) now scan *after* that line
        k++;
        console.log("next k:", tokens[k])

        // remove the previous "next" value
        // if (!(k < tokens.length &&
        //     tokens[k].lineNumber !== tok.lineNumber &&
        //     tokens[k].value !== "}")) {
        //     next = null
        // }

        while (
            k < tokens.length &&
            tokens[k].lineNumber !== tok.lineNumber &&
            tokens[k].value !== "}"
        ) {
            next = tokens[k];
            // console.log("next", next)
            // console.log("next + 1: ", tokens[k + 1].value)
            // console.log(next.value === "/" &&
            //     k + 1 < tokens.length &&
            //     tokens[k + 1].value === "/")
            console.log('in block next:',next)
            // 3) comment‐block or comment‐line?
            if (
                next.value === "/" &&
                k + 1 < tokens.length &&
                tokens[k + 1].value === "/"
            ) {
                // skip past the entire comment
                const commentEnd = detectComment(tokens, k - 1);
                if (commentEnd == null) {
                    // malformed comment: bail out to avoid infinite loop
                    next=null
                    break;
                }
                k = commentEnd + 1;
                console.log("k1:", k)
                next=null;
                continue;      // ✅ we moved k, so we “continue”
            }

            if (next.value === "/*") {
                // skip past /**/ block
                const commentEnd = detectComment(tokens, k - 1);
                if (commentEnd == null) {
                    next=null
                    break;
                }
                k = commentEnd + 1;
                next=null
                console.log("k2:", k)
                continue;
            }

            // 4) anything else *on a different line* is unreachable
            k++;            // ✅ advance k by 1 so the loop can make progress
        }

    });
    if (next) {
        issues.push(`Unreachable code detected at line ${(next as Token).lineNumber}`);
    }

    return issues;
}

export function detectUnusedVariables(tokens: Token[]) {
    const declared: Map<string, number> = new Map(); // variable name -> line number
    const used: Set<string> = new Set();
    const issues: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // 1. Detect variable declarations
        if (
            token.value === "let" ||
            token.value === "const" ||
            token.value === "var"
        ) {
            // Next token should be the variable name
            const next = tokens[i + 1];
            if (next && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(next.value)) {
                declared.set(next.value, next.lineNumber);
                i++; // skip variable name
            }
        }

        // // 2. Detect function parameters
        // if (
        //     token.value === "function" ||
        //     token.value === "(" && i > 0 && tokens[i - 1].value === "=>"
        // ) {
        //     let j = i + 1;
        //     const params: string[] = [];
        //     let parenDepth = 1;

        //     while (j < tokens.length && parenDepth > 0) {
        //         const t = tokens[j];
        //         if (t.value === "(") parenDepth++;
        //         else if (t.value === ")") parenDepth--;

        //         if (parenDepth === 1 && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(t.value)) {
        //             console.log(t.value)
        //             declared.set(t.value, t.lineNumber);
        //         }
        //         j++;
        //     }
        // }

        // 3. Detect all used variable names (skip declarations)
        if (
            /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token.value) &&
            !["let", "const", "var", "function", "return", "if", "else", "for", "while", "catch", "typeof", "instanceof", "new", "try", "console", "log"].includes(token.value)
        ) {
            used.add(token.value);
        }
    }

    // 4. Compare declared vs used
    for (const [variable, line] of declared.entries()) {
        if (!used.has(variable)) {
            issues.push(`Unused variable "${variable}" declared at line ${line}`);
        }
    }

    return issues;
}
export interface Issue {
    value: string,
    color: string,
    symbol: string
}
export function detectColor(issues: string[]) {
    const modifiedIssues: Issue[] = []
    issues.forEach((value) => {
        if (value.includes("nesting")) {
            modifiedIssues.push({ value, color: "#FF6B35", symbol: "💦" })
        }
        if (value.includes("block")) {
            modifiedIssues.push({ value, color: "#000000", symbol: "⚠️" })
        }
        if (value.includes("Long function")) {
            modifiedIssues.push({ value, color: "#008000", symbol: "💡" })
        }
        if (value.includes("Unreachable code")) {
            modifiedIssues.push({ value, color: "#fc2d2d", symbol: "🚨" })
        }
        if (value.includes("Unused variable")) {
            modifiedIssues.push({ value, color: "#8B8000", symbol: "📌" })
        }
    });
    return modifiedIssues
}