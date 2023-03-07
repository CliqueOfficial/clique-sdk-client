export function getParamsFromUrl(url: string): Record<string, any> {
  if (!url) {
    url = window.location.href;
  }
  const prArrSrr = url.split("?")[1];
  if (!prArrSrr) return {};
  const kvStrArr = prArrSrr.split("&");
  const result = {};
  for (const kvStr of kvStrArr) {
    const ps = kvStr.split("=");
    result[ps[0]] = ps[1];
  }
  return result;
}
