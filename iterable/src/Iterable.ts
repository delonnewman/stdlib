export function isIterable(value: any): value is Iterable<any> {
  return typeof value[Symbol.iterator] === 'function'
}


export function mixin(klass) {
  const proto = klass.prototype
  for (let key of Object.keys(StaticMethods)) {
    proto[key] = function(...args) {
      StaticMethods[key](this, ...args)
    }
  }
  return klass
}

const StaticMethods = {
  drop: (items: Iterable<any>, n: number): Iterable<any> => ({
    [Symbol.iterator]: () => ({
      next: function(...args): IteratorResult<any, any> {
        this._dropped = this._dropped == null ? 0 : this._dropped

        if (this._dropped === 0) {
          for (let _ of items) {
            if (this._dropped == n) break
            this._dropped++
          }
          return items[Symbol.iterator]().next(...args)
        } else {
          return items[Symbol.iterator]().next(...args)
        }
      }
    })
  }),

  take: (items: Iterable<any>, n: number): Iterable<any> => ({
    [Symbol.iterator]: () => ({
      next: function(...args): IteratorResult<any, any> {
        this._taken = this._taken == null ? 0 : this._taken

        if (this._taken > n) {
          return {
            done: true,
            value: undefined
          }
        } else {
          this._taken++
          return items[Symbol.iterator]().next(...args)
        }
      }
    })
  }),

  map: (items: Iterable<any>, fn: (value: any) => any): Iterable<any> => ({
    [Symbol.iterator]: () => ({
      next: function(...args): IteratorResult<any, any> {
        const iter = items[Symbol.iterator]().next(...args)

        if (iter.done) {
          return iter
        } else {
          return {
            done: false,
            value: fn.call(null, iter.value)
          }
        }
      }
    })
  }),
}

export default StaticMethods
