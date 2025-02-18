export const hlsTest = async (i: string): Promise<string | null> =>
  fetch(`${i}/streams/ic8j13piAhQ`)
    .then(res => res.json())
    .then(data => {
      console.log(i, `data: ${'audioStreams' in data}, hls: ${Boolean(data.hls)}`)
      if (data.hls)
        return i;
      else throw new Error(data.error);
    })
  .catch(() => '');
