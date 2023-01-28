import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const DEBOUNCE_DELAY = 300;

const inpurEl = document.querySelector('#search-box');
const ulEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');

inpurEl.addEventListener('input', debounce(oninputEvent, DEBOUNCE_DELAY));

function oninputEvent(e) {
  e.preventDefault();
  const inputValue = e.target.value.trim();

  if (inputValue === '') {
    clearMarkup();
    return;
  }
  fetchCountries(inputValue).then(checkAmountCountries).catch(onError);
}

function checkAmountCountries(countries) {
  if (countries.length === undefined) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    clearMarkup();
  } else if (countries.length >= 10) {
    clearMarkup();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length >= 2 && countries.length <= 10) {
    clearMarkup();
    ulEl.insertAdjacentHTML('beforeend', createCountriesList(countries));
  } else if (countries.length === 1) {
    clearMarkup();
    divEl.insertAdjacentHTML('beforeend', createMarkupCountry(countries));
  }
}

function createCountriesList(countries) {
  return countries
    .map(({ flags, name }) => {
      return `<li class="country-list__item">
      <img src="${flags.svg}" class="country-list__item--flag" />
      <h2 class="country-list__item--name">${name.official}</h2>
    </li>`;
    })
    .join('');
}

function createMarkupCountry(countries) {
  return countries
    .map(({ flags, name, capital, population, languages }) => {
      return `<ul class="country-info__list">
      <div class="country-info__list--container"><img src="${
        flags.svg
      }" class="country-info__list--img">
      <h2 class="country-info__list--name">${name.official}</h2></div>
      
      <li class="country-info__list--item"><span class="country-info__list--span">Capital:</span> ${capital}</li>
      <li class="country-info__list--item"><span class="country-info__list--span">Population:</span> ${population}</li>
      <li class="country-info__list--item"><span class="country-info__list--span">Language:</span> ${Object.values(
        languages
      )}</li>
    </ul>`;
    })
    .join('');
}

function clearMarkup() {
  ulEl.innerHTML = '';
  divEl.innerHTML = '';
}

function onError(err) {
  console.error(err);
}
