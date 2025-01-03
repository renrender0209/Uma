import { writeFileSync, readFileSync } from 'fs';
import { loadTest } from './loadTest';
import { hlsTest } from './hlsTest';

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
    instances.unshift('https://pol1.piapi.ggtyler.dev');

    const dynamic_instances: {
      piped: string[],
      invidious: string[],
      cobalt: string,
    } = {
      piped: [],
      invidious: [],
      supermix: 'https://backendmix.vercel.app/supermix'
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
          .filter(i => i[0])
          .forEach(
            (i, n) => hlsTest(i[1])
              .then((hls:string) => {
                if (hls) dynamic_instances.piped.push(i[1] as string)
              })
            .catch(()=> {
                if (n === 0) dynamic_instances.piped.push(i[1] as string)
            })
            
          )
        
      });

    console.log(dynamic_instances);
    
    if (dynamic_instances.invidious.length)
      writeFileSync(
        'dynamic_instances.json',
        JSON.stringify( dynamic_instances, null, 4)
      );

  });
