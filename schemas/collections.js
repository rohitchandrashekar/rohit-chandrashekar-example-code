const Sequelize = require('sequelize');

const sequelize = new Sequelize('gutenberg', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
});
Collections = sequelize.define('collections', {
  id: { type: Sequelize.STRING, primaryKey: true },
  title: { type: Sequelize.STRING(1000) },
  authors: { type: Sequelize.STRING(1000) },
  publisher: Sequelize.STRING,
  publication_date: { type: Sequelize.DATE },
  language: Sequelize.STRING,
  subjects: Sequelize.TEXT,
  license_rights: Sequelize.STRING
},{
  indexes: [
    { type: 'FULLTEXT', name: 'title_text_idx', fields: ['title'] },
    { name: 'authors_publication_date_idx', fields: ['authors', 'publication_date'] },
  ]
})

module.exports = {
  Collections, sequelize
}