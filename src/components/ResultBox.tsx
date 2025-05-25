import { Issue } from '@/utils/dfa'
import React from 'react'

const ResultBox = ({output,msg}:{output:Issue[]|undefined, msg?:string}) => {
    
    return (
        <div className="w-full h-full p-3">
            <ul className='list-disc list-inside space-y-1  '>
                {output && output.length > 0 ? output.map((val,idx) => <li key={idx} style={{color:val.color}} className={`font-normal`}>{val.symbol+" "+val.value}</li>) : msg}
            </ul>
        </div>
    )
}

export default ResultBox
