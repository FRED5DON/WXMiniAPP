// const { mysql: config } = require('../config')
const { mysql } = require('../qcloud')
// const DB = require('knex')({
//   client: 'mysql',
//   connection: {
//     host: config.host,
//     port: config.port,
//     user: config.user,
//     password: config.pass,
//     database: config.db,
//     charset: config.char,
//     multipleStatements: true
//   }
// })
module.exports = async (ctx, next) => {
  //
  // if (ctx.protocol != "https"){
  //   return;
  // }
  let page = 0, word='';
  if (ctx.request.query){
    let p=ctx.request.query.page;
    word = ctx.request.query.word;
    if (!word){
      word='';
    }
    if (!isNaN(p)){
      page=p;
    }
  }
  page = page > 0 ? (page-1):0;
  await mysql.select(['fileName', 'fileParent', 'title']).from('cBqbs')
  .andWhere('title', 'like', `%${word}%`)
  .limit(21)
    .offset(21*page)
  .then(res => {
    const pageData={
      page: page+1,
      data: res
    }
    ctx.response.status = 200;
    ctx.response.type = 'application/json';
    ctx.response.body = pageData;
    }, err => {
      ctx.response.status = 500;
      ctx.response.type = 'application/json';
      ctx.response.body = {
        err:"Error"
      };
  })
  // DB.raw("SELECT * FROM cBqbs limit 12").then(rows => {
  //   console.log(rows)
  //   ctx.response.type = 'application/json';
  //   ctx.response.body = rows;
  //   process.exit(0)
  // }, err => {
  //   throw new Error(err)
  // })
  // DB.select().from('cBqbs').where({ enabled: 1 }).limit(12).then((rows) => {
  //   console.log(rows)
  //   ctx.response.type = 'application/json';
  //   ctx.response.body = rows;
  // })

}