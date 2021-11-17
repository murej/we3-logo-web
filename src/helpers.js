export function mapValue(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
        ? 0
        : x === 1
            ? 1
            : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

export function getSignMultiplier() {
    if (Math.random() < 0.5) {
      return -1;
    } else {
      return 1;
    }
  }