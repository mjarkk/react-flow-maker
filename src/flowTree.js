import utils from './utils'

export default class Tree {
  constructor(Logic, forceUpdate) {
    this.Logic = Logic
    this.forceUpdate = forceUpdate
    this.maxDepth = 0
    this.flow = []

    this.exportBuzzy = false
    this.reExport = false

    this.exportFunc = undefined
  }

  setExportFunc(func) {
    this.exportFunc = func
  }

  caclMaxDepth() {
    const vm = this
    this.maxDepth = 0

    const loopOverNext = next => {
      next.map(item => {
        if (item.depth > vm.maxDepth) {
          vm.maxDepth = item.depth
        }
        loopOverNext(item.next)
      })
    }
    loopOverNext(this.flow)

    this.forceUpdate()
  }

  flowItem(component, lastIds, currentDepth) {
    const id = utils.RandomString(20)
    return {
      depth: currentDepth + 1,
      next: [],
      id: id,
      path: [...lastIds, id],
      inputData: {},
      inputValidation: {},
      component,
    }
  }

  startFlow(componentName) {
    let component = this.Logic.conf.components[componentName]
    if (!component) {
      return
    }

    this.flow.push(this.flowItem(component, [], 0))
    this.caclMaxDepth()
    this.export()
  }

  addComponent(componentName, path) {
    let component = this.Logic.conf.components[componentName]
    if (!component) {
      return
    }

    let toAppendOn = this.findPath(path)
    toAppendOn.next.push(this.flowItem(component, toAppendOn.path, toAppendOn.depth))

    this.caclMaxDepth()
    this.export()
  }

  findPath(path) {
    let toReturn = undefined
    const loopOverNext = next => {
      for (let i = 0; i < next.length; i++) {
        if (next[i].path === path) {
          toReturn = next[i]
          break
        }
        loopOverNext(next[i].next)
      }
    }
    loopOverNext(this.flow)
    return toReturn
  }

  removeComponent(path) {
    const loopOverNext = next => {
      next = Object.assign([], next)
      for (let i = 0; i < next.length; i++) {
        if (next[i].path === path) {
          next.splice(i, 1)
          break
        }
        next[i].next = loopOverNext(next[i].next)
      }
      return next
    }
    this.flow = loopOverNext(this.flow)

    this.caclMaxDepth()
    this.export()
  }

  export() {
    if (!this.exportBuzzy) {
      this.exportBuzzy = true

      setTimeout(() => {
        if (this.reExport) {
          this.exportBuzzy = false
          this.reExport = false
          this.export()
          return
        }

        let toExport = []

        const mapOverNext = (posInExpo, next) => {
          next.map(item => {
            let inputs = {}
            let inputErrors = {}

            Object.keys(item.inputData).map(i => {
              inputs[i] = item.inputData[i].value
              if (item.inputData[i].error) {
                inputErrors[i] = item.inputData[i].error
              }
            })

            const componentName = item.component.name
            posInExpo.push({
              component: {
                title: item.component.title,
                name: item.component.name
              },
              inputs,
              inputErrors,
              id: item.id,
              next: [],
            })
            mapOverNext(posInExpo[posInExpo.length - 1].next, item.next)
          })
        }

        mapOverNext(toExport, this.flow)

        if (typeof this.exportFunc == 'function') {
          this.exportFunc(toExport)
        }

        setTimeout(() => {
          this.exportBuzzy = false
          if (this.reExport) {
            this.reExport = false
            this.export()
          }
        }, 30)
      }, 50)
    } else {
      this.reExport = true
    }
  }

  import(flow) {
    if (!Array.isArray(flow)) {
      return
    }

    let newFlow = []

    const mapOverFlow = (arr, mapTo, lastIds) => {
      arr.map(item => {
        let toPush = this.flowItem(this.Logic.conf.components[item.component.name], lastIds, lastIds.length)

        toPush.id = item.id
        toPush.inputData = Object.keys(item.inputs).reduce((acc, i) => {
          acc[i] = {
            value: item.inputs[i],
            error: ''
          }
          return acc
        }, {})
        toPush.path.splice(-1, 1)
        toPush.path.push(item.id)
        mapTo.push(toPush)

        mapOverFlow(item.next, mapTo[mapTo.length - 1].next, [...lastIds, item.id])
      })
    }
    mapOverFlow(flow, newFlow, [])

    this.flow = newFlow
    this.caclMaxDepth()
  }

  updateInputValue(path, value, field, isAdvanced) {
    let component = this.findPath(path)

    if (component) {
      if (!isAdvanced) {
        if (component.component.inputs && component.component.inputs[field]) {
          const input = component.component.inputs[field]
          component.inputData[input.name] = value
        }
      } else {
        if (component.component.advancedInputs && component.component.advancedInputs[field]) {
          const input = component.component.advancedInputs[field]
          component.inputData[input.name] = value
        }
      }
    }

    this.export()
  }
}
