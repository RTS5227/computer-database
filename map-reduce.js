/**
 * Created by saber on 4/6/14.
 */
var company = {
    id: 'computer_name',
    type: 'company'
}

var computer = {
    id: 'uuid',
    name: 'string',
    introduced: 'datetime',
    discontinued: 'datetime',
    company_id: 'computer_name',
    type: 'computer'
}


var findByComputer = {
    map: function (doc) {
        if (doc.name && doc.type === 'computer') {
            emit(doc.name.toLowerCase(), null);
        }
    }
}

var findByCompany = {
    map: function (doc) {
        if (doc.company_id && doc.type === 'computer') {
            emit(doc.company_id.toLowerCase(), null);
        }
    }
}


var findByIntroduced = {
    map: function (doc) {
        if (doc.introduced && doc.type === 'computer') {
            emit(doc.introduced, null);
        }
    }
}

var findByDiscontinued = {
    map: function (doc) {
        if (doc.discontinued && doc.type === 'computer') {
            emit(doc.discontinued, null)
        }
    }
}

/*
 {
 "findByComputer": {
 "map": "function (doc) {\n        if (doc.name && doc.type === 'computer') {\n            emit(doc.name, null);\n        }\n    }"
 },
 "findByCompany": {
 "map": "function (doc) {\n        if (doc.company_id && doc.type === 'computer') {\n            emit(doc.company_id, null);\n        }\n    }"
 },
 "findByIntroduced": {
 "map": "function (doc) {\n        if (doc.introduced && doc.type === 'computer') {\n            emit(doc.introduced, null);\n        }\n    }"
 },
 "findByDiscontinued": {
 "map": "function (doc) {\n        if (doc.discontinued && doc.type === 'computer') {\n            emit(doc.discontinued, null)\n        }\n    }"
 }
 }
 */