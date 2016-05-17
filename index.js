module.exports = { wield };

function wield(iter) {
  return function step(resume) {
    const {value, done} = iter.next(resume);
    return done ? value : value.flatMap(step);
  }();
}
