import * as svcs from '../../base/constants/ServiceUrls';
import URLUtils from '../../base/utils/urlUtils';
import AppError from '../../base/utils/AppError';
import {ADMIN_ERROR_MSG} from '../../base/utils/AppErrorEvent';
class eew2AdminAPI {
  static geteew2records(eew2recordInput) {
    let tt = JSON.stringify(eew2recordInput);
    var svcs_url = `${svcs.GET_EEW2RECORDS}`;
    return fetch(URLUtils.buildURL(svcs_url), {
      method: 'POST',
      body: tt,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    })
      .then(response => {
        if(response.ok){
          return response.json();
        }else{
          var errorCode =  response.status;
          var errorMsg  =  'Unable to get EE W2 Admin Records. '+ADMIN_ERROR_MSG;
          return new AppError(errorMsg, errorCode);
        } 
      })
      .catch(error => {
        return error;
      });
  }
  static getEEW2Pdf(dataset, reqNo, fein, empId) {
    let paramurl = `${'?dataset='}${dataset}${'&ssn='}${empId}${'&fein='}${fein}${'&requestno='}${reqNo}`;
    var svcs_url = `${svcs.GET_EE_W2_PDF_URL}${paramurl}`;
    return fetch(URLUtils.buildURL(svcs_url),{
        credentials: 'same-origin'
    }).then(response => {
        if(response.ok){
          return response.json();
        }else{
          var errorCode =  response.status;
          var errorMsg  =  'Unable to Load Employee W2 Document. '+ADMIN_ERROR_MSG;
          return new AppError(errorMsg, errorCode);
        } 
    }).catch(error => {
      return error;
    });
  }
  static generateOutputs(eew2recordInput) {
    let tt = JSON.stringify(eew2recordInput);
    var svcs_url = `${svcs.POST_GENERATE_OUTPUTS}`;
    return fetch(URLUtils.buildURL(svcs_url), {
      method: 'POST',
      body: tt,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    })
      .then(response => {
        if(response.ok){
          return response.json();
        }else{
          var errorCode =  response.status;
          var errorMsg  =  'Unable to post EE W2 Generate Outputs. '+ADMIN_ERROR_MSG;
          return new AppError(errorMsg, errorCode);
        } 
      })
      .catch(error => {
        return error;
      });
  }
}
export default eew2AdminAPI;