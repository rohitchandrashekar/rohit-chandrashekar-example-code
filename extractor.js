const { sequelize } = require('./schemas/collections');
const { walk } = require('./helpers/helper');
const { Worker, isMainThread } = require('worker_threads');
const NO_OF_THREADS = 7;
async function init() {
    try {
        await sequelize.sync({ force: true });
        console.log('main thread started');
        const FileList = await walk('./input');
        if (isMainThread) {
            const sliceStart = Math.floor(FileList.length / NO_OF_THREADS);
            let count = 0;
            for (let i = 0; i < 7; i++) {
                const worker = new Worker('./worker.js', {
                    workerData: FileList.slice(count, count + sliceStart)
                });
                worker.on('message', (message) => {
                    console.log(message)
                });
                worker.on('error', (error => {
                    console.error(error);
                    throw error;

                }));
                worker.on('exit', (code) => {
                    if (code !== 0)
                        throw (new Error(`Worker stopped with exit code ${code}`));
                });
                count = count + sliceStart;
            }
        }

    } catch (error) {
        console.error(error);
        throw error
    }
}

init()