export default class CardIdentifier {
  constructor(checkParameters, biggestFirstDigits) {
    this.checkParameters = checkParameters;
    this.biggestFirstDigits = biggestFirstDigits;
  }

  identifyPaySystem(number) {
    let result;
    for (const card of this.checkParameters) {
      if (result) {
        break;
      }
      for (const range of card.firstDigits) {
        if (
          (number >= range.from && number <= range.to)
          && card.acceptableLength.includes(this.cardNumberLength)
        ) {
          result = card.name;
          break;
        }
      }
    }
    return result;
  }

  static checkWithLuhnAlgorithm(digits) {
    const lastDigit = digits.pop();
    const sum = digits.reverse().reduce((acc, digit, index) => {
      if (index % 2 === 0) {
        let newDigit = digit * 2;
        if (newDigit > 9) {
          newDigit -= 9;
        }
        return acc + newDigit;
      }
      return acc + digit;
    }, 0);
    return (sum + lastDigit) % 10 === 0;
  }

  identifyCard(cardNumber) {
    const digits = [...String(cardNumber)].map((item) => +item);
    this.cardNumberLength = digits.length;

    const algorithmPassed = this.constructor.checkWithLuhnAlgorithm([...digits]);

    let companyName;

    if (!algorithmPassed) {
      console.error('Error: Luhn algorithm check failed!');
    } else {
      let firstDigits = digits.splice(0, String(this.biggestFirstDigits).length).join('');

      while (firstDigits > 0) {
        companyName = this.identifyPaySystem(firstDigits);
        if (companyName) {
          break;
        }
        firstDigits = Math.trunc(firstDigits / 10);
      }
    }

    if (algorithmPassed && !companyName) {
      console.error('Error: Pay system doesn\'t supported!');
    }

    return companyName;
  }
}
