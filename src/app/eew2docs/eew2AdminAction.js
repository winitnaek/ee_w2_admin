import * as types from '../../base/constants/ActionTypes'
import eew2AdminAPI from './eew2AdminAPI';
import {generateAppErrorEvent} from '../../base/utils/AppErrorEvent';
export function loadPeriodicData(eew2data) {
    return function (dispatch, getState) {
        const state = getState();
        dispatch(loadInitData(eew2data));
        dispatch(isOutputGenerationSuccess(false));
    }
}
export function loadInitData(eew2data) {
    return {type:types.LOAD_EEW2_DATA,eew2data};
}
export function loadCompData(compdata) {
    return {type:types.LOAD_COMP_DATA,compdata};
}
export function loadPdfData(w2data){
    return {type:types.LOAD_PDF_DATA,w2data};
}
/**
 * Merely dispatches "SUCCESS" to proceed and delegate actual data fetching to the jqxGrid component!
 * 
 * @param {*} eew2data 
 */
export function loadEEW2Records(eew2data) {
    return function (dispatch, getState) {
        dispatch(loadEEW2RecordsSuccess(eew2data));
    };
}
export function loadEEW2RecordsSuccess(eew2data) {
    return { type: types.GET_EEW2RECORDS_SUCCESS, eew2data };
}
export function loadEEW2RecordsFailed(eew2data) {
    return { type: types.GET_EEW2RECORDS_ERROR, eew2data };
}
export function getEEW2Pdf(dataset, reqNo, fein, empId) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.getEEW2Pdf(dataset, reqNo, fein, empId).then(eew2pdf => {
            if(eew2pdf){
                if(eew2pdf && eew2pdf.docData){
                    dispatch(getEEW2PdfSuccess(eew2pdf));
                }else if(eew2pdf && eew2pdf.message){
                    dispatch(getEEW2PdfError(eew2pdf));
                }
            }else{
                throw eew2pdf;
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function getEEW2PdfSuccess(eew2pdf) {
    return { type: types.GET_EEW2PDF_SUCCESS, eew2pdf };
}
export function getEEW2PdfError(eew2pdf) {
    return { type: types.GET_EEW2PDF_ERROR, eew2pdf };
}
export function generateOutputs(eew2recordInput) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.generateOutputs(eew2recordInput).then(eew2ecords => {
            if(eew2ecords.status && eew2ecords.message){
                let arr = [];
                arr.push([]);
                dispatch(generateOutputsFailed(arr));
                throw eew2ecords;
            }else{
                if(eew2ecords){
                   dispatch(generateOutputsSuccess(eew2ecords));
                }
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function generateOutputsSuccess(eew2ecords) {
    return { type: types.POST_GENERATE_OUTPUTS_SUCCESS, eew2ecords };
}
export function generateOutputsFailed(eew2ecords) {
    return { type: types.POST_GENERATE_OUTPUTS_ERROR, eew2ecords };
}
export function publishUnpublishEEW2Records(eew2recordInput) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.publishUnpublishEEW2Records(eew2recordInput).then(pubunpubcnt => {
            if(pubunpubcnt.status && pubunpubcnt.message){
                dispatch(publishUnpublishEEW2Failed(0));
                throw pubunpubcnt;
            }else{
                //if(pubunpubcnt){
                   dispatch(publishUnpublishEEW2Success(pubunpubcnt));
                //}
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function publishUnpublishEEW2Success(pubunpubcnt) {
    return { type: types.POST_PUBUNPUB_OUTPUTS_SUCCESS, pubunpubcnt };
}
export function publishUnpublishEEW2Failed(pubunpubcnt) {
    return { type: types.POST_PUBUNPUB_OUTPUTS_ERROR, pubunpubcnt };
}
export function isOutputGenerationInprogress(dataset) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.isOutputGenerationInprogress(dataset).then(outputgeninprogress => {
            if(outputgeninprogress.status && outputgeninprogress.message){
                let arr = {"status" :outputgeninprogress.status, "message":outputgeninprogress.message};
                dispatch(isOutputGenerationFailed(arr));
                //throw outputgeninprogress;
            }else{
                if(outputgeninprogress){
                   dispatch(isOutputGenerationSuccess(outputgeninprogress));
                }
            }
        }).catch(error => {
            return error;
            //generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function isOutputGenerationSuccess(outputgeninprogress) {
    return { type: types.POST_OUTPUTGEN_INPROGRESS_SUCCESS, outputgeninprogress };
}
export function isOutputGenerationFailed(outputgeninprogress) {
    return { type: types.POST_OUTPUTGEN_INPROGRESS_ERROR, outputgeninprogress };
}
export function isPrintGenerationInprogress(dataset,printid) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.isPrintGenerationInprogress(dataset,printid).then(printinprogress => {
            if(printinprogress.status && printinprogress.message){
                let arr = {"status" :printinprogress.status, "message":printinprogress.message};
                dispatch(isPrintGenerationFailed(arr));
                //throw printinprogress;
            }else{
                if(printinprogress){
                   dispatch(isPrintGenerationSuccess(printinprogress));
                }
            }
        }).catch(error => {
            return error;
            //generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function isPrintGenerationSuccess(printinprogress) {
    return { type: types.GET_PRINT_INPROGRESS_SUCCESS, printinprogress };
}
export function isPrintGenerationFailed(printinprogress) {
    return { type: types.GET_PRINT_INPROGRESS_ERROR, printinprogress };
}
export function getTransmitters(dataset) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.getTransmitters(dataset).then(transmitters => {
            if(transmitters.status && transmitters.message){
                let arr = [];
                arr.push([]);
                dispatch(getTransmittersFailed(arr));
                throw transmitters;
            }else{
                if(transmitters){
                   dispatch(getTransmittersSuccess(transmitters));
                }
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function getTransmittersSuccess(transmitters) {
    return { type: types.GET_TRANSMITTER_SUCCESS, transmitters };
}
export function getTransmittersFailed(transmitters) {
    return { type: types.GET_TRANSMITTER_ERROR, transmitters };
}
export function getCompaniesByTransmitter(dataset,tfein) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.getCompaniesByTransmitter(dataset,tfein).then(tcompanies => {
            if(tcompanies.status && tcompanies.message){
                let arr = [];
                arr.push([]);
                dispatch(getCompaniesByTransmitterFailed(arr));
                throw tcompanies;
            }else{
                if(tcompanies){
                   dispatch(getCompaniesByTransmitterSuccess(tcompanies));
                }
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function getCompaniesByTransmitterSuccess(tcompanies) {
    return { type: types.GET_COMP_BY_TRANSMITTER_SUCCESS, tcompanies };
}
export function getCompaniesByTransmitterFailed(tcompanies) {
    return { type: types.GET_COMP_BY_TRANSMITTER_ERROR, tcompanies };
}
export function getEmployees(eedata) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.getEmployees(eedata).then(cemployees => {
            if(cemployees.status && cemployees.message){
                let arr = [];
                arr.push([]);
                dispatch(getEmployeesFailed(arr));
                throw cemployees;
            }else{
                if(cemployees){
                   dispatch(getEmployeesSuccess(cemployees));
                }
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function getEmployeesSuccess(cemployees) {
    return { type: types.GET_EMPLOYEES_SUCCESS, cemployees };
}
export function getEmployeesFailed(cemployees) {
    return { type: types.GET_EMPLOYEES_ERROR, cemployees };
}



export function stageRecsToPrint(w2PrintRequestInput ) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.stageRecordsToPrint(w2PrintRequestInput).then(printIdMap => {
            if(printIdMap.status && printIdMap.message){
                dispatch(stageRecsToPrintFailed(0));
                throw printIdMap;
            }else{
                if(printIdMap){
                   dispatch(stageRecsToPrintSuccess(printIdMap));
               }
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function stageRecsToPrintSuccess(printIdMap) {
    return { type: types.POST_STAGE_PRINT_SUCCESS, printIdMap };
}
export function stageRecsToPrintFailed(printIdMap) {
    return { type: types.POST_STAGE_PRINT_ERROR, printIdMap };
}

export function getRecsToPrintCount(w2PrintRequestInput ) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.getRecsToPrintCount(w2PrintRequestInput).then(w2selected => {
            if(w2selected.status && w2selected.message){
                dispatch(getRecsToPrintCountFailed(0));
                throw w2selected;
            }else{
               // if(w2selected){
                   dispatch(getRecsToPrintCountSuccess(w2selected));
              // }
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function getRecsToPrintCountSuccess(w2selected) {
    return { type: types.POST_STAGE_PRINT_SUCCESS, w2selected };
}
export function getRecsToPrintCountFailed(w2selected) {
    return { type: types.POST_STAGE_PRINT_ERROR, w2selected };
}