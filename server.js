const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const axios = require('axios');
const {Order,Norder,Parser,Sort} = require('./models')
const { Perebor, Poick, Kolection } = require('./controllers/cont');
const OrderNew = require('./controllers/order')


require('dotenv').config()

// const {contactApi} = require('./api')
// const { authApi } = require('./api')

const app = express()

// parse application/json
app.use(express.json())
// cors
app.use(cors())

// async function par() {
//   // await Parser.find().sort({datefield: -1});.limit(5){$where: '(this.open - this.close > 100)'}
//   console.time('v0');
//   const pars = await Parser.find();
//   console.timeLog('v0', '0');
//   // const pars = await Parser.find({},{_id:0}).sort({ date: 1 });
//   const p = []
//   pars.forEach(par => {
//     const dl = (par.open - par.close) / (par.high - par.low);
//     if (dl > 0.9) {
//       p.push(par)
//     }
//   })
//   console.timeLog('v0', '1');
//   console.log('p=',p.length,' ',pars.length);
//   // await Sort.create(pars);
//   console.log('aaa=');
// } 
// par()
//.find({}, { "sort": [['datefield', 'asc']] }, function (err, docs) { });
//.exec(function(err, doc) {})
const csvFilePath = './h_.csv';
// const csvFilePath1 = './d.csv';
const csv = require('csvtojson')
// console.log('c=',csvFilePath);
// csv()
// .fromFile(csvFilePath)
// .then(async(jsonObj)=>{
//   console.log(jsonObj[0].date, jsonObj[1].date, jsonObj[2].date);
//   for (let p of jsonObj) {
//     // console.log(p.date);
//     await Parser.create(p)
//   }
//   // 
//     console.log('aaa');
// })

// csv()
// .fromFile(csvFilePath1)
// .then(async(jsonObj)=>{
//     // console.log(jsonObj);
//   await Parser.create(jsonObj)
    
// })


// const ar = [
//   [[0, 0], [1, 1],[2, 2],[3, 3]],
//   [[0, 0], [1, 2],[2, 1],[3, 4]],
//   [[0, 0], [1, 2],[2, 2],[3, 5]],
//   [[0, 0], [1, 2],[2, 2],[3, 6]]
// ]
// // const ar2 =
// // const ar3 =
// // const ar4 = 
// let nar = []
// ar.forEach(a => {
//   if (nar.length === 0) {
//     nar = a;
//     return
//   }
//   console.log('a=', a,'b=',nar);
//   const data = Kolection(nar, a)
//   nar = data.o
//   console.log('d=',data);
// })
// app.use(express.static("public"))
// const rew = { erm: 34, frt: { sok: 12 } }
// async (req) => {
//   const {_id} = req.user;
//   const newContact = await Contact.create({...req.body, owner: _id});
// function (res) {
//     console.log(res.data);
//   }

//*
// let n = 100;
// const intId = setInterval(()=>{
//   axios.get('https://api.binance.com/api/v1/depth?symbol=BTCUSDT&limit=1000')
//   .then(async (res) => {
//     const newContact = await Order.create(res.data)
//     // console.log(res.data,'  ',newContact);
//   })
//   .catch(function (error) {
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//   });
//   console.log('=');
//   n=n-1;
//   if(!n){clearInterval(intId)}
// },1000)
//*

// axios.get('http://localhost:3001/api', {
//     params: {
//       ID: 12345,
//       rew
//     }
//   })
//   .then(function (res) {
//     console.log(res.data);
//   })
//   .catch(function (error) {
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//   });
// const a = [ '33871.00000000', '0.00047000' ];
// const b = [ '33871.00000000', '0.00047000' ];
// const c = ['33871.02000000', '0.18264000'];
// if (a[0] === b[0]) console.log('a=');
// else console.log('!b');
// if (a===c) console.log('c=');
async function exam() {
  const a = await Norder.find().sort({ $natural: 1 }).limit(5);
  // const a = await Norder.find({}, '', { limit: [-1, 4] });
  console.log('a=', a[0].bids.length, '', a.length);
//   while (a.hasNext()) {
//   obj = a.next();
//   print(obj['bids']);
// }
}
// exam();
// OrderNew();
app.post('/bur', async (req, res) => {
  const {
    flame_s,
    flame_e,
    candle_s,
    candle_e,
    date_s,
    date_e,
    win,
    loss,
    // symbol
  } = req.body
  const pars = await Parser.find({
    date: {
        $gte: date_s,
        $lt: date_e
    }
}).sort({ $natural: -1 });
  const p = []
  // console.log('c=', Number(candle_s) / 100);
  // console.log('cN=', Number(candle_s));
  // console.log('cc=', req.body);
  let dc;
  let df;
  let arr = [];
  let k = 0;
  let isOpen = false;
  pars.forEach((par, i) => {
    if (isOpen) {
      p[k - 1].push(par);
      isOpen = false;
    }
    if (par.open > par.close) {
      dc = (par.open - par.close) / (par.high - par.low);
      df = (par.high - par.open) / (par.high - par.low);
    }
    else {
      dc = (par.close - par.open) / (par.high - par.low);
      df = (par.high - par.close) / (par.high - par.low);
    }
    // // par['ind'] = 'i';
    // par.ind = i;
    if (dc > Number(candle_s) / 100 &&
      dc < Number(candle_e) / 100 &&
      df > Number(flame_s) / 100 &&
      df < Number(flame_e) / 100) {
      // par['ind'] = i;
      // console.log('p-',par.ind);
      p.push( [par] )
      // p.push({ [k]: [par] })
      k++;
      arr.push(i)
      isOpen = true;
    }
    p.forEach(pi=>{
      if (pi[0].res === undefined && pi[1] !== undefined) {
        const b = (pi[1].open * (Number(win) / 100) + pi[1].open);
        const m = (pi[1].open - (pi[1].open * (Number(loss) / 100)));
        // pi.push(par);
        if (b <= par.high) {
          const r = b - pi[1].open;
          pi.push(par);
          pi.unshift({ res: r });
          // console.log('pi=',pi);
          return
        }

        if(m >= par.low) {
          const r = m - pi[1].open;
          pi.push(par);
          pi.unshift({ res: r });
          return
        }
        // pi.push(par);
      }
    })
  })
  // console.log('p-',p[0],'p0=',p[1][1]);
  // res.json([{ c: p, a: p.length, b: arr }]);
  res.json(p)
  //
})
app.get('/dates', async (req, res) => {
  const a = await Parser.find().sort({ $natural: -1 }).limit(1);
  // console.log('a=',a[0].date);
  res.json(a[0].date)
})
app.get('/datee', async (req, res) => {
  const a = await Parser.find().sort({ $natural: 1 }).limit(1);
  // console.log('a=',a[0].date);
  res.json(a[0].date)
})
// app.get('/:id', async (req, res) => {
//   const newOrder = await Order.find();
//   newOrder.forEach((ord,index) => {
//     order[index] = ord
//     // console.log(ord);
//   })
//   const one = order[2].bids[0]
//   const comp = order[1].bids.find((f) => {
//     console.log(f,one);
//     // f===one
//   })
//   console.log(comp);
//   res.json(order[2])
// })

app.use('/api', (req, res) => {
    const par = req.query;
    const dem = "/api?,qs={pir:30,pew:30}";
    res.json({par,dem})
})
// app.use('/api/contacts', contactApi)

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /api/contacts',
    data: 'Not found',
  })
})

app.use((err, _, res, __) => {
  // console.log(err.status)
  if (err.status === 400) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: err.message,
    })
  }
  else
    res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  })
})

const PORT = process.env.PORT || 3005
const uriDb = process.env.DB_HOST

const connection = mongoose.connect(uriDb, {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
})
// app.listen(PORT, function () {
//       console.log(`Server running. Use our API on port: ${PORT}`)
//     })
connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  })
  .catch((err) => {
      console.log(`Server not running. Error message: ${err.message}`)
        process.exit(1);
  },
  )