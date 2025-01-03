import { writeFileSync, readFileSync } from 'fs';
import { loadTest } from './loadTest';
import { hlsTest } from './hlsTest';

const piped_instances = 'https://raw.githubusercontent.com/wiki/TeamPiped/Piped/Instances.md';
const invidious_instances = JSON.parse(readFileSync('./invidious.json', 'utf8'));
const dynamic_instances: {
  piped: string[];
  invidious: string[];
  supermix: string;
} = {
  piped: [],
  invidious: [],
  supermix: 'https://backendmix.vercel.app/supermix',
};

async function getSuggestions(i: string) {
  const t = performance.now();
  const isIV = invidious_instances.includes(i);
  const q = isIV ?
    '/api/v1/search/suggestions?q=the' :
    '/opensearch/suggestions?query=the';

  return fetch(i + q)
    .then(_ => _.json())
    .then(data => {
      const score = 1 / (performance.now() - t);
      if (isIV ? data?.suggestions?.length : data.length)
        return [score, i];
      else throw new Error();
    })
    .catch(() => [0, '']);
}

async function getInstances(instanceArray: string[], callback: (value: (string | number)[], index: number) => void) {
  await Promise.all(instanceArray.map(getSuggestions)).then(array =>
    array
      .sort((a, b) => <number>b[0] - <number>a[0])
      .filter((i) => i[0])
      .forEach(callback)
  );
}

fetch(piped_instances)
  .then(r => r.text())
  .then(t => t.split('--- | --- | --- | --- | ---')[1])
  .then(t => t.split('\n'))
  .then(i => i.map(_ => _.split(' | ')[1]))
  .then(async instances => {
    instances[0] = 'https://pol1.piapi.ggtyler.dev';

    await getInstances(invidious_instances, async i => {
      console.log(i);
      if (await loadTest(i[1]))
        dynamic_instances.invidious.push(i[1] as string);
    });

    await getInstances(instances, async i => {
      console.log(i);
      const hls = await hlsTest(i[1]);
      console.log(i[1], hls);
      if (hls) dynamic_instances.piped.push(i[1] as string);     
    });
  })
.then(() => {
    console.log(dynamic_instances);

    if (dynamic_instances.invidious.length)
      writeFileSync(
        'dynamic_instances.json',
        JSON.stringify(dynamic_instances, null, 4)
      );
  });
