class AmethReactive {
  constructor (options) {
    this.origen = options.data()

    // Destino
    this.$data = new Proxy(this.origen, {
      get (target, name) {
        // console.log(target, name)
        if (Reflect.has(target, name)) {
          return Reflect.get(target, name) //target[name]
        } else {
          console.warn('La propiedad', name, 'no existe')
          return ''
        }
      },
      set (target, name, value) {
        console.log(target, name, value)
        Reflect.set(target, name, value)
      }
    })
  }

  mount () {
    document.querySelectorAll('*[a-text]').forEach(el => {
      this.aText(el, this.$data, el.getAttribute('a-text'))
    })

    document.querySelectorAll('*[a-model]').forEach(el => {
      const name = el.getAttribute('a-model')
      this.aModel(el, this.$data, name)

      el.addEventListener('input', () => {
        // this.$data[name] = el.value
        Reflect.set(this.$data, name, el.value)
      })
    })
  }

  aText (el, target, name) {
    el.innerText = Reflect.get(target, name)
  }

  aModel (el, target, name) {
    el.value = Reflect.get(target, name)
  }
}

var Ameth = {
  createApp (options) {
    return new AmethReactive(options)
  }
}
