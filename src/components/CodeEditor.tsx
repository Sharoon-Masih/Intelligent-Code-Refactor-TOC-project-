import { Editor } from "@monaco-editor/react"
import { Dispatch, SetStateAction } from "react"

const CodeEditor = ({code,setCode}:{code:string,setCode: Dispatch<SetStateAction<string>>}) => {
    return (
    <div className='w-full h-full'>
        <Editor
        height={"93vh"}
        width="100%"
        language="javascript"
        defaultValue={code}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    </div>
  )
}

export default CodeEditor
