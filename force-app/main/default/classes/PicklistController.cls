public with sharing class PicklistController{
    @AuraEnabled(cacheable=true)
    public static List<PickListValueWrapper> getPicklistValues(String objectAPIName, String fieldAPIName){
        SObjectType sOT = ((SObject)(Type.forName('Schema.' + objectAPIName).newInstance())).getSObjectType();
        SObjectField field = sOT.getDescribe().fields.getMap().get(fieldAPIName);
        if(field != null){
            Schema.DescribeFieldResult fieldDetails = field.getDescribe();

            String fieldType = String.valueOf(fieldDetails.getType());

            if(fieldType == 'PICKLIST' || fieldType == 'MULTIPICKLIST'){
                List<PickListValueWrapper> picklistValues = new List<PickListValueWrapper>();

                List<Schema.PicklistEntry> piclistEntries = fieldDetails.getPicklistValues();
                for(Schema.PicklistEntry picklistEntry : piclistEntries){
                    PickListValueWrapper plWrapper = new PickListValueWrapper();
                    plWrapper.label = picklistEntry.getLabel();
                    plWrapper.value = picklistEntry.getValue();
                    picklistValues.add(plWrapper);
                } 

                return picklistValues;
            }

            return null;
        }
        
        return null; 
    }

    public class PickListValueWrapper{
        @AuraEnabled
        public String label{get;set;}

        @AuraEnabled
        public String value{get;set;}
    }
}