class AmethReactive {
  // Dependiencias
  deps = new Map()
  constructor (options) {
    this.origen = options.data()

    const self = this

    // Destino
    this.$data = new Proxy(this.origen, {
      get (target, name) {
        // console.log(target, name)
        if (Reflect.has(target, name)) {
          self.track(target, name)
          return Reflect.get(target, name) //target[name]
        } else {
          console.warn('La propiedad', name, 'no existe')
          return ''
        }
      },
      set (target, name, value) {
        // console.log(target, name, value)
        Reflect.set(target, name, value)
        self.trigger(name)

        const list = Array.from(document.querySelectorAll('*'))
        const aBindList = list.filter(el => {
          return [...el.attributes].some(attr => {
            // console.log(attr)
            return attr.name.startsWith('a-bind') && attr.value == name
          })
        })
        // console.log(aBindList)
        aBindList.forEach(el => {
          // console.log(el)
          ;[...el.attributes].forEach(attr => {
            // console.log(attr)
            if (attr.name.startsWith('a-bind')) {
              const attribute = attr.name.split(':').pop()
              const value = attr.value
              // console.log(attribute, value)
              // console.log(self.$data)
              if (name == value) {
                self.aBind(el, self.$data, value, attribute)
              }
            }
          })
        })
      }
    })
  }

  track (target, name) {
    if (!this.deps.has(name)) {
      const effect = () => {
        document.querySelectorAll(`*[a-text=${name}]`).forEach(el => {
          this.aText(el, target, name)
        })
        document.querySelectorAll(`*[a-model=${name}]`).forEach(el => {
          this.aModel(el, target, name)
        })
      }
      this.deps.set(name, effect)
    }
  }

  trigger (name) {
    const effect = this.deps.get(name)
    effect()
  }

  mount () {
    // a-text
    document.querySelectorAll('*[a-text]').forEach(el => {
      this.aText(el, this.$data, el.getAttribute('a-text'))
    })

    // a-model
    document.querySelectorAll('*[a-model]').forEach(el => {
      const name = el.getAttribute('a-model')
      this.aModel(el, this.$data, name)

      el.addEventListener('input', () => {
        // this.$data[name] = el.value
        Reflect.set(this.$data, name, el.value)
      })
    })

    // a-bind:
    // listo todos los elementos del DOM en un array para poder recorrerlos
    const list = Array.from(document.querySelectorAll('*'))

    // Filtro solo los que tengan atributos que empiecen con 'a-bind'
    const aBindList = list.filter(el => {
      return [...el.attributes].some(attr => {
        // console.log(attr)
        return attr.name.startsWith('a-bind')
      })
    })

    // De ese listado filtrado, vuelvo a recorrerlos para obtener solo los atributos a-bind
    // Luego separo por el ':' para obtener el nombre del atributo real del HTML que voy a vincular
    // Tambien obtengo el valor que tiene ese atributo, que debe ser el valor de la propiedad en el objeto data()
    // Finalmente envio los valores a la función aBind() para que renderice según el valor de la propiedad

    // console.log(aBindList)
    aBindList.forEach(el => {
      // console.log(el)
      ;[...el.attributes].forEach(attr => {
        // console.log(attr)
        if (attr.name.startsWith('a-bind')) {
          const attribute = attr.name.split(':').pop()
          const value = attr.value
          // console.log(attribute, value)
          this.aBind(el, this.$data, value, attribute)
        }
      })
    })
  }

  aText (el, target, name) {
    el.innerText = Reflect.get(target, name)
  }

  aModel (el, target, name) {
    el.value = Reflect.get(target, name)
  }

  aBind (el, target, name, attr) {
    // Reflect.set(el, attr, Reflect.get(target, name))
    el.setAttribute(attr, Reflect.get(target, name))
  }
}

var Ameth = {
  createApp (options) {
    return new AmethReactive(options)
  }
}
