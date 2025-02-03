export async function unifiedTest(i: string, u: string): Promise<string | null> {

  const url = await fetch(`${i}/streams/4JZ-o3iAJv4`)
    .then(res => res.json())
    .then(data => {
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
  
  if (passed)
    console.log('unified: ' + unifiedUrl);
  
  return passed ? i : '';

}
