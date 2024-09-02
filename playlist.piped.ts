import get_and_load_stream from "./stream.invidious";

export default async function getPlaylist(
  unified: Record<'piped' | 'invidious' | 'hyperpipe', string>,
  playlist: string,
  score: number
) {
  const instance = unified.piped;
  const t = performance.now();

  await fetch(instance + playlist)
    .then(res => res.json())
    .then(async data => {

      if (data?.relatedStreams?.length) {
        console.log('\n✅ loaded playlist on ' + instance);

        score += (1 / (performance.now() - t));

        const stream = data.relatedStreams[0].url.substring(9);

        score = await get_and_load_stream(unified, stream, score);

      }
      else throw new Error();

    })
    .catch(() => {
      console.log(`\n❌ failed to get playlist on ${instance}`);
    })

  return score;
}
