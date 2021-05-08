import properties from '../properties';
import fixApiValue from './fixApiValue';

function getPopulation(country) {
  const population = properties.apiDataCountries.find((e) => {
    if (fixApiValue(country) === e.name) return e;
    return null;
  });
  return population || country;
}

export default function () {
  const result = properties.apiData.Countries.map((e) => {
    const temp = getPopulation(e.Country);
    e.population = temp.population;
    const flag = document.createElement('img');
    flag.src = temp.flag;
    flag.classList.add('stats__table--flag');
    e.flag = flag;
    return e;
  });

  result.forEach((e) => {
    e.TotalConfirmedR = Math.ceil((e.TotalConfirmed / e.population) * 100000);
    e.NewConfirmedR = Math.ceil((e.NewConfirmed / e.population) * 100000);
    e.TotalDeathsR = Math.ceil((e.TotalDeaths / e.population) * 100000);
    e.NewDeathsR = Math.ceil((e.NewDeaths / e.population) * 100000);
    e.TotalRecoveredR = Math.ceil((e.TotalRecovered / e.population) * 100000);
    e.NewRecoveredR = Math.ceil((e.NewRecovered / e.population) * 100000);
  });

  properties.apiDataRelative = result;
}
