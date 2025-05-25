import { Issue } from '@/utils/dfa'
import React from 'react'

const ResultBox = ({Output}:{Output:Issue[]|undefined}) => {
    
    return (
        <div className="w-full h-full p-3">
            <ul className='list-disc list-inside space-y-1  '>
                {Output ? Output.map((val,idx) => <li key={idx} style={{color:val.color}} className={`font-normal`}>{val.symbol+" "+val.value}</li>) : "your code is OK"}
            </ul>
        </div>
    )
}

export default ResultBox
