import { readFileSync, writeFileSync } from 'node:fs';
import { exec } from 'node:child_process';
  
const data = readFileSync('unified_instances.txt', 'utf8').split('\n\n');
Promise
  .all(data.map(fetchAudioUrl))
  .then((list) => list.sort((a, b) => b[1] - a[1]).map(v => v[0]))
  .then((sortedList) => {
    writeFileSync('unified_instances.txt', sortedList.join('\n\n'));
    exec(`
    git add unified_instances.txt;
    git config user.email 'action@github.com';
    git config user.name 'github-actions';
    git commit -m '${diff(data, sortedList)}' || true && git push || true
    `);
  });


async function fetchAudioUrl(instance:string) {
  
  const [name, _, piped, invidious] = instance.split(', ');
  const musicStream = 'k2Fjn90aB0M';
  const nonMusicStream = 'MvsAesQ-4zA';
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

  return [instance, score];
  
}

function diff (textArr1, textArr2) {
  const data = [];
  textArr1.forEach((line:string, index:number) => {
    if (line !== textArr2[index])
      data.push(`${line.split(', ')[0]} ${index} => ${textArr2.indexOf(line)}`);
  });
  return data.join(', ');
}

