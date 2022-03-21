import {api, wire, LightningElement} from 'lwc';
import {getRecord} from 'lightning/uiRecordApi';
import getPicklistValues from '@salesforce/apex/PicklistController.getPicklistValues';

export default class PathLWC extends LightningElement{
    @api recordId;
    @api objectAPIName;
    @api fieldAPIName;
    @api internalOrComm;

    record;
    //objectAndField;
    picklistValues;
    picklistValuesWithCSS = [];
    fieldValue;

    showPath = false;
    isCommunity = false;
    isInternal = false;

    connectedCallback(){
        // this.objectAndField = this.objectAPIName + '.' + this.fieldAPIName;
        // console.log('objectAndField', this.objectAndField);

        if(this.internalOrComm === 'Community'){
            this.isCommunity = true;
        } else{
            this.isInternal = true;    
        }
    }

    recordObjectEventHandler(event){
        this.record = event.detail;
        this.fieldValue = this.record[this.fieldAPIName].displayValue;
        this.getPicklistValues();

        console.log('record test', JSON.stringify(this.record));
    }

    // @wire(getRecord,{recordId: '$recordId',fields: '$objectAndField'})
    // objRec({error, data}){
    //     console.log('recordId', this.recordId);
    //     console.log('objectAndField', this.objectAndField);
    //     if(data){
    //         this.fieldValue = data.fields[this.fieldAPIName].value;
    //         console.log('fieldValue', this.fieldValue);
    //         this.getPicklistValues();
    //     } else{
    //         console.log('rabble error', error);
    //     }
    // }

    getPicklistValues(){
        if(!this.picklistValues){
            getPicklistValues({
                objectAPIName: this.objectAPIName,
                fieldAPIName: this.fieldAPIName
            })
            .then((result) => {
                this.picklistValues = result;
                console.log(this.picklistValues);
                this.createPicklistValuesWithCSS();
            })
            .catch((error) => {
                console.log('error', error);    
            });
        }
        else{
            this.createPicklistValuesWithCSS();
        }
    }

    createPicklistValuesWithCSS(){
        //creating a new array of picklist value objects with css class values because rendering the path items
        //as nested child components doesn't work properly

        this.showPath = false;
        this.picklistValuesWithCSS = [];

        this.picklistValues.forEach((picklistValue) =>{
            let picklistObj = {
                label: '',
                pathClasses: ''
            };
            picklistObj.label = picklistValue.label;
            if(picklistValue.label === this.fieldValue){
                picklistObj.pathClasses = 'slds-path__item slds-is-active';
            } else{
                picklistObj.pathClasses = 'slds-path__item slds-is-incomplete';
            }

            this.picklistValuesWithCSS.push(picklistObj);
        })

        this.showPath = true;
    }
}