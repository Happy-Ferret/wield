module.exports = { wield, ReadWrite, unit, ask, tell };

function wield(iter) {
  return function step(resume) {
    const {value, done} = iter.next(resume);
    const rw = (value instanceof ReadWrite) ?
      value : unit(value);
    return done ? rw : rw.flatMap(step);
  }();
}

class ReadWrite {
  constructor(fn) {
    this.fn = fn;
  }

  run(ctx) {
    return this.fn(ctx);
  }

  flatMap(fn) {
    return new ReadWrite(ctx => {
      const [cur, curErrs] = this.run(ctx);
      const [val, valErrs] = fn(cur).run(ctx);
      return [val, [...curErrs, ...valErrs]];
 
    });
  }
}

function unit(val) {
  return new ReadWrite(() => [val, []]);
}

function ask() {
  return new ReadWrite(ctx => [ctx, []]);
}

function tell(log) {
  return new ReadWrite(() => [null, [log]]);
}
