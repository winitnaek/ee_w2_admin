import * as svcs from '../../base/constants/ServiceUrls';
import URLUtils from '../../base/utils/urlUtils';
import AppError from '../../base/utils/AppError';
import { ADMIN_ERROR_MSG } from '../../base/utils/AppErrorEvent';
import { OUTPUT_MESSAGES } from '../../base/constants/AppConstants';


class compdataAPI {
    static isCompConfForTurboTaxImport(dataset, compId) {
        
    }
    static getCompanyAuditData(dataset, reqNo, compId, fileType) {
        let paramurl = OUTPUT_MESSAGES === fileType 
        ? `${'?dataset='}${dataset}${'&requestno='}${reqNo}` 
        : `${'?dataset='}${dataset}${'&fileType='}${fileType}${'&compid='}${compId}${'&requestno='}${reqNo}`;
        let svcs_url = OUTPUT_MESSAGES === fileType ? `${svcs.GET_MESSAGES_URL}${paramurl}` : `${svcs.GET_COMP_AUDIT_URL}${paramurl}`;
        return fetch(URLUtils.buildURL(svcs_url), {
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return OUTPUT_MESSAGES === fileType ? response.json() : new Response(response.body);
            } else {
                var errorCode = response.status;
                var errorMsg = 'Failed to get Company Audit Document. ' + ADMIN_ERROR_MSG;
                throw new AppError(errorMsg, errorCode);
            }
        })
        .then(response => { 
            return OUTPUT_MESSAGES === fileType ? response : response.blob(); 
        })
        .catch(error => {
            throw error;
        });
    }

    static printjnlp(eew2printInput) {
        let tt = JSON.stringify(eew2printInput);
        var svcs_url = `${svcs.POST_PRINT_JNLP}`;
        return fetch(URLUtils.buildURL(svcs_url), {
          method: 'POST',
          body: tt,
          headers: {
            'Content-Type': 'application/json' ,
           // 'Accept' : 'application/octet-stream' ,
            
             
          },
          credentials: 'same-origin'
        })
          .then(response => {
            if(response.ok){
              return new Response(response.body);
            }else{
              var errorCode =  response.status;
              var errorMsg  =  'Unable to open  jnlp. '+ADMIN_ERROR_MSG;
              return new AppError(errorMsg, errorCode);
            } 
          })
          .then(response =>  response.blob())
          .catch(error => {
            return error;
          });
          
        
      }

      static testjnlp(dataset, printId) {
        let paramurl = `${'?dataset='}${dataset}${'&printIds='}${printId}`;
        var svcs_url = `${svcs.POST_PRINT_JNLP}${paramurl}`;
        return fetch(URLUtils.buildURL(svcs_url), {
            credentials: 'same-origin'
        })
        .then(response => {
            if(response.ok){
                return new Response(response.body);
              }else{
                var errorCode =  response.status;
                var errorMsg  =  'Unable to open  jnlp. '+ADMIN_ERROR_MSG;
                return new AppError(errorMsg, errorCode);
              } 
        })
        .then(response => response.blob())
        
        .catch(error => {
            return error;
        });
    }

    
}

export default compdataAPI;