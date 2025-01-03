export const hlsTest = async (i: string): Promise<string | null> =>
  await fetch(`${i}/streams/LuoB1OQvjqk`)
    .then(res => res.json())
    .then(data => {
      if (data.hls)
        return i;
      else throw new Error(data.error);
    })
  .catch(() => '');
