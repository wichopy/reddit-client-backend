const Koa = require('koa');
const app = new Koa();
const rp = require('request-promise')
const _ = require('koa-route');
const PORT = 3000;
// x-response-time

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// // logger

app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});


const db = {
  tobi: { name: 'tobi', species: 'ferret' },
  loki: { name: 'loki', species: 'ferret' },
  jane: { name: 'jane', species: 'ferret' }
};

const pets = {
  list: (ctx) => {
    const names = Object.keys(db);
    ctx.body = 'pets: ' + names.join(', ');
  },

  show: (ctx, name) => {
    const pet = db[name];
    if (!pet) return ctx.throw('cannot find that pet', 404);
    ctx.body = pet.name + ' is a ' + pet.species;
  }
};

const reddit = {
  frontpage: async (ctx) => {
    const fp = await rp('https://www.reddit.com/r/frontpage.json')
    const fpParsed = JSON.parse(fp)
    console.log(fpParsed);
    ctx.body = fpParsed
  },

  show: async (ctx,subreddit) =>{
    const sr = await rp(`https://www.reddit.com/r/${subreddit}.json`)
    const srParsed = JSON.parse(srParsed);
    ctx.body = srParsed;
  }
}

const hello = (ctx) => {
  ctx.body = 'Hello World';
};

app.use(_.get('/', reddit.frontpage));
app.use(_.get('/:subreddit'), reddit.show)
app.use(_.get('/pets', pets.list))
app.use(_.get('/pets/:name', pets.show));
app.listen(PORT);
console.log(`Listening on port ${PORT}`)