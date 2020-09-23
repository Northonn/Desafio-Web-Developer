
exports.up = function(knex, Promise) {
    return knex.schema.createTable('atividade', table =>{
        table.increments('id').primary()
        table.string('name').notNull()
        table.date('dataIni').notNull()
        table.date('dataFim').notNull()
        table.boolean('finalizada').notNull()
        table.integer('idProjeto').references('id')
            .inTable('projeto')
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('atividade')
};
