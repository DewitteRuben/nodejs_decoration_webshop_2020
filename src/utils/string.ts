const imageSizeMap: Record<string, string> = {
  small: "_50x75",
  thumb: "_260x300",
  regular: "_702x500",
  full: ""
};

const parseResizedImages = (urlStrings: string[]) => {
  const keys = Object.keys(imageSizeMap);
  const urls = urlStrings.map((imageURL: string) => new URL(imageURL));
  return urls
    .map((url: URL) =>
      keys.map((key) => {
        const urlString = url.origin + url.pathname + imageSizeMap[key] + url.search;
        const folder = key === "full" ? "" : encodeURIComponent("thumbs/");
        const urlStringWithFilder = urlString.split("/o/").join(`/o/${folder}`);
        return { [key]: urlStringWithFilder };
      })
    )
    .map((parsedUrls) =>
      parsedUrls.reduce((acc, cur) => {
        Object.keys(cur).forEach((key) => {
          acc[key] = cur[key];
        });
        return acc;
      }, {})
    );
};

export { parseResizedImages };

