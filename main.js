class AmethReactive {
  constructor (options) {
    this.origen = options.data()
  }

  mount () {
    document.querySelectorAll('*[a-text]').forEach(el => {
      this.aText(el, this.origen, el.getAttribute('a-text'))
    })
  }

  aText (el, target, name) {
    el.innerText = target[name]
  }

  aModel () {}
}

var Ameth = {
  createApp (options) {
    return new AmethReactive(options)
  }
}
