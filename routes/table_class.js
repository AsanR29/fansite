//var router = express.Router();

class MasterElement {
    constructor(types){
        this.container_classes = "border-solid border-1 border-amber-800 rounded-lg shadow-lg mx-6 my-6";
        this.types = types;
        this.elements = new Array();
    }
}

class FormNames {
    constructor(data){
        this.names = data;
    }
}

class AffectionDiv {
    constructor(data){
        this.classes = "text-center bg-orange-200";
        this.affection = data;
    }
}

class TableHeader {
    constructor(data){
        this.header_classes = "text-xl text-gray-900 one-line-header w-full border-b-1 border-solid border-amber-800 brand-font text-center";
        this.header_text = data;
    }
}

class TableColumn {
    constructor(data){
        this.content = data;//.content
        this.classes = "px-2";
    }
}
class TableRecord {
    constructor(columnstart, classes){
        this.classes = classes;
        this.columns = new Array()

        this.columns.push(new TableColumn(columnstart));
        return;

        let colVal;
        this.columns.push(new TableColumn(columnstart));
        console.log(this.columns[0]);
        Object.keys(data).forEach(key=>{
            colVal = data[key];
            console.log(colVal);
            this.columns.push(new TableColumn(colVal));
        })
    }
    appendColumn(data)
    {
        this.columns.push(new TableColumn(data));
        return;
    }
}

class Table {
    constructor(data, record_class){
        this.table_classes = "bg-orange-200 px-2 py-2 w-full h-min items-center overflow-hidden border-spacing-1 border-amber-800";
        this.row_header_classes = "table-header-normalise";
        this.column_header_classes = ["col-w-25 table-header-normalise","col-w-75 table-header-normalise"];


        this.records = new Array();
        let new_record;
        let i;
        for(i = 0; i < data.length; i++)
        {
            new_record = new TableRecord(data[i], record_class);
            this.records.push(new_record);
        }
        console.log(data.length); console.log(this.records.length);
        return;
        // let keyVal;
        // Object.keys(data).forEach(key=>{
        //     keyVal = data[key];
        //     this.records.push(new TableRecord(key, keyVal));
        // });
    }
    appendRecord(i, column_data)
    {
        console.log(i);
        this.records[i].appendColumn(column_data);
    }
    removeRecord(i)
    {
        this.records.splice(i,1);
    }
    removeEmptyRecords()
    {
        let i = 0;
        let empty;
        while(i < this.records.length)
        {
            empty = false;
            for(let j = 0; j < this.records[i].columns.length; j++)
            {
                if(this.records[i].columns[j].content == "" && j >= 1)
                {
                    empty = true; break;
                }
            }
            if(empty){ this.records.splice(i,1); }
            else{ i += 1; }
        }
        return;
    }
}

module.exports = {MasterElement, Table, AffectionDiv, TableHeader, FormNames};