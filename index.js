const Koa = require('koa');
const app = new Koa();
const rp = require('request-promise')
const _ = require('koa-route');
const cors = require('koa-cors')
const bodyParser = require('koa-bodyparser')
const PORT = 3001;

//****Middleware:
//cors
app.use(cors());
//body parser
app.use(bodyParser());
app.use(async(ctx, next) => {
    // the parsed body will store in ctx.request.body
    // if nothing was parsed, body will be an empty object {}
    // console.log('found this in the body: ', ctx.request)
    ctx.body = ctx.request.body;
    await next();
});
// x-response-time
app.use(async function(ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});
//  logger
app.use(async function(ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});
//**end of middleware

const reddit = {
    frontpage: async(ctx) => {
        console.log('get frontpage')
        const fp = await rp('https://www.reddit.com/r/frontpage.json')
        const fpParsed = JSON.parse(fp)
        ctx.body = fpParsed
    },

    subreddit: async(ctx, subreddit) => {
        try {
            console.log('getting subreddit..')
            const sr = await rp(`https://www.reddit.com/r/${subreddit}.json`)
            const srParsed = JSON.parse(sr);
            const srInfo = await rp(`https://www.reddit.com/r/${subreddit}/about.json`)
            const srInfoParsed = JSON.parse(srInfo);
            ctx.body.sr = srParsed;
            ctx.body.srInfo = srInfoParsed;
        } catch (error) {
            ctx.body = `subreddit ${subreddit} does not exist`
        }
    },
    subredditNextPage: async(ctx, subreddit, afterCode) => {
        console.log('in next page')
        console.log(subreddit)

        console.log(afterCode)
        const nextPage = await rp(`https://www.reddit.com/r/${subreddit}.json?after=${afterCode}&count=25`)
        const nextPageParsed = JSON.parse(nextPage);
        ctx.body.sr = nextPageParsed;
    },
    posts: async(ctx) => {
        try {
            console.log('getting posts.. at permakink', ctx.body.permalink)
            const removeLastChar = ctx.body.permalink.slice(0, -1);
            console.log(`https://www.reddit.com${removeLastChar}.json`)
            const postComments = await rp(`https://www.reddit.com${removeLastChar}.json`)
            const postCommentsParsed = JSON.parse(postComments);
            ctx.body = postCommentsParsed;
            // console.log(postCommentsParsed)
        } catch (error) {
            ctx.body = `subreddit ${subreddit} does not exist`
        }
    },
    search_reddit_names: async(ctx) => {
        try {
            console.log('autcomplete suggestions...')
            const res = await rp({
                    uri: 'https://www.reddit.com/api/search_reddit_names.json',
                    method: 'POST',
                    form: { query: ctx.body.query }
                })
                // console.log(res)
            ctx.body = res
        } catch (error) {
            ctx.body = error
        }
    }
}

app.use(_.get('/', reddit.frontpage));
app.use(_.post('/posts', reddit.posts))
app.use(_.post('/search_reddit_names', reddit.search_reddit_names))
app.use(_.get('/:subreddit', reddit.subreddit))
app.use(_.get('/:subreddit/after/:afterCode', reddit.subredditNextPage))

app.listen(PORT);
console.log(`Listening on port ${PORT}`)