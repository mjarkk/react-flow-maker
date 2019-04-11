import React from 'react'
import {Add} from './icons'

export default class AddButton extends React.Component {
  constructor() {
    super()

    this.state = {
      open: false,
    }
  }
  clickRoundButton() {
    this.setState({
      open: !this.state.open,
    })
  }
  clickOption(option) {
    this.props.out(option)
    this.setState({
      open: false
    })
  }
  render() {
    const p = this.props
    const s = this.state
    return (
      <div className="addIcon">
        <div className={`round ${s.open ? 'open' : 'closed'}`} onClick={() => this.clickRoundButton()}>
          <Add/>
        </div>
        <div className={`options ${s.open ? 'open' : 'closed'}`}>
          {p.options ? p.options.map((option, id) => 
            <div onClick={() => this.clickOption(option)} key={id} className="option">
              {this.props ? this.props.Logic.title(option) : option}
            </div>
          ):''}
        </div>
      </div>
    )
  }
}
