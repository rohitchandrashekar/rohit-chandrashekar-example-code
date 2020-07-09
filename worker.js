const Promise = require("bluebird");
const { readFile, parseFile, populateCollectionDataFromFile, saveDataToDB } = require('./helpers/helper');
const { parentPort, workerData } = require('worker_threads');

async function workerInit() {
    console.log('worker thread initialized');
    const startTime = new Date();
    console.time('started');
    await Promise.map(workerData, async function (fileName) {
        if (fileName.includes('rdf')) {
            const fileData = await readFile(fileName);
            const parsedFileData = await parseFile(fileData);
            const collectionData = populateCollectionDataFromFile(parsedFileData);
            await saveDataToDB(collectionData);
        }
    }, { concurrency: 200 }).catch((error) => {
        console.error(error);
        throw error
    });
    console.log(`${startTime} ${new Date()}`)
    console.timeEnd('started');
    parentPort.postMessage('completed');

}

workerInit()