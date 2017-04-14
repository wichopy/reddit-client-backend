const Koa = require('koa');
const app = new Koa();
const rp = require('request-promise')
const _ = require('koa-route');
const bodyParser = require('koa-bodyParser')
const PORT = 3000;

//****Middleware:
//body parser
app.use(bodyParser());
app.use(async (ctx,next) => {
  // the parsed body will store in ctx.request.body
  // if nothing was parsed, body will be an empty object {}
  ctx.body = ctx.request.body;
  await next ();
});
// x-response-time
app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});
//  logger
app.use(async function (ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});
//**end of middleware
const reddit = {
  frontpage: async (ctx) => {
    const fp = await rp('https://www.reddit.com/r/frontpage.json')
    const fpParsed = JSON.parse(fp)
    ctx.body = fpParsed
  },

  subreddit: async (ctx,subreddit) =>{
    try {
      const sr = await rp(`https://www.reddit.com/r/${subreddit}.json`)
      const srParsed = JSON.parse(sr);
      ctx.body = srParsed;
    }
    catch (error) {
      ctx.body = `subreddit ${subreddit} does not exist`
    }
  },

  search_reddit_names: async (ctx) => {
    try {
      const res = await rp({
        uri: 'https://www.reddit.com/api/search_reddit_names.json',
        method: 'POST',
        form: {query: ctx.request.body.query}
      })
      ctx.body = res
    }
    catch (error) {
      ctx.body = 'error'
    }
  }

  // next_page: async (ctx,after_code) => {
  //   const np = await rp()
  // },

  // prev_page: async (ctx, before_code) => {

  // }
  
}

app.use(_.get('/', reddit.frontpage));
app.use(_.post('/search_reddit_names', reddit.search_reddit_names))
app.use(_.get('/:subreddit', reddit.subreddit))
// app.use(_.get('/:subreddit/?page='))

app.listen(PORT);
console.log(`Listening on port ${PORT}`)