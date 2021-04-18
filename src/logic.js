export default class Logic {
  constructor() {
    this.conf = {
      components: {},
      introComponents: [],
    }
    this.errors = []
  }
  title(compoentName) {
    return this.conf.components[compoentName].title
  }
  get() {
    return this.conf
  }

  parseInput(input, warn = err => console.log('logic parse warning:', err)) {
    let res = {
      name: input.name,
      title: input.title,
      type: input.type,
      validation: input.validation,
      tooltip: input.tooltip,
      default: input.default,
    }

    switch (input.type) {
      case 'text':
        if (typeof input.default != 'string' && input.default !== undefined) {
          warn(`.inputs[${input.name}].default must be a string or undefined, using default empty string`)
          res.default = ''
        }
        if (input.default == undefined) {
          res.default = ''
        }
        break;
      case 'number':
        if (typeof input.default != 'number' && input.default !== undefined) {
          warn(`.inputs[${input.name}].default must be a number or undefined, using default 0`)
          res.default = 0
        }
        if (input.default == undefined) {
          res.default = 0
        }
        break;
      case 'switch':
        if (typeof input.default != 'boolean' && input.default !== undefined) {
          warn(`.inputs[${input.name}].default must be a boolean or undefined, using default empty string`)
          res.default = false
        }
        if (input.default == undefined) {
          res.default = false
        }
        break;
      case 'dropdown':
        if (!Array.isArray(input.options)) {
          warn(`.inputs[${input.name}].options is not defined or is not an array, skipping this item`)
          return
        } else {
          res['options'] = input.options.map((option, optionID) => {
            if (typeof option.title != 'string' || typeof option.value != 'string' || (typeof option.tooltip != 'string' && option.tooltip != undefined)) {
              warn(`.inputs[${input.name}].options[${optionID}] does not have the correct items (title string, value string, tooltip string), skipping this item`)
              return
            }
            return {
              title: option.title,
              tooltip: option.tooltip,
              value: option.value,
            }
          }).filter(item => item)
        }
        break;
      default:
        warn(`.inputs[${input.name}].type = '${input.type}' is not valid, this input will be ignored`)
        return
    }

    return res;
  }

  parseNewLogic(input) {
    const outErrs = []
    const warn = (...data) => {
      outErrs.push(data.join(' '))
      console.log("logic parse warning:", ...data)
    }

    let conf = {
      components: {},
      introComponents: [],
    }

    if (input.components) {
      if (Array.isArray(input.components)) {
        input.components.map((component, i) => {
          if (!component.name || !component.title) {
            warn(`logic.components[${i}] does not have a name or title field, this component will be ignored`)
            return
          }

          const alreadyUsedNames = []

          let toInsert = {
            name: component.name,
            title: component.title,
            next: component.next ? Array.isArray(component.next) ? component.next : [component.next] : [],
            tooltip: component.tooltip,
            inputs: [],
            getInputs: undefined,
            advancedInputs: [],
          }

          if (component.getInputs) {
            toInsert.getInputs = component.getInputs
          }

          if (Array.isArray(component.inputs)) {
            component.inputs.map((input, inputID) => {
              if (!input.title || !input.name || !input.type) {
                warn(`logic.components[${i}].inputs[${inputID}] does not have a name, type or title field, this input will be ignored`)
                return
              }

              if (typeof input.validation != 'function' && typeof input.validation != 'undefined') {
                warn(`logic.components[${i}].inputs[${inputID}].validation must be undefined or a function`)
                return
              }

              if (typeof input.tooltip != 'string' && input.tooltip !== undefined) {
                warn(`logic.components[${i}].inputs[${inputID}].tooltip must be a string or not undefined`)
                return
              }

              if (alreadyUsedNames.indexOf(input.name) != -1) {
                warn(`logic.components[${i}].inputs[${inputID}].name can't be equal to other names`)
                return
              }

              const toAdd = this.parseInput(input, err => warn(`logic.components[${i}]${err}`))
              if (!toAdd) return;

              alreadyUsedNames.push(input.name)
              toInsert[input.advanced ? 'advancedInputs' : 'inputs'].push(toAdd)
              return
            })
          }

          conf.components[component.name] = toInsert
        })
        Object.keys(conf.components).map(key => {
          conf.components[key].next = conf.components[key].next.filter(componentKey => {
            if (conf.components[componentKey]) {
              return true
            }
            warn(`logic.component[???].next contains '${componentKey}' that does not exsist, this item will be ignored`)
            return false
          })
        })
      } else {
        warn(`logic.components is not an array`)
      }
    }

    if (input.introComponents) {
      if (Array.isArray(input.introComponents)) {
        input.introComponents.map(name => {
          if (conf.components[name]) {
            conf.introComponents.push(name)
          } else {
            warn(`logic.introComponents['${name}'] is not a known component`)
          }
        })
      } else if (typeof input.introComponents == 'string') {
        if (conf.components[input.introComponents]) {
          conf.introComponents.push(input.introComponents)
        } else {
          warn(`logic.introComponents = '${name}' is not a known component`)
        }
      } else {
        warn(`logic.introComponents is not an array or string`)
      }
    }

    this.errors = outErrs
    this.conf = conf
    return conf
  }
}
