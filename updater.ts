import { writeFileSync, readFileSync } from 'fs';
import { loadTest } from './loadTest';
import { hlsTest } from './hlsTest';
import { gethp } from './hyperpipe';

const piped_instances = 'https://raw.githubusercontent.com/wiki/TeamPiped/Piped/Instances.md';
const invidious_instances = JSON.parse(readFileSync('./invidious.json', 'utf8'));
const di: {
  piped: string[];
  invidious: string[];
  hyperpipe: string;
} = {
  piped: [],
  invidious: [],
  hyperpipe: '',
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

const getInstances = async (instanceArray: string[]): Promise<string[]> => Promise.all(instanceArray.map(getSuggestions)).then(array =>
  array
    .sort((a, b) => <number>b[0] - <number>a[0])
    .filter((i) => i[0])
    .map(i => i[1] as string)
);

fetch(piped_instances)
  .then(r => r.text())
  .then(t => t.split('--- | --- | --- | --- | ---')[1])
  .then(t => t.split('\n'))
  .then(i => i.map(_ => _.split(' | ')[1]))
  .then(async instances => {
    instances.shift();

    const pi = await getInstances(instances);
    (await Promise.all(pi.map(hlsTest)))
      .filter(h => h)
      .forEach(i => {
        di.piped.push(i);
      });

    const iv = await getInstances(invidious_instances);
    (await Promise.all(iv.map(loadTest)))
      .filter(p => p)
      .forEach(i => {
        di.invidious.push(i)
      });
    
    di.hyperpipe = await gethp();
    
    console.log(di);

    if (di.piped.length < 3)
      di.piped = pi;
    
    if (!di.invidious.length)
      di.invidious.push(iv[0]);

    writeFileSync(
      'dynamic_instances.json',
      JSON.stringify(di, null, 4)
    );
  });
