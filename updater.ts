import { writeFileSync, readFileSync } from 'fs';

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
    .catch(() => [0,'']);

  return array;
}


fetch(allPipedInstancesUrl)
  .then(res => res.text())
  .then(text => text.split('--- | --- | --- | --- | ---')[1])
  .then(table => table.split('\n'))
  .then(instances => instances.map((instance) => instance.split(' | ')[1]))
  .then(instances => {
    instances.shift();

    const dynamic_instances: {
      piped: string[],
      invidious: string[],
      cobalt: string,
      proxy: string,
      fallback: string
    } = {
      piped: [],
      invidious: [],
      cobalt: 'https://cobalt-api.kwiatekmiki.com',
      proxy: 'https://invidious.adminforge.de',
      fallback: 'https://video-api-transform.vercel.app/api'
    };
    
    Promise.all(invidious_instances.map(getIVS))
      .then(array => array
          .sort((a, b) => <number>b[0] - <number>a[0])
          .filter(i => i[0])
          .forEach(i => dynamic_instances.invidious.push(i[1] as string))
           );  
    

    Promise.all(instances.map(getSuggestions))
      .then(array => {
        array
          .sort((a, b) => <number>b[0] - <number>a[0])
          .filter(i => i[0] && i[1] !== 'https://pipedapi.kavin.rocks')
          .forEach(i => dynamic_instances.piped.push(i[1] as string));
        
        console.log(dynamic_instances);
        writeFileSync(
          'dynamic_instances.json',
          JSON.stringify(dynamic_instances, null, 4)
        );
      }
      );

  });

