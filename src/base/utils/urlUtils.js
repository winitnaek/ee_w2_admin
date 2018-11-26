const svcpath = '/cfws/';
const apiversion = 'v1';
const apir = 'r/';
const yefws = '/YearEndTaxDocService';
const apiprefix ='/api'
class urlUtils {
  static buildURL(urlin) {
    let url = `${apiprefix}${svcpath}${apir}${apiversion}${yefws}${urlin}`; return url;
  }
}
export default urlUtils;