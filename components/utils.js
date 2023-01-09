module.exports = class Utils{

  //エラーハンドリング
  static wrap = fn => (...args) => fn(...args).catch(args[2])

  // sleep helper
  static sleep = (msec) => {
  return new Promise(resolve => setTimeout(resolve, msec));
  }
}