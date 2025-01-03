export const hlsTest = async (i: string): Promise<string | null> =>
  fetch(`${i}/streams/LuoB1OQvjqk`)
    .then(res => res.json())
    .then(data => {
      if (data.hls)
        return data.hls;
      else throw new Error(data.error);
    })
  .catch(() => '');
