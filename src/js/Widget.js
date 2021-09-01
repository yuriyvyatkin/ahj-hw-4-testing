export default class Widget {
  constructor(parentEl, cardIdentifier) {
    this.parentEl = parentEl;
    this.cardIdentifier = cardIdentifier;
  }

  static get markup() {
    return `
      <div class="col-md-5">
        <h3>Check your credit card number</h3>
        <ul class="cards list-unstyled">
          <li><span class="card visa" title="Visa">Visa</span></li>
          <li><span class="card mastercard" title="Mastercard">Mastercard</span></li>
          <li><span class="card american-express" title="American Express">American Express</span></li>
          <li><span class="card discover" title="Discover">Discover</span></li>
          <li><span class="card jcb" title="JCB">JCB</span></li>
          <li><span class="card diners-club" title="Diners Club">Diners Club</span></li>
          <li><span class="card mir" title="Mir">Mir</span></li>
        </ul>
        <form id="form" class="form-inline" novalidate="novalidate">
        <div class="form-group">
          <input class="form-control col-md-6" id="card-number" name="card-number" type="text" placeholder="Credit card number" maxlength="21">
          <a id="submitform" class="btn btn-success">Click to Validate</a>
        </div>
        </form>
      </div>
    `;
  }

  static get inputSelector() {
    return '#card-number';
  }

  static get submitSelector() {
    return '#submitform';
  }

  static get disabledCardSelector() {
    return '.disabled';
  }

  static get errorSelector() {
    return '.error';
  }

  bindToDOM() {
    this.parentEl.innerHTML = this.constructor.markup;
    const submit = this.parentEl.querySelector(this.constructor.submitSelector);
    submit.addEventListener('click', () => this.onSubmit());
  }

  onSubmit() {
    const input = this.parentEl.querySelector(this.constructor.inputSelector);
    input.classList.remove('valid', 'invalid');
    const cards = this.parentEl.querySelectorAll(this.constructor.cardSelector);
    if (!input.value.match(/^\d{13,21}$/)) {
      input.classList.add('invalid');
      return;
    }
    cards.forEach((card) => card.classList.remove('disabled'));
    let result = this.cardIdentifier.identifyCard(input.value);
    if (!result) {
      input.classList.add('invalid');
    } else {
      input.classList.add('valid');
      result = result.toLowerCase();
      cards.forEach((card) => {
        if (!card.classList.contains(result)) {
          card.classList.add('disabled');
        }
      });
    }
  }
}
