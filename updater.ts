import { writeFileSync, readFileSync } from 'fs';
import { loadTest } from './loadTest';

const allPipedInstancesUrl = 'https://raw.githubusercontent.com/wiki/TeamPiped/Piped/Instances.md';
const invidious_instances = JSON.parse(readFileSync('./invidious.json', 'utf8'));

async function getSuggestions(i: string) {
  const t = performance.now();
  let array = [0, ''];

  await fetch(i + '/opensearch/suggestions?query=the')
    .then((res) => res.json())
    .then((data) => {
      const score = 1 / (performance.now() - t);
      if (data.length) array = [score, i];
      else throw new Error();
    })
    .catch(() => [0, '']);

  return array;
}

async function getIVS(i: string) {
  const t = performance.now();
  let array = [0, ''];

  await fetch(i + '/api/v1/search/suggestions?q=the')
    .then(res => res.json())
    .then(data => {
      const score = 1 / (performance.now() - t);
      if (data?.suggestions?.length) array = [score, i];
      else throw new Error();
    })
    .catch(() => [0, '']);

  return array;
}


fetch(allPipedInstancesUrl)
  .then(res => res.text())
  .then(text => text.split('--- | --- | --- | --- | ---')[1])
  .then(table => table.split('\n'))
  .then(instances => instances.map((instance) => instance.split(' | ')[1]))
  .then(async instances => {
    instances.shift();

    const dynamic_instances: {
      piped: string[],
      invidious: string[],
      cobalt: string,
    } = {
      piped: [],
      invidious: [],
      cobalt: '',
    };

    await Promise.all(
      invidious_instances
        .map(getIVS)
    )
      .then(array => array
        .sort((a, b) => <number>b[0] - <number>a[0])
        .filter(i => i[0])
        .forEach(
          i => loadTest(i[1])
            .then((passed: boolean) => {
              if (passed) dynamic_instances.invidious.push(i[1] as string)
            })
        ))


    await Promise.all(instances.map(getSuggestions))
      .then(array => {
        array
          .sort((a, b) => <number>b[0] - <number>a[0])
          .filter(i => i[0] && i[1] !== 'https://pipedapi.kavin.rocks')
          .forEach(i => dynamic_instances.piped.push(i[1] as string));
        console.log(dynamic_instances);
      });

    if (dynamic_instances.invidious.length)
      writeFileSync(
        'dynamic_instances.json',
        JSON.stringify({
          piped: [dynamic_instances.piped[0]],
          invidious: dynamic_instances.invidious,
          cobalt: 'https://cobalt-api.kwiatekmiki.com'
        }, null, 4)
      );

  });
