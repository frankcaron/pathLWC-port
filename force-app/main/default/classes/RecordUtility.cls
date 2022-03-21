public class RecordUtility{
    @AuraEnabled(cacheable=true)
    public static List<sObject> getRecords(String soqlQuery){
        try{
            return Database.query(soqlQuery);
        } catch(System.QueryException error){
            System.debug('RecordUtility-getRecords Error:' + error);
            return null;
        }
    }
}