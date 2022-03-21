import {api, wire, LightningElement} from 'lwc';
import {getRecord} from 'lightning/uiRecordApi';
import getRecords from '@salesforce/apex/RecordUtility.getRecords';

export default class GetRecord extends LightningElement{
    @api recordId;
    @api objectAPIName;
    @api fieldAPINames;

    objectAndFields = [];

    soqlQuery = 'SELECT Id, Name FROM Account LIMIT 10';

    record;
    records;

    @wire(getRecord, {recordId: '$recordId',fields: '$objectAndFields'})
    objRec({error, data}){
        if(data && data.fields){
            this.record = data.fields;
            this.sendRecordObjectEvent();

            // console.log(this.record);
            // console.log(this.record['Name'].value);
        } else{
            console.log('rabble error', error);
        }
    }

    @wire(getRecords, {soqlQuery: '$soqlQuery'})
    getRecords({error, data}){
        if(data){
            this.records = data;
            console.log('soql records', this.records);
            // console.log('soql record 1 name: ' + this.records[0]['Name']);
        } else{
            console.log('rabble error', error);
        }
    }

    connectedCallback(){
        this.createFieldArrayforWire();   
    }

    createFieldArrayforWire(){
        if(this.fieldAPINames){
            if(this.fieldAPINames.includes(';')){
                let fieldAPIArray = this.fieldAPINames.split(";");
                fieldAPIArray.forEach((fieldAPIName) =>{
                    this.objectAndFields.push(this.objectAPIName + '.' + fieldAPIName);
                })
            } else{
                this.objectAndFields = this.objectAPIName + '.' + this.fieldAPINames;
            }
        }
    }

    sendRecordObjectEvent(){
        const recordObjectEvent = new CustomEvent('recordobjectevent', {
            detail: this.record,
            bubbles: false,
            composed: false
        });
        this.dispatchEvent(recordObjectEvent);
    }
}