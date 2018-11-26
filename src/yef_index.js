import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './base/config/configureStore';

import TaxDocsContainer from './app/taxdocs/TaxDocsContainer';

import {taxDocConsentReset,loadTaxDocConsent} from './app/taxdocs/taxdocsAction';

import ViewPDF from './app/taxdocs/ViewPDF';

import * as rname from './base/constants/RenderNames';

import * as manifest from '../build/_manifest';
import * as c from './base/constants/IndexConstants';
import {makeNavs,makeSearch} from './base/template/navGenerator';

let store = configureStore();

let usrobj = JSON.parse(sessionStorage.getItem('up'));

var dataset = usrobj.dataset;
var empId = usrobj.userId;


/**
 * renderYEFApplication TEST
 * master branch
 * @param {*} elem 
 * @param {*} renderName 
 */
function renderYEFApplication(elem, renderName) {
    setAppAnchor(elem);
    
    if (renderName === rname.RN_TAXDOCLIST) {
        store.dispatch(loadTaxDocConsent(dataset, empId)).then((taxDocConsent) => {
            console.log('Year End Tax Doc Consent Loaded.');
            console.log('taxDocConsent');
            console.log(taxDocConsent);
            renderYetiTaxDocList(elem)
        }).catch(error => {
            return error;
        });
    }else if(renderName === rname.RN_TAXDOCSRCH){
        store.dispatch(loadTaxDocConsent(dataset, empId)).then(() => {
            console.log('Year End Tax Doc Consent Search.');
            renderYefTaxDocSearch(elem)
        });
    }
}
/**
 * renderPeriodicAuthTaxTypeTotal
 * @param {*} elem 
 */
function renderYetiTaxDocList(elem){
    $('#searchIdd').val('');
    ReactDOM.render(
        <Provider store={store}>
        <TaxDocsContainer/>
        </Provider>,
       document.querySelector('#'+elem));
}
/**
 * renderPeriodicAuthTaxTypeTotal
 * @param {*} elem 
 */
function renderYefTaxDocSearch(elem){
    let searchQuery = $('#searchIdd').val();
    ReactDOM.render(
        <Provider store={store}>
        <TaxDocsContainer searchQuery={searchQuery} />
        </Provider>,
       document.querySelector('#'+elem));
}

var APP_ANCHOR;
function setAppAnchor(elem){
   APP_ANCHOR = elem;
   ReactDOM.unmountComponentAtNode(document.querySelector('#'+elem));
}
function appAnchor(){
   return APP_ANCHOR;
 }

const resolveTemplates = async () => {
    let response = await fetch('templates.html');
    let templates = await response.text();
    console.debug('templates => ');
    console.debug(templates);
    return templates;
};

const initIndexPage = (templData) => {
    let mnfst = manifest._manifest;
    console.debug('manifest =>', mnfst);

    if (!mnfst) {
        console.error('ERROR: Manifest not found!');
        throw new Error('Manifest not found!');
    }

    if (!mnfst.name || !mnfst.desc) {
        console.error('ERROR: Manifest missing application name and/or application description!');
        throw new Error('Application name and/or application description not found!');
    }
    $('#' + c.appTitleId).html($('#' + c.appTitleId).html() + ' ' + mnfst.desc);
    $('#' + c.appNameId).html($('#' + c.appNameId).html() + ' ' + mnfst.desc);
    checkIfAreasDefined(mnfst.areas);
    let visAreas = getVisibleAreas(mnfst);

    if (visAreas && visAreas.length) {
        let navInput = {
            'areas': visAreas,
            'rf': mnfst.renderFunction,
            'anchorId': c.appContentId
        };
        document.body.insertAdjacentHTML('afterend', templData);
        makeNavs(navInput);
    }
    let search = getSearchData(mnfst);
    if(search){
        let searchInput = {
            'id': search[0].id,
            'renderName': search[0].rendername,
            'entities': search[0].entities,
            'rf': mnfst.renderFunction,
            'anchorId': c.appContentId
        };
        console.log(searchInput);
        makeSearch(searchInput);
    }else{
        //Hide Search Input
    }
};

const getVisibleAreas = (mnfst) => {
    let visibleAreas = mnfst.areas.filter((a) => {
        return a.visible === true;
    });
    console.debug('visible areas =>', visibleAreas);

    if (!visibleAreas || !visibleAreas.length) {
        console.warn('No visible areas specified!');
        $('#noVsblAreasAlrt').removeClass('d-none').show();
    } else {
        $('#noVsblAreasAlrt').removeClass('d-none').hide();
    }

    return visibleAreas;
};

const getSearchData = (mnfst) => {
    console.debug('search data =>', mnfst.search);
    let searchdata = mnfst.search;
    return searchdata;
};

const checkIfAreasDefined = (areas) => {
    if (!areas) {
        console.error('ERROR: At least one area must be defined in manifest!');
        throw new Error('No areas defined in manifest!');
    }
};

const renderWelcomePage = (elem) => {
    document.getElementById(elem).innerHTML = "<h3>Welcome to the Application Module Test Page. Please click on the links to load your single page application.</h3>";
};

const unMountNMountContainerNode = () => {
    $("div").remove("#" + c.appContentId);
    $('<div id="' + c.appContentId + '" class="main-content p-5 m-5"></div>').insertAfter($("#" + c.navId));
};

module.exports = renderYEFApplication;
window.renderYEFApplication = renderYEFApplication;

module.exports = appAnchor;
window.appAnchor = appAnchor;

let yefIndex = {
    'resolveTemplates': resolveTemplates,
    'init': initIndexPage,
    'reloadContent': unMountNMountContainerNode,
    'renderWelcomePage': renderWelcomePage,
    'nameId': c.appNameId,
    'contentId': c.appContentId
};

window.yefIndex = yefIndex;