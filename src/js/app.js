import cardsData from './cardsData';
import CardDataParser from './CardDataParser';
import CardIdentifier from './CardIdentifier';
import Widget from './Widget';

const checkParameters = CardDataParser.getCheckParameters(cardsData);
const biggestFirstDigits = CardDataParser.getBiggestFirstDigits(cardsData);
const cardIdentifier = new CardIdentifier(checkParameters, biggestFirstDigits);

const widgetContainer = document.querySelector('#widget-container');

const widget = new Widget(widgetContainer, cardIdentifier);
widget.bindToDOM();
