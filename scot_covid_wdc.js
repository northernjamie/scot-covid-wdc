
(function () {
    
    var myConnector = tableau.makeConnector();


    myConnector.getSchema = function (schemaCallback) {

        dataset_uri = tableau.connectionData;
        
        var cols_tableau = [{
        id: "FeatureCode",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "DateCode",
        dataType: tableau.dataTypeEnum.date
    }, {
        id: "Measurement",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "Units",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "Value",
        dataType: tableau.dataTypeEnum.float
    }, {
        id: "Variable",
        dataType: tableau.dataTypeEnum.string
    }];

        var tableSchema = { 
            id: "ScotData",
            alias: "Scottish_data",
            columns: cols_tableau
            }
    	
    schemaCallback([tableSchema]);

	};

    myConnector.getData = function(table, doneCallback) {

    
        var dataset_uri = "https://cors-anywhere.herokuapp.com/https://statistics.gov.scot/downloads/cube-table?uri=http%3A%2F%2Fstatistics.gov.scot%2Fdata%2Fcoronavirus-covid-19-management-information"
        $.ajax({
            method: 'GET',
            dataType: 'text',
            url: dataset_uri,
            success: function(data) {
                
                var tableArray = []
                var array = Papa.parse(data)
                array.data.splice(0,1)
                table.appendRows(array.data);
                doneCallback();
            }
        })
        
        
}; 

    tableau.registerConnector(myConnector);
})();
var cols_tableau = [],
    sparql_chunk = "",
    push_text = [],
    dataset_uri = ""
    

$(document).ready(function () {

    $("#submitButton").click(function () {
        dataset_uri = $('#sel1 option:selected').attr('id');
        tableau.connectionData = dataset_uri;
        tableau.connectionName = "Scot Data";
        tableau.submit();

    });
});