import { writeFileSync } from 'node:fs';

const allPipedInstancesUrl = 'https://raw.githubusercontent.com/wiki/TeamPiped/Piped/Instances.md';
const unified_instances = {
  'https://pipedapi.drgns.space'
    : 'https://invidious.drgns.space',

  'https://pipedapi.in.projectsegfau.lt'
    : 'https://inv.in.projectsegfault',

  'https://pipedapi.reallyaweso.me'
    : 'https://invidious.reallyaweso.me',

  'https://api.piped.private.coffee'
    : 'https://invidious.private.coffee',

  'https://api.piped.privacydev.net'
    : 'https://invidious.privacydev.net',

  'https://pipedapi.adminforge.de'
    : 'https://invidious.adminforge.de',

  'https://pipedapi.us.projectsegfau.lt'
    : 'https://inv.us.projectsegfault',

  'https://api.piped.projectsegfau.lt'
    : 'https://invidious.projectsegfault',

  'https://piped-api.lunar.icu'
    : 'https://invidious.lunar.icu',

  'https://piapi.ggtyler.dev'
    : 'https://iv.ggtyler.dev',

  'https://pipedapi.darkness.services'
    : 'https://invidious.darkness.services'
};

async function getSuggestions(i: string) {
  const t = performance.now();
  let array = [0, ''];

  await fetch(i + '/opensearch/suggestions?query=text')
    .then(res => res.json())
    .then(data => {
      const score = 1 / (performance.now() - t);
      if (data.length)
        array = [score, i];
      else throw new Error();
    })
    .catch(() => [0, '']);

  return array;
}

fetch(allPipedInstancesUrl)
  .then(res => res.text())
  .then(text => text.split('--- | --- | --- | --- | ---')[1])
  .then(table => table.split('\n'))
  .then(instances => instances.map(instance => instance.split(' | ')[1]))
  .then(instances => {
    instances.shift();
    const dynamic_instances = {};

    Promise.all(instances.map(getSuggestions))
      .then(array =>
        array
          .sort((a, b) => <number>b[0] - <number>a[0])
          .filter(i => i[0])
          .map(i => i[1])
          .forEach(i => {
            dynamic_instances[i] =
              i in unified_instances ?
                unified_instances[i] : '';

          }))
      .then(() => {
        console.log(dynamic_instances);
        writeFileSync('dynamic_instances.json', JSON.stringify(dynamic_instances, null, 4));
      });
  });


