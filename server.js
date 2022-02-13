const express = require('express')
const cors = require('cors')
const axios = require('axios');
const {postSchema,validation} = require('./validations/validations')

const {ClickHouse} = require('clickhouse');

require('dotenv').config()

const app = express()

// parse application/json
app.use(express.json())
// cors
app.use(cors())

const ch_url = process.env.KX_HOST;
const password = process.env.KX_PASS;

const clickhouse = new ClickHouse({
            url: ch_url,
            port: 8123,
            debug: false,
            basicAuth: {
                username: 'default',
                password,
            },
            isUseGzip: false,
            format: "json", // "json" || "csv" || "tsv"
            raw: false,
            config: {
                session_timeout                         : 60,
                output_format_json_quote_64bit_integers : 0,
                enable_http_compression                 : 0,
                database                                : 'default',
            },
        });

app.get('/date', async (req, res) => {
  // 
  const symbol = req.query.symbol;
  // console.log('req=', symbol);
  let bur = [];
  for await (const row of clickhouse.query(`
                         SELECT 
                          MIN(open_time),
                          MAX(open_time),
                          MIN(volume),
                          MAX(volume),
                          MIN(number_of_trades),
                          MAX(number_of_trades)
                        FROM minutes_data

                        WHERE coin_id='${symbol}'
                        `).stream()) {
//WHERE coin_id='b11ec618-e305-4891-85b1-ea41758efb14'LIMIT 20000  DESCSELECT *COUNT(*) as count 
                        bur.push(row);

  }
  bur[0]["min(open_time)"] = new Date(bur[0]["min(open_time)"])
  bur[0]["max(open_time)"] = new Date(bur[0]["max(open_time)"])
  // console.log('b=',bur,' ',bur[0]["min(open_time)"]);
  res.json(bur)
});
                        // WHERE open_time >= '${ts}' and open_time < '${te}' and coin_id='${symbol}'.
                        //   and volume >= '${volume_s}' and volume <= '${volume_e}'
                        //   and number_of_trades >= '${trade_s}' and number_of_trades <= '${trade_e}'
                        //ORDER BY ${symbol}
app.get('/', async (req, res) => {
  // console.log('sss=');
  let bd = [];
                    for await (const row of clickhouse.query(`
                         SELECT *
                        FROM minutes_data
                        WHERE coin_id = 'BTC-USDT'
                        ORDER BY open_time DESC
                        LIMIT 1`).stream()) {
//WHERE coin_id='b11ec618-e305-4891-85b1-ea41758efb14'LIMIT 20000  DESCSELECT *COUNT(*) as count ASC
                        bd.push(row);

            }
  const k = bd.length;
  const t = new Date(bd[0].open_time)
  // console.log('t=', new Date(bd[0].open_time), ' ', bd[0].open_time);
  // console.log('t=', t, ' ', t.getTime());
  
                    res.json(bd);
        });

app.post('/bur', validation(postSchema), async (request, response, next) => {
  try {
  // console.time('v0')
  const {
    flame_s,
    flame_e,
    candle_s,
    candle_e,
    date_s,
    date_e,
    win,
    loss,
    symbol,
    volume_s,
    volume_e,
    trade_s,
    trade_e,
    full
  } = request.body
  // console.log('tt=',new Date(date_s).getTime());
  const ts = new Date(date_s).getTime()
  const te = new Date(date_e).getTime()
                    //coin_id b11ec618-e305-4891-85b1-ea41758efb14 соответствует BNT-USDT2021-12-29 00:00:002021-12-30 00:00:00
                    //из таблицы выбираются 100 первых строк
                    let bur = [];
                    for await (const row of clickhouse.query(`
                         SELECT *
                        FROM minutes_data
                        WHERE open_time >= '${ts}' and open_time < '${te}' and coin_id='${symbol}'
                          and volume >= '${volume_s}' and volume <= '${volume_e}'
                          and number_of_trades >= '${trade_s}' and number_of_trades <= '${trade_e}'
                        ORDER BY open_time ASC
                        LIMIT 100000`).stream()) {
//WHERE coin_id='b11ec618-e305-4891-85b1-ea41758efb14'LIMIT 20000  DESCSELECT *COUNT(*) as count 
                        bur.push(row);

  }
  // console.timeLog('v0','1')
  const kk = bur.length;
    const p = []
  
  let dc;
  let df;
  let k = 0;
  let isOpen = false;
  let isClose = false;
  const win_ = (Number(win) / 100)+1;
  const loss_ = 1-(Number(loss) / 100);
  bur.forEach((par) => {
    if (isOpen) {
      p[k - 1].push(par);
      isOpen = false;
      if (full==="false") isClose = true;
    }
    const cand = par.high - par.low
    if (cand === 0) {
        dc = 1;
        df = 1;
    }
    else {
      if (par.open_value >= par.close_value) {
        dc = (par.open_value - par.close_value) / cand;
        df = (par.high - par.open_value) / cand;
      }
      else {
        dc = (par.close_value - par.open_value) / cand;
        df = (par.high - par.close_value) / cand;
      }
    }
    
    if (dc >= Number(candle_s) / 100 &&
      dc <= Number(candle_e) / 100 &&
      df >= Number(flame_s) / 100 &&
      df <= Number(flame_e) / 100 &&
      !isClose)  {
      p.push( [par] )
      
      k++;
      
      isOpen = true;
    }
    p.forEach(pi=>{
      if (pi[0].res === undefined && pi[1] !== undefined) {
        const b = (pi[1].open_value * win_);
        const m = (pi[1].open_value * loss_);
        
        if(m >= par.low) {
          const r = m - pi[1].open_value;
          pi.push(par);
          pi.unshift({ res: r });
          isClose = false;
          return
        }
        if (b <= par.high) {
          const r = b - pi[1].open_value;
          pi.push(par);
          pi.unshift({ res: r });
          isClose = false;
          // console.log('pi=',pi);
          return
        }
      }
    })
    
  })
  // console.timeEnd('v0', 'end');
                    response.json(p);
  
} catch (error) {
     next(error);
  }
})
app.post('/burs', async (request, response) => {
  console.time('v1')
  const {
    flame_s,
    flame_e,
    candle_s,
    candle_e,
    date_s,
    date_e,
    win,
    loss,
    symbol
  } = request.body
  // console.log('tt=',new Date(date_s).getTime());
  const ts = new Date(date_s).getTime()
  const te = new Date(date_e).getTime()
  //coin_id b11ec618-e305-4891-85b1-ea41758efb14 соответствует BNT-USDT2021-12-29 00:00:002021-12-30 00:00:00
  //из таблицы выбираются 100 первых строк
  console.timeLog('v1', '1');
    const c_s = Number(candle_s) / 100 
    const c_e = Number(candle_e) / 100 
    const f_s = Number(flame_s) / 100 
    const f_e = Number(flame_e) / 100
  let bur = [];
  for await (const row of clickhouse.query(`
                         SELECT *
                        FROM minutes_data
                        WHERE open_time >= '${ts}' and open_time < '${te}' 
                        and coin_id='${symbol}'
                        and (high-low)!=0
                        and (${c_e}>=( ABS(open_value-close_value)/ABS(high-low) )>=${c_s})
                        and (((open_value>close_value) and (${f_s}>=((high-open_value)/(high-low) )>=${f_s}))or
                        ((open_value<close_value) and (${f_s}>=((high-close_value)/(high-low) )>=${f_s})))
                        ORDER BY open_time ASC
                        `).stream()) {
    //// and (open_value>close_value and (( ${c_e}>=( (open_value-close_value)/(high-low) )>=${c_s} ) and ${f_s}>=((high-open_value)/(high-low) )>=${f_s} ) and
                        //     open_value<close_value and (( ${c_e}>=( (close_value-open_value)/(high-low) )>=${c_s} ) and ${f_s}<=((high-close_value)/(high-low) )<${f_e} ))
    //WHERE coin_id='b11ec618-e305-4891-85b1-ea41758efb14'LIMIT 20000  DESCSELECT *COUNT(*) as count 
    bur.push(row);
//// and (open_value>close_value or high>open_value)
  }
  // console.timeEnd('v1','end')
  response.json({a:bur.length,bur})
})
app.get('/datee', async (request, response) => {

                    //coin_id b11ec618-e305-4891-85b1-ea41758efb14 соответствует BNT-USDT
                    //из таблицы выбираются 100 первых строк
                    let return_response = [];
                    for await (const row of clickhouse.query(`
                         SELECT *
                        FROM minutes_data
                        WHERE coin_id='BTC-USDT'
                        ORDER BY open_time DESC
                        LIMIT 1`).stream()) {
//WHERE coin_id='b11ec618-e305-4891-85b1-ea41758efb14'LIMIT 20000  DESCSELECT *COUNT(*) as count ASC
                        return_response.push(row);

            }
            const k = return_response.length;
                    response.json(new Date(return_response[0].open_time));
        });
app.get('/dates', async (request, response) => {
// console.log('pr=');
                    //coin_id b11ec618-e305-4891-85b1-ea41758efb14 соответствует BNT-USDT
                    //из таблицы выбираются 100 первых строк
                    let return_response = [];
                    for await (const row of clickhouse.query(`
                         SELECT *
                        FROM minutes_data
                        WHERE coin_id='BTC-USDT'
                        ORDER BY open_time ASC
                        LIMIT 1`).stream()) {
//WHERE coin_id='b11ec618-e305-4891-85b1-ea41758efb14'LIMIT 20000  DESCSELECT *COUNT(*) as count 
                        return_response.push(row);

            }
  // const k = return_response.length;
  
                    response.json(new Date(return_response[0].open_time));
        });
                    


// app.use('/api', (req, res) => {
//     const par = req.query;
//     const dem = "/api?,qs={pir:30,pew:30}";
//     res.json({par,dem})
// })
// app.use('/api/contacts', contactApi)

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /api/',
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

try {
  app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`)
  })
} catch (err) {
  console.log(`Server not running. Error message: ${err.message}`)
        process.exit(1);
}

