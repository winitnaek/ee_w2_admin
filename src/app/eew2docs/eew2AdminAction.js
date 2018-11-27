import * as types from '../../base/constants/ActionTypes'
import eew2AdminAPI from './eew2AdminAPI';
import {generateAppErrorEvent} from '../../base/utils/AppErrorEvent';
export function loadPeriodicData(eew2data) {
    return {type:types.LOAD_EEW2_DATA,eew2data};
}
export function loadEEW2Records(eew2data) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.geteew2records(eew2data.eew2recordInput).then(eew2ecords => {
            if(eew2ecords.status && eew2ecords.message){
                let arr = [];
                arr.push([]);
                dispatch(loadEEW2RecordsSuccessFailed(arr));
                throw eew2ecords;
            }else{
                if(eew2ecords){
                    eew2data.eew2ecords = eew2ecords;
                   dispatch(loadEEW2RecordsSuccess(eew2data));
                }
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function loadEEW2RecordsSuccess(eew2data) {
    return { type: types.GET_EEW2RECORDS_SUCCESS, eew2data };
}
export function loadEEW2RecordsSuccessFailed(eew2data) {
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
export function testaction(periodicdata) {
    return {type:'TESTACTION', periodicdata};
}