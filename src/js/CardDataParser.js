export default class CardDataParser {
  static getIterator() {
    return function iterator() {
      const { from, to } = this;
      let current;

      return {
        next() {
          current = current === undefined ? from : current + 1;

          if (current <= to) {
            return {
              done: false,
              value: current,
            };
          }
          return {
            done: true,
          };
        },
      };
    };
  }

  static getIterableRange(item, iterable = true) {
    let range = item.split('-');
    if (range.length > 1) {
      range = {
        from: +range[0],
        to: +range[1],
      };
    } else {
      range = {
        from: +range[0],
        to: +range[0],
      };
    }
    if (iterable) {
      range[Symbol.iterator] = this.getIterator();
    }
    return range;
  }

  static getCheckParameters(data) {
    try {
      return data.map((cardData) => {
        const result = {};
        [result.name] = cardData;
        result.firstDigits = cardData[1].split(',').map(
          (item) => this.getIterableRange(item, false),
        );
        result.acceptableLength = cardData[2].split(',').map(
          (item) => [...this.getIterableRange(item)],
        ).flat();
        return result;
      });
    } catch (e) {
      throw new Error(`Dataset Error: ${e.message}`);
    }
  }

  static getBiggestFirstDigits(data) {
    try {
      return Math.max(
        ...data
          .map((item) => item[1]
            .split(/-|,/))
          .flat()
          .map((item) => +item),
      );
    } catch (e) {
      throw new Error(`Dataset Error: ${e.message}`);
    }
  }
}
