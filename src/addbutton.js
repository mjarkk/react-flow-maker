import React, { useState } from 'react'
import { Add } from './icons'

export default function AddButton({ options, Logic, out }) {
  const [open, setOpen] = useState(false)

  function clickOption(option) {
    out(option)
    setOpen(false)
  }

  return (
    <div className="flow-addIcon">
      <div className={`flow-round ${open ? 'flow-open' : 'flow-closed'}`} onClick={() => setOpen(v => !v)}>
        <Add />
      </div>
      <div className={`flow-options ${open ? 'flow-open' : 'flow-closed'}`}>
        {options ? options.map((option, id) =>
          <div onClick={() => clickOption(option)} key={id} className="flow-option">
            {Logic ? Logic.title(option) : option}
          </div>
        ) : ''}
      </div>
    </div>
  )
}
