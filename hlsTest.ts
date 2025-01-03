export const hlsTest = async (i: string): Promise<string | null> =>
  fetch(`${i}/streams/LuoB1OQvjqk`)
    .then(res => res.json())
    .then(data => {
      console.log(i, `hls: ${Boolean(data.hls)}`)
      if (data.hls)
        return i;
      else throw new Error(data.error);
    })
  .catch(() => '');
