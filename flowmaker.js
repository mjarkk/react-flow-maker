import React from 'react'
import './style.styl'
import Logic from './src/logic'
import Tree from './src/flowTree'
import AddButton from './src/addbutton'
import GraphPart from './src/graphPart'
import sha1 from 'js-sha1'

export default class FlowMaker extends React.Component {
  constructor() {
    super()

    this.Logic = new Logic()
    this.Tree = new Tree(this.Logic, this)

    this.lastlogicHash = ''
    this.state = {
      settings: this.Logic.get(),
    }
  }

  componentDidMount() {
    const newHash = sha1(this.props.logic)
    if (newHash != this.lastlogicHash) {
      this.lastlogicHash = newHash
      this.setState({
        settings: this.Logic.parseNewLogic(this.props.logic)
      }, () => this.afterMount())
    } else {
      this.afterMount()
    }
  }

  afterMount() {
    if (typeof this.props.onChange == 'function')
      this.Tree.setExportFunc(this.props.onChange)
    if (typeof this.props.flow == 'object')
      this.Tree.import(this.props.flow)
  }

  render() {
    const s = this.state.settings

    return (
      <div className="flowMakerComp">
        <div className="flowMakerContainer" style={{minWidth: `${250 + (380 * this.Tree.maxDepth)}px`}}>
          <div className="flow-row" style={{minWidth: '250px'}}>
            {s.introComponents.length > 0 ?
              <div className="flow-startPoint">
                <h3>Start here</h3>
                <AddButton
                  Tree={this.Tree}
                  Logic={this.Logic}
                  options={s.introComponents}
                  out={componentName => this.Tree.startFlow(componentName)}
                />
              </div>
            :''}
          </div>

          <div className="flow-actualGraph" style={{width: `${380 * this.Tree.maxDepth}px`}}>
            {this.Tree.flow.map((item, i) => 
              <GraphPart
                Tree={this.Tree} 
                Logic={this.Logic}
                width={380 * this.Tree.maxDepth}
                itemWidth={380} 
                key={i} 
                data={item}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}
