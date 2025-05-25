export interface Token {
    value: string,
    lineNumber: number
}
export default function tokenize(code: string): Token[] {
    const token: Token[] = [];
    const lines = code.split('\n')
    lines.forEach((textLine, lineIndex) => {
        const lineNumber = lineIndex+1;
        const matches = textLine.match(/[a-zA-Z_$][a-zA-Z0-9_$]*|==|>=|<=|!=|=>|[{}()[\].,;+\-*/%><=!]/g)
        if(matches){
            matches.forEach((value)=>{
                token.push({value,lineNumber})
            })
        }
    })
    return token
}