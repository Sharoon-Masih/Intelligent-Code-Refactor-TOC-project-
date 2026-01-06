import { Issue } from '@/utils/dfa'
import React from 'react'

const ResultBox = ({ output, msg, refactorCode }: { output: Issue[] | undefined, msg?: string, refactorCode: string | undefined }) => {

    // async function copy(content: any) {
    //     try {
    //         await navigator.clipboard.writeText(content)
    //         alert('copied')
    //     } catch (error) {
    //         alert('something went wrong')
    //     }
    // }
    return (
        <div className="w-full h-full p-3">
            <ul className='list-disc list-inside space-y-1  overflow-auto'>
                {output && output.length > 0 ? output.map((val, idx) => <li key={idx} style={{ color: val.color }} className={`font-normal`}>{val.symbol + " " + val.value}</li>) : msg}
            </ul>
            {
                refactorCode !== "" &&
                <pre className="bg-gray-900 text-green-300 p-3 rounded overflow-x-auto mt-5 flex flex-row justify-between items-start">
                    <div>
                        <h2 className="text-white font-semibold text-lg mb-3">Refactored Version</h2>
                        <code className='mt-3 text-wrap'>{refactorCode}</code>
                    </div>
                    <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-heading rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span className=" relative px-4 py-2 transition-all ease-in duration-75 bg-neutral-primary-soft rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5">
                            Copy
                        </span>
                    </button>
                </pre>
            }
        </div>
    )
}

export default ResultBox
