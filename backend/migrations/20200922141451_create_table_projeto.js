
exports.up = function(knex, Promise) {
    return knex.schema.createTable('projeto', table =>{
        table.increments('id').primary()
        table.string('name').notNull()
        table.date('dataIni').notNull()
        table.date('dataFim').notNull()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('projeto')
};
