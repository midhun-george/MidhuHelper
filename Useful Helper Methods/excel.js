let selectedFile;
console.log(window.XLSX);
document.getElementById('input').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
})

let data=[{
    "name":"jayanth",
    "data":"scd",
    "abc":"sdef"
}]
onLoad();
function onLoad(){
    var helper = localStorage.getItem("helpers");
    var helperMethod = JSON.parse(helper);
    helperMethod = helperMethod.sort((a,b) => (a.Task > b.Task) ? 1 : ((b.Task > a.Task) ? -1 : 0));
    var nus = $("#grid").jqGrid('getGridParam', 'reccount');
              var colModel = [{
                name: 'ID',
                index: 'ID',
                editable: false,
                label:"Date",
                hidden:true
            }, {
                name: 'Task',
                index: 'Task',
                label:"Task",
                width: '200px',
            },
            {
                name: 'Solution',
                index: 'Solution',
                label:"Solution" ,
                width: '600px',
            },
            {
                name: 'View',
                label: 'Action',
                width: '250px',
                search: false,
                "resizable": false,
                sortable: false,
                formatter: buttonFormatter
            }
        ]
        if(nus!=null){
            $('#grid').jqGrid("clearGridData");
            jQuery("#grid")
                .jqGrid('setGridParam', {
                    datatype: 'local',
                    data: helperMethod
                })
                .trigger("reloadGrid");
            
        }else{
            createGrid("grid",colModel,helperMethod,10)
        }
}

document.getElementById('button').addEventListener("click", () => {
    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    
    if(selectedFile){
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event)=>{
         let data = event.target.result;
         let workbook = XLSX.read(data,{type:"binary"});
         console.log(workbook);
         workbook.SheetNames.forEach(sheet => {
              let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
              console.log(rowObject);
              localStorage.removeItem("helpers")
              localStorage.setItem("helpers",JSON.stringify(rowObject));
              //document.getElementById("jsondata").innerHTML = JSON.stringify(rowObject,undefined,4)
              var sorted = rowObject.sort((a,b) => (a.Task > b.Task) ? 1 : ((b.Task > a.Task) ? -1 : 0));
              var nus = $("#grid").jqGrid('getGridParam', 'reccount');
              var colModel = [{
                name: 'ID',
                index: 'ID',
                editable: false,
                label:"Date",
                hidden:true
            }, {
                name: 'Task',
                index: 'Task',
                label:"Task",
                width: '200px',
            },
            {
                name: 'Solution',
                index: 'Solution',
                label:"Solution" ,
                width: '600px',
            },
            {
                name: 'View',
                label: 'Action',
                width: '250px',
                search: false,
                "resizable": false,
                sortable: false,
                formatter: buttonFormatter
            }
        ]
        if(nus!=null){
            $('#grid').jqGrid("clearGridData");
            jQuery("#grid")
                .jqGrid('setGridParam', {
                    datatype: 'local',
                    data: sorted
                })
                .trigger("reloadGrid");
            
        }else{
            createGrid("grid",colModel,sorted,10)
        }
        
         });
        }
    }

});


function createGrid(div, cols, data, no_items){
	var number_per_pages = no_items?no_items:5;
	$("#"+div).jqGrid({
        colModel: cols,
        data: data,
        iconSet: "fontAwesome",
        idPrefix: "g5_",
        rownumbers: false,
        sortname: "invdate",
        sortorder: "desc",
        threeStateSort: false,
        sortIconsBeforeText: true,
        headertitles: true,
        toppager: false,
        loadonce: false,
        pager: true,
        rowNum: number_per_pages,
        hidegrid: false,
        viewrecords: true,
        shrinkToFit: false,
        autowidth: false,
        autosearch: true,
        searchOnEnter: false,
        loadComplete: setWidth,
        searching: {
            defaultSearch: "cn"
        },
        
        cmTemplate: {
            firstsortorder: "desc"
        },
		gridComplete: function () {
			
		},
        onSortCol: function(index, idxcol, sortorder) {
            if (this.p.lastsort >= 0 && this.p.lastsort !== idxcol &&
                this.p.colModel[this.p.lastsort].sortable !== false) {
                // show the icons of last sorted column
                $(this.grid.headers[this.p.lastsort].el)
                    .find(">div.ui-jqgrid-sortable>span.s-ico").show();
                    
            }
            showSortIcons(div);
        }
        //caption: caption
    }).jqGrid("filterToolbar", {
        searchOnEnter: false,
        afterSearch: function () {
        	pageChange();
        }
    })

    showSortIcons(div);
}

function showSortIcons(div) {
    var colModel = $("#" + div).jqGrid('getGridParam', 'colModel');
    $('#gbox_' + $.jgrid.jqID(div) +
        ' tr.ui-jqgrid-labels th.ui-th-column').each(function(i) {
        var cmi = colModel[i],
            colName = cmi.name;

        if (cmi.sortable !== false) {
            
            // show the sorting icons
            $(this).find('>div.ui-jqgrid-sortable>span.s-ico').show();
        } else if (!cmi.sortable && colName !== 'rn' && colName !== 'cb' && colName !== 'subgrid') {
            // change the mouse cursor on the columns which are non-sortable
            $(this).find('>div.ui-jqgrid-sortable').css({
                cursor: 'default'
            });
        }
    });
}


function setWidth(){
    var objRows = $("#myGrid tr");
    var objHeader = $("#myGrid .jqgfirstrow td");

    

    if (objRows.length > 1) {
        var objFirstRowColumns = $(objRows[1]).children("td");
        for (i = 0; i < objFirstRowColumns.length; i++) {
            $(objFirstRowColumns[i]).css("width", $(objHeader[i]).css("width"));
        }
    }
}
function buttonFormatter(cellvalue, options, rowObject) {
    if (rowObject.Status != "Not Started") {

        var edit = "<i class='fa fa-eye' aria-hidden='true'></i><input class='Viewbtn view'  type='button' id='View' value='View' onclick=\"ShowDetails(this);\"  /><i class='fa fa-clipboard' aria-hidden='true'></i><input class='Viewbtn view fadelete'  type='button' id='Delete' value='Copy to Clipboard' onclick=\"CopyToClip(this);\"  />";
        return edit;
    }
    return '';
}

function CopyToClip(t){
    var c = $(t).closest('tr').find('td:eq(2)').text();
    
    //var copyText = document.getElementById("myInput");
    // copyText.value="";
    // copyText.value = c;
    // copyText.select();
    // copyText.focus();
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(c).select();
    document.execCommand("copy");
    $temp.remove(); 
}

function ClipboardFromDialog(){
    var c = $(".model-class-wrapper").html();
    
    var $temp1 = $("<input>");
    $("body").append($temp1);
    $temp1.val(c).select().focus();
    document.execCommand("copy");
    $temp1.remove(); 
}


function ShowDetails(a,b,c){
    $(".model-class-wrapper").remove();
    var c = $(a).closest('tr').find('td:eq(2)').text();
    
    var dialogContent = '<div id="workbenchchart-cont-choose-model" title="Copy Value" >' +
        '<div class="model-class-wrapper">'+c+'</div>'
    '</div>'

    $(dialogContent).dialog({
        modal: true,
        dialogClass: 'choosemodelforchart',
        // autoOpen: false,
        height: "300px",
        width: "300px",
        classes: {
            "ui-dialog": "choosemodelforchart"
        },
        open: function() {
            $(".ui-dialog-titlebar-close").replaceWith(
            '<div class="a"><button id="Clipboard" onclick="ClipboardFromDialog()"><i class="fa fa-clipboard" aria-hidden="true"></i></button></div>');
            //$(".choosemodelforchart .ui-widget-header").append('<button class="ml-icon" onclick="goToML()"><i class="fa fa-info"></i></button>')
        },
        buttons: {
            OK: function() {
                $(this).dialog('close');
                callback($('#' + modelSelect).val())
            },
            Close: function() {
                $(this).dialog('close');
                
            }
        }
    })

}

function getInExcel(JSONData, ReportTitle, ShowLabel) {


    ReportTitle = ReportTitle?ReportTitle:"Test Report"
    JSONData = jQuery("#grid").jqGrid('getGridParam', 'data');
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getInPDF(){
    
        var item = [{
          "Name" : "XYZ",
          "Age" : "22",
          "Gender" : "Male"
        }];
        var doc = new jsPDF();
        var col = ["Details", "Values"];
        var rows = [];
    
        for(var key in item){
            var temp = [key, item[key]];
            rows.push(temp);
        }
    
        doc.autoTable(col, rows);
    
        doc.save('Test.pdf');
    
}

function convert(name) {
    name = name?name:"Helper";
    var doc = new jsPDF();
    var col = ["ID","Task", "Solution"];
    
    var rows = [];
    

/* The following array of object as response from the API req  */



itemNew = jQuery("#grid").jqGrid('getGridParam', 'data');

itemNew.forEach(element => {      
     var temp = [element.ID,element.Task, element.Solution];
     
     rows.push(temp);
     

 });        

     doc.autoTable(col, rows, {
        
        margin: {horizontal:5,top: 20},
        startY: 10,
        //startY: 0.47*doc.internal.pageSize.height,
        //styles: {overflow: 'linebreak'},
        //styles: {overflow: 'linebreak', columnWidth: 'auto'},
        columnStyles:{
            0: {columnWidth: 50},
            1: {columnWidth: 50},
            2: {columnWidth: 100},
            
          }
        
      });
     doc.save(name+'.pdf');
   }

function DownloadData(){
    $(".model-class-wrapper").remove();
    
    var dialogContent = '<div id="workbenchchart-cont-choose-model1" title="Download" class="download-tab">' +
        '<div class="model-class-wrapper"><div class="type-selection"><label>Choose Type</label><select id="ChooseType"><option>Excel</option><option>PDF</option></select></div>'+
        '<div class="name-div"><label>Enter Name</label><input type="text" id="NameOf"></div></div>'
    '</div>'

    $(dialogContent).dialog({
        modal: true,
        dialogClass: 'choosemodelforchart',
        // autoOpen: false,
        height: "300px",
        width: "300px",
        classes: {
            "ui-dialog": "choosemodelforchart"
        },
        open: function() {
        },
        buttons: {
            OK: function() {
                $(this).dialog('close');
                var type = $("#ChooseType").val();
                var name = $("#NameOf").val();
                if(type=="Excel"){
                    getInExcel('', name, '')
                }else{
                    convert(name);
                }
            },
            Close: function() {
                $(this).dialog('close');
                
            }
        }
    })
}