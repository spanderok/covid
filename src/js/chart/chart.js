import Chart from '../../../node_modules/chart.js/dist/Chart.min';
import properties from '../properties';

export default function (stateControls, region, period, value) {
  let chart;
  const destrChart = document.querySelector('#chart');
  destrChart.remove();
  document.querySelector('#wrapper-chart').innerHTML =
    '<canvas id="chart"></canvas>';
  const ctx = document.querySelector('#chart').getContext('2d');
  let state = []; // axis y
  let arrTotalCases = [];
  let arrDates = []; // axis x
  let arrTotalDeaths = [];
  let arrTotalRecovered = [];
  let color;
  let title;
  let chartConfig = {};
  if (value === 'absolute' || value === undefined) {
    if (period === 'All time' || period === undefined) {
      if (region === undefined || region === 'World') {
        fetch('https://disease.sh/v3/covid-19/historical/all') // for all world
          .then((response) => response.json())
          .then((data) => {
            arrDates = Object.keys(data.deaths);
            arrTotalCases = Object.values(data.cases);
            arrTotalDeaths = Object.values(data.deaths);
            arrTotalRecovered = Object.values(data.recovered);
            if (stateControls === 'cases' && region === 'World') {
              state = arrTotalCases;
              title = 'total cases for the last month';
              color = 'rgba(255, 211, 0, 0.8)';
            } else if (stateControls === 'deaths' && region === 'World') {
              state = arrTotalDeaths;
              title = 'total death for the last month';
              color = 'rgba(124, 10, 10, 0.8)';
            } else if (stateControls === 'recovered' && region === 'World') {
              state = arrTotalRecovered;
              title = 'total recovered for the last month';
              color = 'rgba(57, 137, 48, 0.8)';
            } else if (stateControls === undefined && region === undefined) {
              state = arrTotalCases;
              title = 'total cases for the last month';
              color = 'rgba(255, 211, 0, 0.8)';
            }

            chartConfig = {
              type: 'line',
              data: {
                labels: arrDates, // axis x
                datasets: [
                  {
                    label: '',
                    data: state, // axis y
                    backgroundColor: [color],
                  },
                ],
              },
              options: {
                title: {
                  display: true,
                  text: title, // title graph
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: false,
                      },
                    },
                  ],
                },
              },
            };

            chart = new Chart(ctx, chartConfig);
            chart.update();
          });
      } else {
        fetch(
          `https://disease.sh/v3/covid-19/historical/${region}?lastdays=all`
        ) // for specific country
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
            let keys = Object.keys(data.timeline.cases);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              arrDates.push(keys[i]);
              arrTotalCases.push(data.timeline.cases[keys[i]]);
            }
            keys = Object.keys(data.timeline.deaths);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              // arrDates.push(keys[i]);
              arrTotalDeaths.push(data.timeline.deaths[keys[i]]);
            }

            keys = Object.keys(data.timeline.recovered);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              // arrDates.push(keys[i]);
              arrTotalRecovered.push(data.timeline.recovered[keys[i]]);
            }

            if (stateControls === 'cases') {
              state = arrTotalCases;
              title = `total cases ${region} summary`;
              color = 'rgba(255, 211, 0, 0.8)';
            } else if (stateControls === 'deaths') {
              state = arrTotalDeaths;
              title = `total deaths ${region} summary`;
              color = 'rgba(124, 10, 10, 0.8)';
            } else if (stateControls === 'recovered') {
              state = arrTotalRecovered;
              title = `total recovered ${region} summary`;
              color = 'rgba(57, 137, 48, 0.8)';
            } else if (stateControls === undefined) {
              state = arrTotalCases;
              title = `total cases ${region} summary`;
              color = 'rgba(255, 211, 0, 0.8)';
            }

            chartConfig = {
              type: 'line',
              data: {
                labels: arrDates, // axis x
                datasets: [
                  {
                    label: '',
                    data: state, // axis y
                    backgroundColor: [color],
                  },
                ],
              },
              options: {
                title: {
                  display: true,
                  text: title, // title graph
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              },
            };
            chart = new Chart(ctx, chartConfig);
          });
      }
    } else {
      if (region === undefined || region === 'World') {
        fetch('https://disease.sh/v3/covid-19/historical/all') // for all world
          .then((response) => response.json())
          .then((data) => {
            arrDates = Object.keys(data.deaths);
            const arrCases = Object.values(data.cases);
            const arrDeaths = Object.values(data.deaths);
            const arrRecovered = Object.values(data.recovered);

            for (let i = 0, l = arrDates.length; i < l; i += 1) {
              // get arr of total daily cases
              arrTotalCases.push(
                arrCases[i + 1] - arrCases[i] < 0
                  ? 0
                  : arrCases[i + 1] - arrCases[i]
              );
            }
            for (let i = 0, l = arrDates.length; i < l; i += 1) {
              // get arr of total daily cases
              arrTotalDeaths.push(
                arrDeaths[i + 1] - arrDeaths[i] < 0
                  ? 0
                  : arrDeaths[i + 1] - arrDeaths[i]
              );
            }
            for (let i = 0, l = arrDates.length; i < l; i += 1) {
              // get arr of total daily cases
              arrTotalRecovered.push(
                arrRecovered[i + 1] - arrRecovered[i] < 0
                  ? 0
                  : arrRecovered[i + 1] - arrRecovered[i]
              );
            }

            if (stateControls === 'cases' && region === 'World') {
              state = arrTotalCases;
              title = 'total historical daily cases ';
              color = 'rgba(255, 211, 0, 0.8)';
            } else if (stateControls === 'deaths' && region === 'World') {
              state = arrTotalDeaths;
              title = 'total historical daily death';
              color = 'rgba(124, 10, 10, 0.8)';
            } else if (stateControls === 'recovered' && region === 'World') {
              state = arrTotalRecovered;
              title = 'total historical daily recovered';
              color = 'rgba(57, 137, 48, 0.8)';
            } else if (stateControls === undefined && region === undefined) {
              state = arrTotalCases;
              title = 'total historical daily cases';
              color = 'rgba(255, 211, 0, 0.8)';
            }

            chartConfig = {
              type: 'line',
              data: {
                labels: arrDates, // axis x
                datasets: [
                  {
                    label: '',
                    data: state, // axis y
                    backgroundColor: [color],
                  },
                ],
              },
              options: {
                title: {
                  display: true,
                  text: title, // title graph
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              },
            };

            chart = new Chart(ctx, chartConfig);
            chart.update();
          });
      } else {
        fetch(
          `https://disease.sh/v3/covid-19/historical/${region}?lastdays=all`
        ) // for specific country
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
            let keys = Object.keys(data.timeline.cases);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              arrDates.push(keys[i]);
              arrTotalCases.push(
                data.timeline.cases[keys[i]] -
                  data.timeline.cases[keys[i - 1]] <
                  0
                  ? 0
                  : data.timeline.cases[keys[i]] -
                      data.timeline.cases[keys[i - 1]]
              );
            }
            keys = Object.keys(data.timeline.deaths);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              // arrDates.push(keys[i]);
              arrTotalDeaths.push(
                data.timeline.deaths[keys[i]] -
                  data.timeline.deaths[keys[i - 1]] <
                  0
                  ? 0
                  : data.timeline.deaths[keys[i]] -
                      data.timeline.deaths[keys[i - 1]]
              );
            }

            keys = Object.keys(data.timeline.recovered);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              // arrDates.push(keys[i]);
              arrTotalRecovered.push(
                data.timeline.recovered[keys[i]] -
                  data.timeline.recovered[keys[i - 1]] <
                  0
                  ? 0
                  : data.timeline.deaths[keys[i]] -
                      data.timeline.deaths[keys[i - 1]]
              );
            }

            if (stateControls === 'cases') {
              state = arrTotalCases;
              title = `historical daily cases ${region}`;
              color = 'rgba(255, 211, 0, 0.8)';
            } else if (stateControls === 'deaths') {
              state = arrTotalDeaths;
              title = `historical daily deaths ${region}`;
              color = 'rgba(124, 10, 10, 0.8)';
            } else if (stateControls === 'recovered') {
              state = arrTotalRecovered;
              title = `historical daily recovered ${region}`;
              color = 'rgba(57, 137, 48, 0.8)';
            } else if (stateControls === undefined) {
              state = arrTotalCases;
              title = `historical daily cases ${region}`;
              color = 'rgba(255, 211, 0, 0.8)';
            }

            chartConfig = {
              type: 'line',
              data: {
                labels: arrDates, // axis x
                datasets: [
                  {
                    label: '',
                    data: state, // axis y
                    backgroundColor: [color],
                  },
                ],
              },
              options: {
                title: {
                  display: true,
                  text: title, // title graph
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              },
            };
            chart = new Chart(ctx, chartConfig);
          });
      }
    }
  } else if (value === 'per') {
    if (period === 'All time' || period === undefined) {
      if (region === undefined || region === 'World') {
        const population = 7830458560;
        fetch('https://disease.sh/v3/covid-19/historical/all') // for all world
          .then((response) => response.json())
          .then((data) => {
            // eslint-disable-next-line no-shadow
            const arrDates = Object.keys(data.deaths);
            const arrCases = Object.values(data.cases);
            const arrDeaths = Object.values(data.deaths);
            const arrRecovered = Object.values(data.recovered);

            for (let i = arrCases.length - 1; i > 0; i -= 1) {
              // get arr of total cases
              arrTotalCases.push((arrCases[i] * 100000) / population);
            }
            for (let i = arrDeaths.length - 1; i > 0; i -= 1) {
              // get arr of total deaths
              arrTotalDeaths.push((arrDeaths[i] * 100000) / population);
            }
            for (let i = arrRecovered.length - 1; i > 0; i -= 1) {
              // get arr of total recovered
              arrTotalRecovered.push((arrRecovered[i] * 100000) / population);
            }
            if (stateControls === 'cases' && region === 'World') {
              state = arrTotalCases;
              title = 'total cases summary per 100 000 ';
              color = 'rgba(255, 211, 0, 0.8)';
            } else if (stateControls === 'deaths' && region === 'World') {
              state = arrTotalDeaths;
              title = 'total death summary per 100 000';
              color = 'rgba(124, 10, 10, 0.8)';
            } else if (stateControls === 'recovered' && region === 'World') {
              state = arrTotalRecovered;
              title = 'total recovered summary per 100 000';
              color = 'rgba(57, 137, 48, 0.8)';
            } else if (stateControls === undefined && region === undefined) {
              state = arrTotalCases;
              title = 'total cases summary per 100 000';
              color = 'rgba(255, 211, 0, 0.8)';
            }

            chartConfig = {
              type: 'line',
              data: {
                labels: arrDates, // axis x
                datasets: [
                  {
                    label: '',
                    data: state, // axis y
                    backgroundColor: [color],
                  },
                ],
              },
              options: {
                title: {
                  display: true,
                  text: title, // title graph
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              },
            };

            chart = new Chart(ctx, chartConfig);
            chart.update();
          });
      } else {
        const countryObj = properties.apiDataRelative.find((e) => {
          return e.Country === region;
        });
        // const {population: population} = countryObj;
        const {population} = countryObj;
        fetch(
          `https://disease.sh/v3/covid-19/historical/${region}?lastdays=all`
        ) // for specific country
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
            let keys = Object.keys(data.timeline.cases);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              arrDates.push(keys[i]);
              arrTotalCases.push(
                (data.timeline.cases[keys[i]] * 100000) / population
              );
            }
            keys = Object.keys(data.timeline.deaths);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              // arrDates.push(keys[i]);
              arrTotalDeaths.push(
                (data.timeline.deaths[keys[i]] * 100000) / population
              );
            }

            keys = Object.keys(data.timeline.recovered);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              // arrDates.push(keys[i]);
              arrTotalRecovered.push(
                (data.timeline.recovered[keys[i]] * 100000) / population
              );
            }

            if (stateControls === 'cases') {
              state = arrTotalCases;
              title = `total cases ${region} summary per 100 000`;
              color = 'rgba(255, 211, 0, 0.8)';
            } else if (stateControls === 'deaths') {
              state = arrTotalDeaths;
              title = `total deaths ${region} summary per 100 000`;
              color = 'rgba(124, 10, 10, 0.8)';
            } else if (stateControls === 'recovered') {
              state = arrTotalRecovered;
              title = `total recovered ${region} summary per 100 000`;
              color = 'rgba(57, 137, 48, 0.8)';
            } else if (stateControls === undefined) {
              state = arrTotalCases;
              title = `total cases ${region} summary per 100 000`;
              color = 'rgba(255, 211, 0, 0.8)';
            }

            chartConfig = {
              type: 'line',
              data: {
                labels: arrDates, // axis x
                datasets: [
                  {
                    label: '',
                    data: state, // axis y
                    backgroundColor: [color],
                  },
                ],
              },
              options: {
                title: {
                  display: true,
                  text: title, // title graph
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              },
            };
            chart = new Chart(ctx, chartConfig);
          });
      }
    } else {
      if (region === undefined || region === 'World') {
        const population = 7830458560;
        fetch('https://disease.sh/v3/covid-19/historical/all') // for all world
          .then((response) => response.json())
          .then((data) => {
            arrDates = Object.keys(data.deaths);
            const arrCases = Object.values(data.cases);
            const arrDeaths = Object.values(data.deaths);
            const arrRecovered = Object.values(data.recovered);

            for (let i = data.length - 1; i > 0; i -= 1) {
              // get arr of total cases
              arrTotalCases.push(
                ((arrCases[i + 1] - arrCases[i] < 0
                  ? 0
                  : arrCases[i + 1] - arrCases[i]) *
                  100000) /
                  population
              );
            }
            for (let i = data.length - 1; i > 0; i -= 1) {
              // get arr of total deaths
              arrTotalDeaths.push(
                ((arrDeaths[i + 1] - arrDeaths[i] < 0
                  ? 0
                  : arrDeaths[i + 1] - arrDeaths[i]) *
                  100000) /
                  population
              );
            }
            for (let i = data.length - 1; i > 0; i -= 1) {
              // get arr of total recovered
              arrTotalRecovered.push(
                ((arrRecovered[i + 1] - arrRecovered[i] < 0
                  ? 0
                  : arrRecovered[i + 1] - arrRecovered[i]) *
                  100000) /
                  population
              );
            }
            if (stateControls === 'cases' && region === 'World') {
              state = arrTotalCases;
              title = 'total historical daily cases per 100 000';
              color = 'rgba(255, 211, 0, 0.8)';
            } else if (stateControls === 'deaths' && region === 'World') {
              state = arrTotalDeaths;
              title = 'total historical daily death per 100 000';
              color = 'rgba(124, 10, 10, 0.8)';
            } else if (stateControls === 'recovered' && region === 'World') {
              state = arrTotalRecovered;
              title = 'total historical daily recovered per 100 000';
              color = 'rgba(57, 137, 48, 0.8)';
            } else if (stateControls === undefined && region === undefined) {
              state = arrTotalCases;
              title = 'total historical daily cases per 100 000';
              color = 'rgba(255, 211, 0, 0.8)';
            }

            chartConfig = {
              type: 'line',
              data: {
                labels: arrDates, // axis x
                datasets: [
                  {
                    label: '',
                    data: state, // axis y
                    backgroundColor: [color],
                  },
                ],
              },
              options: {
                title: {
                  display: true,
                  text: title, // title graph
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              },
            };

            chart = new Chart(ctx, chartConfig);
            chart.update();
          });
      } else {
        const countryObj = properties.apiDataRelative.find((e) => {
          return e.Country === region;
        });
        // const {population: population} = countryObj;
        const {population} = countryObj;
        fetch(
          `https://disease.sh/v3/covid-19/historical/${region}?lastdays=all`
        ) // for specific country
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
            let keys = Object.keys(data.timeline.cases);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              arrDates.push(keys[i]);
              arrTotalCases.push(
                ((data.timeline.cases[keys[i]] -
                  data.timeline.cases[keys[i - 1]] <
                0
                  ? 0
                  : data.timeline.cases[keys[i]] -
                    data.timeline.cases[keys[i - 1]]) *
                  100000) /
                  population
              );
            }
            keys = Object.keys(data.timeline.deaths);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              // arrDates.push(keys[i]);
              arrTotalDeaths.push(
                ((data.timeline.deaths[keys[i]] -
                  data.timeline.deaths[keys[i - 1]] <
                0
                  ? 0
                  : data.timeline.deaths[keys[i]] -
                    data.timeline.deaths[keys[i - 1]]) *
                  100000) /
                  population
              );
            }

            keys = Object.keys(data.timeline.recovered);
            for (let i = 0, l = keys.length; i < l; i += 1) {
              // arrDates.push(keys[i]);
              arrTotalRecovered.push(
                ((data.timeline.recovered[keys[i]] -
                  data.timeline.recovered[keys[i - 1]] <
                0
                  ? 0
                  : data.timeline.deaths[keys[i]] -
                    data.timeline.deaths[keys[i - 1]]) *
                  100000) /
                  population
              );
            }

            if (stateControls === 'cases') {
              state = arrTotalCases;
              title = `historical daily cases ${region} per 100 000`;
              color = 'rgba(255, 211, 0, 0.8)';
            } else if (stateControls === 'deaths') {
              state = arrTotalDeaths;
              title = `historical daily deaths ${region} per 100 000`;
              color = 'rgba(124, 10, 10, 0.8)';
            } else if (stateControls === 'recovered') {
              state = arrTotalRecovered;
              title = `historical daily recovered ${region} per 100 000`;
              color = 'rgba(57, 137, 48, 0.8)';
            } else if (stateControls === undefined) {
              state = arrTotalCases;
              title = `historical daily cases ${region} per 100 000`;
              color = 'rgba(255, 211, 0, 0.8)';
            }

            chartConfig = {
              type: 'line',
              data: {
                labels: arrDates, // axis x
                datasets: [
                  {
                    label: '',
                    data: state, // axis y
                    backgroundColor: [color],
                  },
                ],
              },
              options: {
                title: {
                  display: true,
                  text: title, // title graph
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              },
            };
            chart = new Chart(ctx, chartConfig);
          });
      }
    }
  }
}
