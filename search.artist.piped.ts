import getPlaylistFromArtist from "./artist.hyperpipe";

export default async function getArtists(
  unified: Record<'piped' | 'invidious' | 'hyperpipe', string>,
  query: string,
  score: number
) {
  const instance = unified.piped;
  const t = performance.now();

  await fetch(`${instance}/search?q=${query}&filter=music_artists`)
    .then(res => res.json())
    .then(async searchResults => {

      if (searchResults?.items?.length) {
        score += (1 / (performance.now() - t));

        const channelUrl = searchResults.items[0].url;

        score = await getPlaylistFromArtist(unified, channelUrl, score);

      }
      else throw new Error();
    })
    .catch(() => {
      console.log(`\n❌ failed to get music artists on ${instance}`);
    })

  return score;
}
