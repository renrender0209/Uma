export async function loadTest(i: string): Promise<string | null> {
  
  const url = await fetch(`${i}/api/v1/videos/LuoB1OQvjqk`)
    .then(res => res.json())
    .then(data => {
      if (data && 'adaptiveFormats' in data)
        return data;
      else throw new Error(data.error);
    })
    .then(
      (data: {
        adaptiveFormats: {
          url: string,
          type: string
        }[]
      }) => (data.adaptiveFormats
        .filter((f) => f.type.startsWith('audio'))
      [0].url)
    );

  if (!url) return '';

  const curl = new URL(url);
  const origin = curl.origin;
  const proxiedUrl = url.replace(origin, i) + '&host=' + origin.slice(8);

  const passed = await fetch(proxiedUrl)
    .then(res => res.ok);

  return passed ? i : '';

}
