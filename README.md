# Extractor
===========================

PREREQUISITES
-------------

- `node`: This requires Node v12.18.x or greater.
- [zip](http://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.zip) : to be extracted and untar'd in the input folder

INSTALL
-------

   ```sh
   $ # Clone the repository
   $ cd extractor
   
   $ # create the input folder
   $ mkdir input
   
   $ # install the dependencies
   $ npm i
   
   $ # create the database
   $ scripts.sql
   ```

TRY IT!
-------
- [x] RUN

 - Run the script

   ```sh
   $ npm start
   ```

- [x] Test

- Test the script

   ```sh
   $ npm test
   ```
   
## Benchmarks
- single thread async process takes approx 6 minutes to complete
- parallel processing with concurrency of 200 takes around 3 minutes to complete
- current approach of parallel processing along with multiple workers takes approx 40 seconds to complete
- Databases has been indexed with multiple columns for faster information retrieval
