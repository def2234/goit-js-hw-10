const API_URL = 'https://restcountries.com/v3.1/';
function fetchCountries(name) {
  return fetch(
    `${API_URL}name/${name}?fields=name,capital,population,flags,languages`
  ).then(res => res.json());
}

export { fetchCountries };
