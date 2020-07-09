const fs = require('fs').promises;
const path = require("path");
const xml2js = require('xml2js');
const { Collections } = require('../schemas/collections');
const Promise = require("bluebird");

const walk = async (dir) => {
    try {
        let files = await fs.readdir(dir);
        files = await Promise.map(files, async (file) => {
            const filePath = path.join(dir, file);
            const stats = await fs.stat(filePath);
            if (stats.isDirectory()) return walk(filePath);
            else if (stats.isFile()) return filePath;
        },{concurrency : 200});
        return files.reduce((all, folderContents) => all.concat(folderContents), []);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const readFile = async (fileName) => {
    return await fs.readFile(fileName);
}

const parseFile = async (fileData) => {
    return await xml2js.parseStringPromise(fileData)
}

const populateCollectionDataFromFile = (parsedData) => {
    const result = parsedData['rdf:RDF'] && parsedData['rdf:RDF']['pgterms:ebook'] ? parsedData['rdf:RDF']['pgterms:ebook'][0] : null
    if (!result) {
        return null;
    }
    return {
        id: result['$'] && result['$']["rdf:about"] ? result['$']["rdf:about"].replace("ebooks/", "") : null,
        title: result['dcterms:title'] ? result['dcterms:title'].join() : null,
        authors: getAuthors(result['dcterms:creator']),
        publisher: result['dcterms:publisher'] ? result['dcterms:publisher'].join() : null,
        'publication_date': result['dcterms:issued'][0]['_'],
        language: result['dcterms:language'] ? getNestedValues(result['dcterms:language']) : null,
        subjects: getNestedValues(result['dcterms:subject']),
        'license_rights': result['dcterms:rights'] ? result['dcterms:rights'].join() : null
    }
}
const getAuthors = (creator) => {
    if (!creator) {
        return null
    }
    return creator.map(data => {
        if (data.hasOwnProperty('pgterms:agent')) {
            return data['pgterms:agent'].map(element => {
                return element['pgterms:name'] ? element['pgterms:name'].join() : null
            })
        } else {
            return null;
        }
    }).join()



}
const getNestedValues = (key) => {
    if (!key) {
        return null;
    }
    return key.map(data => {
        if (data.hasOwnProperty('rdf:Description')) {
            return data['rdf:Description'].map(element => {
                return element['rdf:value'].map(innerElement => {
                    return typeof innerElement === 'string' ? innerElement : innerElement['_']
                })
            });
        } else {
            return null;
        }
    }).join()
}

const saveDataToDB = async (insertObj) => {
    return await Collections.create(insertObj);
}

module.exports = {
    walk,
    readFile,
    parseFile,
    populateCollectionDataFromFile,
    saveDataToDB
}