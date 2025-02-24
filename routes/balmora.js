var express = require('express');
const mongoose = require('mongoose');
const {MasterElement, Table, AffectionDiv, TableHeader, FormNames} = require('./table_class');

var router = express.Router();
const url = "mongodb://localhost:27017/orders";

function validatePrescenceOf(value){
    return value && value.length;
}
function validateNumber(value){
    return !isNaN(value);
}

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//Balmora_charter
var BalSchema = new Schema({
    c_name      : { type: String, validate: [validatePrescenceOf, "a name is required"] },
    c_race      : { type: String, validate: [validatePrescenceOf, "a race is required"] },
    c_gender    : { type: String, validate: [validatePrescenceOf, "a gender is required"] },
    trade       : { type: String },
    agent       : { type: String },
    training    : { type: String },
    affection   : { type: Number, validate: [validateNumber, "affection must be a number"] },
    barter      : { type: String },
    description : { type: String },
    review      : { type: String }
});
const BCharter = mongoose.model('Balmora_Charter', BalSchema);

class BalmoraCitizen {
    static citizen_attributes = ["c_name","c_race","c_gender","trade","agent","training","affection","barter","description","review"];
    constructor(data)
    {
        this.data = data;
        this.export = null;
    }

    createTable()
    {
        var record_names = ["Race:","Gender:","Trade:","Agent:","Training:","Affection:","Barter:","Description:","Review:"];
        let record_class = "";
        this.export = new MasterElement([0,1,2,1,3]);
        this.export.elements.push(new TableHeader(this.data.c_name));

        let new_table = new Table(record_names.slice(0,5), record_class);

        let offset = 1;
        let limit = 6;
        let i;
        //console.log(this.data);
        //console.log(this.data["c_race"]);
        let subject;
        for(i = 0; i < (limit-offset); i++)
        {
            subject = this.data[BalmoraCitizen.citizen_attributes[i+offset]];
            new_table.appendRecord(i, subject);
        }
        new_table.removeEmptyRecords();
        this.export.elements.push(new_table);
        
        this.export.elements.push(new AffectionDiv(this.data.affection));

        new_table = new Table(record_names.slice(6,9), record_class);
        offset = 7;
        limit = 10;
        for(i = 0; i < (limit-offset); i++)
        {
            subject = this.data[BalmoraCitizen.citizen_attributes[i+offset]];
            new_table.appendRecord(i, subject);
        }
        new_table.removeEmptyRecords();
        this.export.elements.push(new_table);

        //action button
        this.export.elements.push(new AffectionDiv(this.data._id));
        return;
    }
    createForm()
    {
        var record_names = ["Name:","Race:","Gender:","Trade:","Agent:","Training:","Affection:","Barter:","Description:","Review:"];
        let record_class = "";
        this.export = new MasterElement([1,3,4]);

        //table
        let new_table = new Table(record_names, record_class);
        let limit = 10;
        let i;
        let subject;
        for(i = 0; i < limit; i++)
        {
            subject = this.data[BalmoraCitizen.citizen_attributes[i]];
            console.log(i + ", " + BalmoraCitizen.citizen_attributes[i] + ", " + subject);
            new_table.appendRecord(i, subject);
        }
        this.export.elements.push(new_table);

        //action button
        this.export.elements.push(new AffectionDiv(this.data._id));
        //just data, no display
        this.export.elements.push(new FormNames(BalmoraCitizen.citizen_attributes));
    }
}

async function getCharacters(){
    const docs = await BCharter.find({});
    return docs;
}
async function getCharacterById(id){
    const doc = await BCharter.findById(id);
    return doc;
}
async function editCharacter(id, form){
    console.log(form.affection);
    form.affection = parseFloat(form.affection);
    console.log(form.affection);
    if(isNaN(form.affection)){
        return Promise.reject(new PermissionDenied());
    }
    //console.log(form.affection);
    const query = { _id : id };
    const newValues = form;
    var result = false;
    result = await BCharter.findOneAndUpdate(query, newValues);
    return result;
}
async function deleteCharacter(id){
    const query = { _id : id };
    await BCharter.findOneAndDelete(query);
}

async function saveCharacter(form){
    //console.log(form.affection);
    form.affection = parseFloat(form.affection);
    if(isNaN(form.affection)){
        return Promise.reject(new PermissionDenied());
    }
    //console.log(form.affection);
    var new_character = new BCharter({
        c_name      : form.c_name,
        c_race      : form.c_race,
        c_gender    : form.c_gender,
        affection   : form.affection,
        trade       : form.trade,
        agent       : form.agent,
        training    : form.training,
        barter      : form.barter,
        description : form.description,
        review      : form.review
    });
    try{
        await new_character.save();
        return new_character;
    }
    catch(err){
        return Promise.reject(new PermissionDenied());
    }
}

//routes

mongoose.connect(url, {})
    .then(result => console.log("database connected"))
    .catch(err => console.log(err));

router.get('/',  function(req, res, next) {
    var citizen;
    var charter_tables = new Array();
    getCharacters().then(function(docs){
        docs.forEach(doc=>{
            citizen = new BalmoraCitizen(doc);
            citizen.createTable();
            charter_tables.push(citizen.export);
        });
        //let citizen = new BalmoraCitizen(doc);
        //console.log(charter_tables);
        res.render('balmora_charter', { title: "Balmora citizens", charter: docs, tables: charter_tables} );
    });
});

router.get('/add', function(req, res, next) {
    var citizen;
    citizen = new BalmoraCitizen(new BCharter());
    citizen.createForm();
    res.render('balmora_add', { title: "Add citizen", master: citizen.export} );
});
router.post('/add', function(req, res, next) {
    if(req){
        saveCharacter(req.body)
            .then(function(){
                req.flash("info", "Citizen created");
                res.redirect('/balmora');
            })
            .catch(function(){
                req.flash("warning", "Failed to create citizen");
                res.redirect('/balmora/add');
                return;
            });
    }
    else{
        console.log("Hell");
        res.redirect('/balmora/add');
    }
});

router.get('/southwall', function(req, res, next) {
    res.render('balmora_southwall', { title: "South Wall"} );
});

router.get('/:id', function(req, res, next) {
    var citizen;
    getCharacterById(req.params.id).then(function(doc){
        citizen = new BalmoraCitizen(doc);
        citizen.createTable();
        res.render('balmora_citizen', { title: "Individual page", charter: doc, master: citizen.export } );
    });
});
router.get('/:id/edit', function(req, res, next) {
    var citizen;
    getCharacterById(req.params.id).then(function(doc){
        citizen = new BalmoraCitizen(doc);
        citizen.createForm();
        res.render('balmora_edit', { title: "Individual page", charter: doc, master: citizen.export } );
    });
})

router.post('/:id', function(req, res, next) {
    var citizen;
    editCharacter(req.params.id, req.body)
        .then(doc => getCharacterById(req.params.id))
        .then(function(doc){
            citizen = new BalmoraCitizen(doc);
            citizen.createTable();

            req.flash("info", "Details updated");
            res.render('balmora_citizen', { title: "Individual page", charter: doc, master: citizen.export } );
        });
});
router.delete('/:id', function(req, res, next) {
    deleteCharacter(req.params.id).then(function(){
        req.flash("info", "Citizen deleted");
        res.redirect('/balmora')
    });
});

module.exports = router;