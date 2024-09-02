

export default async function get_and_load_stream(
  unified: Record<'piped' | 'invidious' | 'hyperpipe', string>,
  stream: string,
  score: number
) {
  const instance = unified.invidious;
  const t = performance.now();

  await fetch(`${instance}/api/v1/videos/${stream}`)
    .then(res => res.json())
    .then(async data => {
      if ('adaptiveFormats' in data) {
        score += (2 / (performance.now() - t));

        const audioUrl = data.adaptiveFormats
          .filter((
            f: { type: string }
          ) => f.type.startsWith('audio'))
          .sort((
            a: { bitrate: number },
            b: { bitrate: number }
          ) => a.bitrate - b.bitrate)
        [0].url;

        const proxiedUrl = audioUrl.replace(new URL(audioUrl).origin, instance);

        score = await checkAudioBlob(
          data.genre === 'music' ? proxiedUrl : audioUrl
          , instance, score
        );

      }
      else throw new Error();

    })
    .catch(() => {
      console.log(`\n❌ failed to fetch stream data on ${instance}`);
    });

  return score;
}


async function checkAudioBlob(
  url: string,
  instance: string,
  score: number
) {
  const t = performance.now();

  await fetch(url)
    .then(_ => _.blob())
    .then(blob => {
      if (blob.type.startsWith('audio')) {
        console.log('\n✅ loaded blob on ' + instance);
        score += (2 / (performance.now() - t));
      }
      else throw new Error();
    })
    .catch(() => {
      console.log('\n❌ failed to load blob on ' + instance);
    });

  return score;

}
