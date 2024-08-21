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

async function fetchAudioUrl(instance: string) {

  const [name, _, piped, invidious, hyperpipe] = instance.split(', ');
  const stream = 'k2Fjn90aB0M';
  const stream2 = 'MvsAesQ-4zA';
  const pipedInstance = `https://${piped}.${name}`;
  const invidiousInstance = `https://${invidious}.${name}`;
  const hyperpipeInstance = `https://${hyperpipe}.${name}`;
  const f = performance.now();
  let score = 0;

  await fetch(`${invidiousInstance}/api/v1/videos/${stream}`)
    .then(res => res.json())
    .then(async data => {
      if ('adaptiveFormats' in data) {
        score += (1 / (performance.now() - f));
        const audioUrl = data.adaptiveFormats.filter(f => f.type.startsWith('audio')).sort((a, b) => a.bitrate - b.bitrate)[0].url;
        const proxiedUrl = audioUrl.replace(new URL(audioUrl).origin, invidiousInstance);
        const t = performance.now();

        await fetch(proxiedUrl)
          .then(_ => _.blob())
          .then(blob => {
            if (blob.type.startsWith('audio')) {
              console.log('\n✅ loaded stream on ' + invidiousInstance);
              score += (1 / (performance.now() - t));
            }
            else throw new Error();
          })
          .catch(() => {
            console.log('\n❌ failed to load stream on ' + invidiousInstance);
          });

        await fetch(hyperpipeInstance + data.authorUrl)
          .then(res => res.json())
          .then(data => {
            console.log('\n✅ loaded music artist on ' + hyperpipeInstance);
            if ('playlistId' in data) score += 0.5;
          })
          .catch(() => {
            console.log('\n❌ failed to load music artist on ' + hyperpipeInstance);
          });
      }
      else throw new Error();

    })
    .catch(() => {
      console.log(`\n❌ failed to fetch stream data on ${invidiousInstance}`);
    });

  const g = performance.now();

  await fetch(`${pipedInstance}/streams/${stream}`)
    .then(res => res.json())
    .then(async data => {
      if ('audioStreams' in data) {
        score += (1 / (performance.now() - g));
        const audioUrl = data.audioStreams.filter(f => f.mimeType.startsWith('audio')).sort((a, b) => a.bitrate - b.bitrate)[0].url;
        const proxiedUrl = audioUrl.replace(new URL(audioUrl).origin, pipedInstance);
        const t = performance.now();

        await fetch(proxiedUrl)
          .then(_ => _.blob())
          .then(blob => {
            if (blob.type.startsWith('audio')) {
              console.log('\n✅ loaded stream on ' + pipedInstance);
              score += (1 / (performance.now() - t));
            }
            else throw new Error();
          })
          .catch(() => {
            console.log('\n❌ failed to load stream on ' + pipedInstance);
          });
        await fetch(hyperpipeInstance + data.uploaderUrl)
          .then(res => res.json())
          .then(data => {
            console.log('\n✅ loaded music artist on ' + hyperpipeInstance);
            if ('playlistId' in data) score += 0.5;
          })
          .catch(() => {
            console.log('\n❌ failed to load music artist on ' + name);
          });
      }
      else throw new Error();

    })
    .catch(() => {
      console.log(`\n❌ failed to fetch stream data on ${pipedInstance}`);
    });


  const h = performance.now();

  await fetch(`${pipedInstance}/streams/${stream2}`)
    .then(res => res.json())
    .then(async data => {
      if ('audioStreams' in data) {
        score += (1 / (performance.now() - h));
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
              console.log('\n✅ loaded deproxified stream2 on ' + pipedInstance);
              score += (1 / (performance.now() - t));
            }
            else throw new Error();
          })
          .catch(() => {
            console.log('\n❌ failed to load deproxified stream2 on ' + pipedInstance);
          });
      }
      else throw new Error();
    })
    .catch(() => {
      console.log(`\n❌ failed to fetch stream2 data on ${pipedInstance}`);
    });


  const k = performance.now();

  await fetch(`${invidiousInstance}/api/v1/videos/${stream2}`)
    .then(res => res.json())
    .then(async data => {
      if ('adaptiveFormats' in data) {
        score += (1 / (performance.now() - k));
        const audioUrl = data.adaptiveFormats.filter(f => f.type.startsWith('audio')).sort((a, b) => a.bitrate - b.bitrate)[0].url;
        const t = performance.now();

        await fetch(audioUrl)
          .then(_ => _.blob())
          .then(blob => {
            if (blob.type.startsWith('audio')) {
              console.log('\n✅ loaded stream2 on ' + invidiousInstance);
              score += (1 / (performance.now() - t));
            }
            else throw new Error();
          })
          .catch(() => {
            console.log('\n❌ failed to load stream2 on ' + invidiousInstance);
          });

      }
      else throw new Error();

    })
    .catch(() => {
      console.log(`\n❌ failed to fetch stream2 data on ${invidiousInstance}`);
    });


  return [instance, score];

}


function diff (textArr1, textArr2) {
  const data = [];
  for(let i = 0; i < textArr1.length; i++)
    if (textArr1[i] !== textArr2[i])
      data.push(textArr1[i].split(', ')[0] + ((i - textArr2.indexOf(textArr1[i])) > 0 ? ' 🔺' : ' 🔻'));
  return data.join(', ');
}

