import get_and_load_stream from "./stream.invidious";

export default async function getSearchResults(
  unified: Record<'piped' | 'invidious' | 'hyperpipe', string>,
  query: string,
  score: number
) {
  const instance = unified.invidious;
  const t = performance.now();

  await fetch(`${instance}/api/v1/search?q=${query}&sort=date`)
    .then(res => res.json())
    .then(async items => {
      if (items?.length) {
        score += (1 / (performance.now() - t));

        const stream = items[0].videoId;

        score = await get_and_load_stream(unified, stream, score);
      }
      else throw new Error();
    })
    .catch(() => {
      console.log(`\n❌ failed to get sorted search results on ${instance}`);
    });

  return score;
}
