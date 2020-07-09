const expect = require('chai').expect
const { walk, readFile, parseFile, populateCollectionDataFromFile, saveDataToDB } = require('./helpers/helper');
const { sequelize } = require('./schemas/collections');
describe('file and directory Reads', () => {

    it('should return all the files in the cache directory', async () => {
        let files = await walk('./cache');
        expect(files).to.have.lengthOf(62489);
        expect(files).to.be.an('array');
    });
    it('should parse a read file', async () => {
        let file = await readFile('./cache/epub/11/pg11.rdf');
        let parsed = await parseFile(file);
        expect(parsed).to.be.an('object');
        expect(parsed).to.include.any.keys('rdf:RDF')
    });

})

describe('file parsing', () => {

    it('should populate the book data from the file ', async () => {
        const file = await readFile('./cache/epub/11/pg11.rdf');
        const data = {
            id: '11',
            title: "Alice's Adventures in Wonderland",
            authors: 'Carroll, Lewis',
            publisher: 'Project Gutenberg',
            publication_date: '2008-06-27',
            language: 'en',
            subjects: "Fantasy fiction,Imaginary places -- Juvenile fiction,PR,Children's stories,PZ,Alice (Fictitious character from Carroll) -- Juvenile fiction",
            license_rights: 'Public domain in the USA.'
        }
        const parsed = await parseFile(file);
        const collectionData = populateCollectionDataFromFile(parsed);
        expect(collectionData).to.be.an('object');
        expect(collectionData.id).to.equal(data.id);
        expect(collectionData).to.deep.equal(data);
    });
})

describe('database inserts', async () => {
    before(async () => {
        await sequelize.sync({ force: true });
    })
    it('should insert data into collection', async () => {
        const data = {
            id: '99999999999999',
            title: 'abcd',
            authors: 'demo author',
            publisher: 'demo pub',
            publication_date: '1998-02-01 00:00:00.0',
            language: 'fr',
            subjects: 'dummy sub',
            license_rights: 'dummy license'
        }
        await saveDataToDB(data);
    });

    it('should fail to insert data into collection', async () => {
        const data = {
            id: null,
            title: 'abcd',
            authors: 'demo author',
            publisher: 'demo pub',
            publication_date: '1998-02-01 00:00:00.0',
            language: 'fr',
            subjects: 'dummy sub',
            license_rights: 'dummy license'
        }
        try {
            await saveDataToDB(data)
        } catch (error) {
            expect(error).to.be.an('Error');
            expect(error.name).to.equal('SequelizeDatabaseError');
            expect(error.parent.code).to.equal('ER_BAD_NULL_ERROR');
        }
    });
})
