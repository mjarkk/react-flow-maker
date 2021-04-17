import React from 'react'
import { Info } from './icons'

export default function ToolTip({ tip, transparrent }) {
  if (!tip) {
    return '';
  }

  return (
    <div className={`flow-tooltip flow-transparrent${transparrent ? 'True' : 'False'}`}>
      <div className="flow-icon">
        <Info />
      </div>
      <div className="flow-noWidth">
        <div className="flow-fullwidth">
          <div className="flow-popup">
            {tip}
          </div>
        </div>
      </div>
    </div>
  )
}
