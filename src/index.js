import { fetchCountries } from './fetchCountries';
import './css/styles.css';
// const debounce = require('lodash.debounce');
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(element) {
  element.preventDefault();

  const selectCounties = element.target.value.trim();
  if (selectCounties === '') {
    clearMarkup(refs.countryList);
    clearMarkup(refs.countryInfo);
    return;
  }

  fetchCountries(selectCounties)
    .then(countries => {
      if (countries.length > 10) {
        clearMarkup(refs.countryList);
        clearMarkup(refs.countryInfo);
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countries.length >= 2 && countries.length <= 10) {
        clearMarkup(refs.countryList);
        clearMarkup(refs.countryInfo);
        createMarkupCountryList(countries);
      }
      if (countries.length === 1) {
        clearMarkup(refs.countryList);
        clearMarkup(refs.countryInfo);
        createMarkupCountryInfo(countries);
      }
    })
    .catch(error => {
      clearMarkup(refs.countryList);
      clearMarkup(refs.countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupCountryList(countries) {
  const markupList = countries
    .map(
      ({ name, flags }) =>
        /*html*/ `<li class="country-list__item"><img class="country-list__gallery" src="${flags.svg}" alt="flag" width="30"> ${name.official}</li>`
    )
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markupList);
  return markupList;
}

function createMarkupCountryInfo(countries) {
  const markupInfo = countries
    .map(
      ({
        name,
        capital,
        population,
        flags,
        languages,
      }) => /*html*/ `<h1 class="country-info__title"><img src="${
        flags.svg
      }" alt="flag" width="40"> ${name.official}</h1>
    <p><b>Capital</b>${capital}</p>
    <p><b>Population</b>${population}</p>
    <p><b>Languages</b>${Object.values(languages)}</p>`
    )
    .join('');
  refs.countryInfo.insertAdjacentHTML('beforeend', markupInfo);
  return markupInfo;
}

function clearMarkup(markup) {
  return (markup.innerHTML = '');
}
