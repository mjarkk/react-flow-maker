import React from 'react'
import Block from './block'

const GraphPartClass = class GraphPart extends React.Component {
  constructor() {
    super()

    this.state = {
      element: undefined,
      lastParrentPosition: 0,
    }
  }

  render() {
    let parrentLineHeight = 0
    let parrentLineToTop = 0
    let type = ''
    
    if (this.props.connectTo && this.state.element) {
      let parrent = this.props.connectTo.getBoundingClientRect()
      let child = this.state.element.getBoundingClientRect()
      let spaceBetween = (parrent.y + (parrent.height / 2)) - (child.y + (child.height / 2))
      
      if (spaceBetween == 0) {
        parrentLineHeight = 20
        parrentLineToTop = 10
        type = 'straight'
      } else if (spaceBetween < 0) {
        parrentLineHeight = ((-spaceBetween) + 20)
        parrentLineToTop = parrentLineHeight - 10
        type = 'bottomToTop'
      } 
      else {
        parrentLineHeight = spaceBetween + 20
        parrentLineToTop = 10
        type = 'topToBottom'
      }
    }
    return (
      <div className="graphPart" style={{width: this.props.width}}>
        {parrentLineHeight && parrentLineToTop && type ?
          <div className="lineToParrent" style={{bottom: `${parrentLineToTop}px`}}>
            <svg viewBox={`0 0 80 ${parrentLineHeight}`} height={`${parrentLineHeight}px`} style={{minHeight: `${parrentLineHeight}px`}} xmlns="http://www.w3.org/2000/svg">
              { type == 'bottomToTop' ?
                <path
                  strokeWidth="7" 
                  stroke="#ccc" 
                  strokeLinecap="round" 
                  fill="none" 
                  d={`M0,10 C70,10 30,${parrentLineHeight-10} 80,${parrentLineHeight-10}`}
                />
              : type == 'topToBottom' ?
                <path 
                  strokeWidth="7" 
                  stroke="#ccc" 
                  strokeLinecap="round" 
                  fill="none" 
                  d={`M0,${parrentLineHeight-10} C70,${parrentLineHeight-10} 30,10 80,10`}
                />
              : 
                <path 
                  strokeWidth="7" 
                  stroke="#ccc" 
                  strokeLinecap="round" 
                  fill="none" 
                  d="M0,10 C70,10 30,10 80,10"
                />
              }
            </svg>
          </div>
        :''}
        <div
          ref={element => {
            
            let parrentEl = this.props.connectTo
            let parrent = undefined
            if (parrentEl) {
              parrent = parrentEl.getBoundingClientRect()
            }

            if (typeof this.state.element == 'object') {
              if (!parrent || parrent.top == this.state.lastParrentPosition) {
                return
              }
            }

            let toUpdate = {
              element,
            }

            if (parrent) {
              toUpdate.lastParrentPosition = parrent.top
            }

            this.setState(toUpdate)
          }} 
          className="graph" 
          style={{minWidth: this.props.itemWidth}}
        >
          <Block Tree={this.props.Tree} Logic={this.props.Logic} data={this.props.data}/>
        </div>
        <div className="next">
          {this.props.data.next.map((item, i) => <GraphPartClass Tree={this.props.Tree} Logic={this.props.Logic} connectTo={this.state.element} width={this.props.width - this.props.itemWidth} itemWidth={this.props.itemWidth} key={i} data={item}/>)}
        </div>
      </div>
    )
  }
}

export default GraphPartClass
