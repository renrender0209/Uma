export async function hlsTest(i: string): Promise<string | null> {
  
  const hls = await fetch(`${i}/streams/LuoB1OQvjqk`)
    .then(res => res.json())
    .then(data => {
      if (data && 'hls' in data)
        return data.hls;
      else throw new Error(data.error);
    })
  .catch(() => '');

  return hls ? i : '';

}
