import React from 'react'
import {Info} from './icons'

export default class ToolTip extends React.Component {
  render() {
    if (!this.props.tip) {
      return ''
    }

    return (
      <div className={`flow-tooltip flow-transparrent${this.props.transparrent ? 'True' : 'False'}`}>
        <div className="flow-icon">
          <Info/>
        </div>
        <div className="flow-noWidth">
          <div className="flow-fullwidth">
            <div className="flow-popup">
              {this.props.tip}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
