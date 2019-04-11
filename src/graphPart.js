import React from 'react'
import Block from './block'

const GraphPartClass = class GraphPart extends React.Component {
  constructor() {
    super()

    this.state = {
      element: undefined,
      lastParentPosition: 0,
    }
    
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
    this.watchParent()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  watchParent() {
    if (this.mounted) {
      let parentEl = this.props.connectTo
      let parent = undefined
      if (parentEl) {
        parent = parentEl.getBoundingClientRect()
        if (parent.top != this.state.lastParentPosition) {
          this.setState({
            lastParentPosition: parent.top
          })
        }
      }
      setTimeout(() => {
        this.watchParent()
      }, 800)
    }
  }

  render() {
    let parentLineHeight = 0
    let parentLineToTop = 0
    let type = ''

    if (this.props.connectTo && this.state.element) {
      let parent = this.props.connectTo.getBoundingClientRect()
      let child = this.state.element.getBoundingClientRect()
      let spaceBetween = (parent.y + (parent.height / 2)) - (child.y + (child.height / 2))  

      if (spaceBetween == 0) {
        parentLineHeight = 20
        parentLineToTop = 10
        type = 'straight'
      } else if (spaceBetween < 0) {
        parentLineHeight = ((-spaceBetween) + 20)
        parentLineToTop = parentLineHeight - 10
        type = 'bottomToTop'
      } else {
        parentLineHeight = spaceBetween + 20
        parentLineToTop = 10
        type = 'topToBottom'
      }
    }
    return (
      <div className="graphPart" style={{width: this.props.width}}>
        {parentLineHeight && parentLineToTop && type ?
          <div className="lineToParrent" style={{bottom: `${parentLineToTop}px`}}>
            <svg viewBox={`0 0 80 ${parentLineHeight}`} height={`${parentLineHeight}px`} style={{minHeight: `${parentLineHeight}px`}} xmlns="http://www.w3.org/2000/svg">
              { type == 'bottomToTop' ?
                <path
                  strokeWidth="7" 
                  stroke="#ccc" 
                  strokeLinecap="round" 
                  fill="none" 
                  d={`M0,10 C70,10 30,${parentLineHeight-10} 80,${parentLineHeight-10}`}
                />
              : type == 'topToBottom' ?
                <path 
                  strokeWidth="7" 
                  stroke="#ccc" 
                  strokeLinecap="round" 
                  fill="none" 
                  d={`M0,${parentLineHeight-10} C70,${parentLineHeight-10} 30,10 80,10`}
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
            
            let parentEl = this.props.connectTo
            let parent = undefined
            if (parentEl) {
              parent = parentEl.getBoundingClientRect()
            }

            if (typeof this.state.element == 'object') {
              if (!parent || parent.top == this.state.lastParentPosition) {
                return
              }
            }

            let toUpdate = {
              element,
            }

            if (parent) {
              toUpdate.lastParentPosition = parent.top
            }

            this.setState(toUpdate)
          }} 
          className="graph" 
          style={{minWidth: this.props.itemWidth}}
        >
          <Block 
            graphInstance={this} 
            graphParrentInstance={this.props.connectToInstance}
            Tree={this.props.Tree} 
            Logic={this.props.Logic} 
            data={this.props.data}
          />
        </div>
        <div className="next">
          {this.props.data.next.map((item, i) => 
            <GraphPartClass 
              Tree={this.props.Tree} 
              Logic={this.props.Logic} 
              connectTo={this.state.element}
              connectToInstance={this}
              width={this.props.width - this.props.itemWidth} 
              itemWidth={this.props.itemWidth}
              key={i} 
              data={item}
            />
          )}
        </div>
      </div>
    )
  }
}

export default GraphPartClass
