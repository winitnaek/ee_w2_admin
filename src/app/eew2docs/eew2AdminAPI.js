import * as svcs from '../../base/constants/ServiceUrls';
import URLUtils from '../../base/utils/urlUtils';
import AppError from '../../base/utils/AppError';
import {ADMIN_ERROR_MSG} from '../../base/utils/AppErrorEvent';
class eew2AdminAPI {  static geteew2records(eew2recordInput) {
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
  static getEEW2Pdf(dataset, reqNo, fein, empkey) {
    let paramurl = `${'?dataset='}${dataset}${'&empkey='}${empkey}${'&compId='}${fein}${'&requestno='}${reqNo}`;
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
  static publishUnpublishEEW2Records(eew2recordInput) {
    let tt = JSON.stringify(eew2recordInput);
    var svcs_url = `${svcs.POST_PUBUNPUB_RECORDS}`;
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
          var errorMsg  =  'Unable to Publish or Unpublish EE W2 Records. '+ADMIN_ERROR_MSG;
          return new AppError(errorMsg, errorCode);
        } 
      })
      .catch(error => {
        return error;
      });
  }
  static isOutputGenerationInprogress(dataset) {
    let paramurl = `${'?dataset='}${dataset}`;
    var svcs_url = `${svcs.POST_ISOUTPUT_GEN_INPROGRESS}${paramurl}`;
    
    return fetch(URLUtils.buildURL(svcs_url), {
      method: 'GET',
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
          var errorMsg  =  'Unable to Publish or Unpublish EE W2 Records. '+ADMIN_ERROR_MSG;
          return new AppError(errorMsg, errorCode);
        } 
      })
      .catch(error => {
        return error;
      });
  }
  static getTransmitters(dataset) {
    let paramurl = `${'?dataset='}${dataset}`;
    var svcs_url = `${svcs.GET_TRANSMITTER}${paramurl}`;
    
    return fetch(URLUtils.buildURL(svcs_url), {
      method: 'GET',
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
          var errorMsg  =  'Unable to Get Transmitters. '+ADMIN_ERROR_MSG;
          return new AppError(errorMsg, errorCode);
        } 
      })
      .catch(error => {
        return error;
      });
  }
  static getCompaniesByTransmitter(dataset,tfein) {
    let paramurl = `${'?dataset='}${dataset}${'&transmitterId='}${tfein}`;
    var svcs_url = `${svcs.GET_COMPANY_BY_TRANSMITTER}${paramurl}`;
    
    return fetch(URLUtils.buildURL(svcs_url), {
      method: 'GET',
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
          var errorMsg  =  'Unable to Get Companies By Transmitter. '+ADMIN_ERROR_MSG;
          return new AppError(errorMsg, errorCode);
        } 
      })
      .catch(error => {
        return error;
      });
  }
  static getEmployees(eew2empInput) {
    let tt = JSON.stringify(eew2empInput);
    var svcs_url = `${svcs.POST_EMPLOYEES}`;
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
          var errorMsg  =  'Unable to Get Employees. '+ADMIN_ERROR_MSG;
          return new AppError(errorMsg, errorCode);
        } 
      })
      .catch(error => {
        return error;
      });
  }
}
export default eew2AdminAPI;