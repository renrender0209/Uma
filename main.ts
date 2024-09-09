import { readFileSync, writeFileSync } from 'node:fs';
import { exec } from 'node:child_process';
import getSearchResults from './search.time.invidious';
import getArtists from './search.artist.piped';

const data = readFileSync('unified_instances.txt', 'utf8').split('\n\n');
  
Promise
  .all(
    data.map(start))
  .then(
    (list) => list
      .sort((a: number[], b: number[]) => b[1] - a[1])
      .map((v: number[]) => v[0]))
  .then(async (sortedList) => {
    const piped_instances = await piped_instances();
    writeFileSync('unified_instances.txt', sortedList.join('\n\n'));
    writeFileSync('piped_instances.txt', piped_instances);
    exec(`
    git add *.txt;
    git config user.email 'action@github.com';
    git config user.name 'github-actions';
    git commit -m '${diff(data, sortedList)}' || true && git push || true
    `);
  });




async function start(instance: string) {

  const [name, _, piped, invidious, hyperpipe] = instance.split(', ');

  const unified = {
    piped: `https://${piped}.${name}`,
    invidious: `https://${invidious}.${name}`,
    hyperpipe: hyperpipe === 'NA' ? 'https://hyperpipeapi.onrender.com':`https://${hyperpipe}.${name}`
  };

  return getSearchResults(unified, 'ASMR', 0)
    .then(score => getArtists(unified, 'Ed Sheeran', score))
    .then(score => [instance, score]);

}


function diff(textArr1: string, textArr2: string) {
  const data: string[] = [];
  for (let i = 0; i < textArr1.length; i++)
    if (textArr1[i] !== textArr2[i])
      data.push(textArr1[i].split(', ')[0] + ((i - textArr2.indexOf(textArr1[i])) > 0 ? ' 🔺' : ' 🔻'));
  return data.join(', ');
}

const s = (i: string) => fetch(i + '/suggestions?query=text')
  .then(res => res.json())
  .then(data => {
    if (data.length)
      return i;
    else throw new Error();
  })
  .catch(() => '');
const allPipedInstancesUrl = 'https://raw.githubusercontent.com/wiki/TeamPiped/Piped/Instances.md';
const piped_instances = () => fetch(allPipedInstancesUrl)
  .then(res => res.text())
  .then(text => text.split('--- | --- | --- | --- | ---')[1])
  .then(table => table.split('\n'))
  .then(instances => instances.map(instance => instance.split(' | ')[1]))
  .then(instances => {
    instances.shift();
    console.log(instances);
    return instances;
  })
  .then(instances => Promise.all(instances.map(s)))
  .then(instances => instances.filter(i => i))
  .then(instances => instances.join('\n'));

