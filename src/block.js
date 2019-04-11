import React from 'react'
import Input from './input'
import {Delete, Add, DropDown, DropUp} from './icons'
import ToolTip from './tooltip'

export default class Block extends React.Component {
  constructor() {
    super()

    this.state = {
      hover: false,
      showAddOptions: false,
      showAdvanced: false,
    }

    this.remove = this.remove.bind(this)
  }
  remove() {
    this.props.Tree.removeComponent(this.props.data.path)
  }
  add() {

    if (this.props.data.component.next.length == 1) {
      this.realAdd(this.props.data.component.next[0])
      return
    }

    this.setState({
      showAddOptions: true,
    })
  }
  realAdd(toAdd) {
    this.setState({
      showAddOptions: false,
    })

    if (!toAdd) {
      return
    }

    this.props.Tree.addComponent(toAdd, this.props.data.path)
  }
  render() {
    const data = this.props.data
    if (!data) {
      return ''
    }
    const comp = data.component
    const inputs = comp.inputs
    const advancedInputs = comp.advancedInputs

    return (
      <div 
        className={`fullBlock hover${this.state.hover && !this.state.showAddOptions ? 'True' : 'False'}`}
        onMouseOver={() => this.setState({hover: true})}
        onMouseOut={() => this.setState({hover: false})}
      >
        <div className="side">
          <div className="innerSide">
            <div className="round" onClick={this.remove}>
              <Delete/>
            </div>
          </div>
        </div>
        <div className="middle">
          <div className="title">{comp.title}<ToolTip transparrent={true} tip={comp.tooltip}/></div>
          <div className="inputs">
            {inputs.map((input, inputID) => {
              const inputData = data.inputData[input.name]
              return (
                <Input
                  key={inputID}
                  input={input}
                  initalVal={inputData ? inputData.value : undefined}
                  onChange={inputData => {
                    this.props.Tree.updateInputValue(data.path, inputData, inputID, false)
                  }}
                />
              )
            })}
            {advancedInputs.length > 0?
              <div 
                className="showAdvanced" 
                onClick={() => {
                  this.setState({showAdvanced: !this.state.showAdvanced}, () => {
                    if (this.props.graphParrentInstance) {
                      this.props.graphParrentInstance.forceUpdate()
                    } else if (this.props.graphInstance) {
                      this.props.graphInstance.forceUpdate()
                    }
                  })
                }}>
                <div className="button">Advanced {this.state.showAdvanced ? <DropUp/> : <DropDown/>}</div>
              </div>
            :''}
          </div>
          <div className={`inputs advancedInputs show${this.state.showAdvanced ? 'True' : 'False'}`}>
            {advancedInputs.map((input, inputID) => {
              const inputData = data.inputData[input.name]
              return (
                <Input
                  key={inputID}
                  input={input}
                  initalVal={inputData ? inputData.value : undefined}
                  onChange={inputData => {
                    this.props.Tree.updateInputValue(data.path, inputData, inputID, true)
                  }}
                />
              )
            })}
          </div>
        </div>
        {comp.next.length > 0 ?
          <div className={`nextOptions show${this.state.showAddOptions ? 'True' : 'False'}`}>
            <div className="closePopup" onClick={() => this.realAdd()}>
              <Add/>
            </div>
            <div className="pos">
              <div className="optionsTitle">Options</div>
              {comp.next.map((componentName, key) => 
                <div 
                  onClick={() => this.realAdd({componentName})} 
                  className="option" 
                  key={key}
                >{this.props ? this.props.Logic.title(componentName) : componentName}</div>
              )}
            </div>
          </div>
        :''}
        {comp.next.length > 0 ?
          <div className="side">
            <div className="innerSide">
              <div className="round" onClick={() => this.add()}>
                <Add/>
              </div>
            </div>
          </div>
        :''}
      </div>
    )
  }
}
