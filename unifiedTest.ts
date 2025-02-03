export async function unifiedTest(i: string, u: string): Promise<string | null> {

  const url = await fetch(`${i}/streams/LuoB1OQvjqk`)
    .then(res => res.json())
    .then(data => {
      console.log(i, `data: ${'audioStreams' in data}, hls: ${Boolean(data.hls)}`)
      if (data.audioStreams.length)
        return data.audioStreams[0].url;
      else throw new Error(data.error);
    })
  .catch(() => '');

  if (!url) return '';

  const curl = new URL(url);
  const origin = curl.origin;
  const unifiedUrl = url.replace(origin, u);

  const passed = await fetch(unifiedUrl)
    .then(res => res.status === 200)
    .catch(() => false);

  return passed ? i : '';

}
