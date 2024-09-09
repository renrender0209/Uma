import getPlaylist from "./playlist.piped";

export default async function getPlaylistFromArtist(
  unified: Record<'piped' | 'invidious' | 'hyperpipe', string>,
  authorUrl: string,
  score: number
) {
  const instance = unified.hyperpipe || 'https://hyperpipeapi.onrender.com';
  const t = performance.now();


  await fetch(instance + authorUrl)
    .then(res => res.json())
    .then(async data => {
      if ('playlistId' in data) {
        console.log('\n✅ loaded music artist on ' + instance);

        score += (1 / (performance.now() - t));

        score = await getPlaylist(unified, data.playlistId, score);
      }
    })
    .catch(() => {
      console.log('\n❌ failed to load music artist on ' + instance);
    });

  return score;
}
