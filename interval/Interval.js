/**
 * A reified interval, adds semantics to setInterval.
 *
 * @constructor
 * @param {function} trigger - the callback that will be executed
 * @param {number}   wait    - length of the wait between intervals in milliseconds
 *
 * @see setInterval
 */
function Interval(trigger, wait) {
  if (!trigger) throw new Error('trigger is required');
  if (!wait) throw new Error('wait is required');

  var intervalId = null;

  /**
   * Return true if interval has started.
   *
   * @return {boolean}
   */
  this.isRunning = function() {
    return intervalId != null;
  };

  /**
   * Start the interval if it's not already running.
   *
   * @return {Interval}
   */
  this.start = function() {
    if (!this.isRunning()) {
      intervalId = setInterval(trigger, wait);
    }
    return this;
  };

  /**
   * Stop the interval if it's running.
   *
   * @return {Interval}
   */
  this.stop = function() {
    if (this.isRunning()) {
      clearInterval(intervalId);
      intervalId = null;
    }
    return this;
  };

  this.toString = function() {
    return str('#<Interval wait: ', wait, ' running: ', this.isRunning(), '>');
  };
}
