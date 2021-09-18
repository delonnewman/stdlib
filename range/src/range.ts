type DateRange = any
type StringRange = any

type Duration = any
type DateStepValue = number | "year" | "month" | "day" | "hour" | Duration

export function range(start: Date, end: Date, step: DateStepValue): DateRange
export function range(start: Date, end: Date): DateRange
export function range(end: Date): DateRange
export function range(start: string, end: string): StringRange
export function range(start: number, end: number, step: number): Iterable<any>
export function range(start: number, end: number): Range
export function range(end: number): Range
export function range(...args: any[]): Iterable<any> {
  if (args.length === 3) {
    return new Range(args[0], args[1]).step(args[2])
  } else if (args.length === 2) {
    return new Range(args[0], args[1])
  } else if (args.length === 1) {
    return new Range(0, args[0])
  } else {
    throw new Error(`expected between 1 and 3 arguments, got: ${args.length}`)
  }
}

export interface Rangeable {
  succ(): any
}

export function isRangable(obj: any): obj is Rangeable {
  return typeof obj.succ === 'function'
}

export class Range implements Iterable<any> {
  readonly begin: any
  readonly end: any
  readonly excludeEnd: boolean

  constructor(begin, end, excludeEnd = false) {
    this.begin = begin
    this.end = end
    this.excludeEnd = excludeEnd
  }

  isNumeric() {
    // eventually we'll support infinite ranges
    return typeof this.begin === 'number' && typeof this.end === 'number' &&
      (!isNaN(this.begin) && !isNaN(this.end)) && (isFinite(this.begin) && isFinite(this.end))
  }

  isIntegral() {
    return Number.isInteger(this.begin) && Number.isInteger(this.end)
  }

  exclude_end$() {
    return this.excludeEnd
  }

  step(n: number, fn: (obj: any) => void): Range
  step(n: number): IterableIterator<any>
  step(): IterableIterator<any>
  step(n = 1, fn = undefined): IterableIterator<any> | Range {
    let isNumeric = this.isNumeric()
    let isIntegral = this.isIntegral()

    if (isNumeric && isIntegral && fn != null) {
      let end = this.excludeEnd ? this.end - 1 : this.end
      for (let i = this.begin; i <= end; i += n) {
        fn.call(null, i)
      }
      return this
    } else if (isNumeric && isIntegral) {
      const self = this
      return {
        next(): IteratorResult<number, number> {
          this._current = this._current == null ? self.begin : this._current
          let end = self.excludeEnd ? self.end - 1 : self.end

          if (this._current === end) {
            return {
              done: true,
              value: end
            }
          } else {
            let value = this._current += n
            return {
              done: false,
              value
            }
          }
        },

        [Symbol.iterator]: function() {
          return this
        }
      }
    } else if (isNumeric) {
      throw new Error(`Can't iterate from non integer values`)
    } else {
      throw new Error(`Can't iterate from the given values`)
    }
  }

  [Symbol.iterator](): IterableIterator<any> {
    return this.step()
  }
}
