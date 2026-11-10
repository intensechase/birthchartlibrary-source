// Derive an Amazon cover-image URL from a book's affiliate /dp/{ASIN} link.
// Book ASINs are ISBN-10s, and Amazon serves covers by ASIN at this endpoint.
// Returns null if no ASIN can be parsed; callers should hide the <img> onError
// so a missing cover degrades to a text-only card rather than a broken image.
export function bookCoverUrl(amazonUrl: string): string | null {
  const asin = amazonUrl.match(/\/dp\/([A-Z0-9]+)/i)?.[1]
  return asin ? `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg` : null
}
