import { readFileSync, writeFileSync } from 'node:fs';
import { exec } from 'node:child_process';

const musicStream = 'k2Fjn90aB0M';
const nonMusicStream = 'MvsAesQ-4zA';
const data = readFileSync('unified_instances.txt', 'utf8').split('\n\n');
const newData: { [index: string]: number } = {};

setImmediate(async () => {
  for await (const v of data) {
    const [name, _, piped, invidious] = v.split(', ');
    const score = await fetchAudioUrl(name, piped, invidious);
    newData[v] = score;
  }
  const sortedList = Object.entries(newData).sort((a, b) => b[1] - a[1]).map(v => v[0])

  writeFileSync('unified_instances.txt', sortedList.join('\n\n'));

  exec(`export COMMIT_MESSAGE="${diff(data, newData)}"`);
  
});


async function fetchAudioUrl(name: string, piped: string, invidious: string) {

  const pipedInstance = `https://${piped}.${name}`;
  const invidiousInstance = `https://${invidious}.${name}`;
  const f = performance.now();
  let score = 0;

  await fetch(`${pipedInstance}/streams/${musicStream}`)
    .then(res => res.json())
    .then(async data => {
      if ('audioStreams' in data) {
        score += (1 / (performance.now() - f));
        const audioUrl = data.audioStreams[0].url;
        const proxiedUrl = audioUrl.replace(new URL(audioUrl).origin, invidiousInstance);
        const t = performance.now();

        await fetch(proxiedUrl)
          .then(data => data.blob())
          .then(blob => {
            if (blob.type.startsWith('audio')) {
              console.log('\n✅ loaded music stream on ' + name);
              score += (1 / (performance.now() - t));
            }
            else throw new Error();
          })
          .catch(() => {
            console.log('\n❌ failed to load music stream on ' + name);
          });
      }
      else throw new Error();
    })
    .catch(() => {
      console.log(`\n❌ failed to fetch music stream data on ${name}`);
    });

  await fetch(`${pipedInstance}/streams/${nonMusicStream}`)
    .then(res => res.json())
    .then(async data => {
      if ('audioStreams' in data) {
        score++;
        const audioUrl = data.audioStreams[0].url;
        const construct = new URL(audioUrl);
        const deproxiedUrl = audioUrl.replace(
          construct.host,
          construct.searchParams.get('host'));
        const t = performance.now();
        
        await fetch(deproxiedUrl)
          .then(data => data.blob())
          .then(blob => {
            if (blob.type.startsWith('audio')) {
              console.log('\n✅ loaded deproxified non-music stream on ' + name);
              score += (1 / (performance.now() - t));
            }
            else throw new Error();
          })
          .catch(() => {
            console.log('\n❌ failed to load deproxified non-music stream on ' + name);
          });
      }
      else throw new Error();
    })
    .catch(() => {
      console.log(`\n❌ failed to fetch non-music stream data on ${name}`);
    });

  return score;

}

function diff (textArr1, textArr2) {
  const data = textArr1.map((line:string,index:number)=>{
    if (line !== textArr2[index])
      return `${line}=>${textArr2[index]}`;
  });
  return JSON.stringify(data,null,2);
}

