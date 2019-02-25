import * as svcs from '../../base/constants/ServiceUrls';
import URLUtils from '../../base/utils/urlUtils';
import AppError from '../../base/utils/AppError';
import { ADMIN_ERROR_MSG } from '../../base/utils/AppErrorEvent';
import { OUTPUT_MESSAGES, OUTPUT_TURBO_TAX } from '../../base/constants/AppConstants';


class compdataAPI {
    static isCompConfForTurboTaxImport(dataset, compId) {
        let paramurl = `${'?dataset='}${dataset}${'&compid='}${compId}`;
        let svcs_url = `${svcs.GET_IS_COMP_CONF_FOR_TURBO_TAX}${paramurl}`;
        return fetch(URLUtils.buildURL(svcs_url), {
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                var errorCode = response.status;
                var errorMsg = 'Failed while checking if company is configured for TurboTax import! ' + ADMIN_ERROR_MSG;
                throw new AppError(errorMsg, errorCode);
            }
        })
        .then(response => { 
            return response; 
        })
        .catch(error => {
            throw error;
        });
    }
    static getCompanyAuditData(dataset, reqNo, compId, fileType, year) {
        let paramurl = OUTPUT_MESSAGES === fileType 
        ? `${'?dataset='}${dataset}${'&requestno='}${reqNo}` 
        : `${'?dataset='}${dataset}${'&fileType='}${fileType}${'&compid='}${compId}${'&requestno='}${reqNo}`;
        let svcs_url = OUTPUT_MESSAGES === fileType ? `${svcs.GET_MESSAGES_URL}${paramurl}` : `${svcs.GET_COMP_AUDIT_URL}${paramurl}`;

        if (OUTPUT_TURBO_TAX === fileType) {
            paramurl = `${'?dataset='}${dataset}${'&requestno='}${reqNo}${'&compid='}${compId}${'&year='}${year}`;
            svcs_url = `${svcs.GET_TURBO_TAX_OUTPUT}${paramurl}`;
        }

        let fetchOpts = {
            credentials: 'same-origin'
        };

        if (OUTPUT_TURBO_TAX === fileType) {
            let headers = new Headers();
            headers.append('Accept', '*/*');
            fetchOpts.headers = headers;
        }

        return fetch(URLUtils.buildURL(svcs_url), fetchOpts)
        .then(response => {
            if (response.ok) {
                var isFirefox = typeof InstallTrigger !== 'undefined';
                console.log('isFirefox : ' +isFirefox);
                if(isFirefox){
                    console.log('Here 1========>');
                    console.log('response')
                    console.log(response)
                    return OUTPUT_MESSAGES === fileType ? response.json() : new Response(response.body);
                }else{
                    console.log('Here 0========>No FF, Chrome or Edge===>');
                    return OUTPUT_MESSAGES === fileType ? response.json() : response;
                }
               
            } else {
                var errorCode = response.status;
                var errorMsg = 'Failed to get Company Audit Document. ' + ADMIN_ERROR_MSG;
                throw new AppError(errorMsg, errorCode);
            }
        })
        .then(response => { 
            console.log('Here 2========>');
            return OUTPUT_MESSAGES === fileType ? response : response.blob(); 
        })
        .catch(error => {
            throw error;
        });
    }


     

    
}

export default compdataAPI;