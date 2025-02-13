import React from 'react'
import Split from 'react-split'
import ProblemDescription from './ProblemDescription/ProblemDescription'
import Playground from './Playground/Playground'

export default function Workspace({problem}) {
  return (
    <Split className='split' minSize={0}>
      <ProblemDescription problem={problem}/>
      <div className="bg-dark-fill-2">
        <Playground problem={problem}/>
      </div>
    </Split>
  )
}
