import React from 'react'
import {Info} from './icons'

export default class ToolTip extends React.Component {
  render() {
    if (!this.props.tip) {
      return ''
    }

    return (
      <div className={`tooltip transparrent${this.props.transparrent ? 'True' : 'False'}`}>
        <div className="icon">
          <Info/>
        </div>
        <div className="noWidth">
          <div className="fullwidth">
            <div className="popup">
              {this.props.tip}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
