const { Order, Norder } = require('../models');
const { Perebor, Poick, Kolection } = require('./cont');

let order = []  

async function OrderNew() {
  console.time('v0');
  const newOrder = await Order.find();
    // console.timeLog('v0', '0', newOrder[0]);
    // let arrey = { bids: [[0, 0]], asks: [[0, 0]] }
    let arrey = newOrder[0]
    // newOrder.reduce((last, curr, index) => {
    //     console.timeLog('v0', `${index}`);
    //     console.log('i=',index,' ',last.bids.length,' ',curr.bids.length);
    // })
    for (let ord of newOrder) {
        // console.log('i=',ord.bids.length);
        // if (Object.keys(arrey).length === 0) {
        //     arrey = ord;0
        //     break
        // }
        console.timeLog('v0', '4');
        // console.log('a=',arrey,'  ',ord);
        const obnov_bids = Kolection(arrey.bids, ord.bids);
        arrey.bids = obnov_bids.o;
        const obnov_asks = Kolection(arrey.asks, ord.asks);
        arrey.asks = obnov_asks.o;
        // let obnov
        // if (index === 100) obnov = { bids: obnov_bids.o, asks: obnov_asks.o }
        // else
        const    obnov = { bids: obnov_bids.a, asks: obnov_asks.a }
        console.timeLog('v0', '5');
        const newContact = await Norder.create(obnov);
        console.timeLog('v0', '6');
        // if(done) await Norder.create({ bids: obnov_bids.o, asks: obnov_asks.o });
    }
    await Norder.create({ bids: arrey.bids, asks: arrey.asks });
    // obnov = { bids: obnov_bids.o, asks: obnov_asks.o }
    // const newContact = await Norder.create(obnov);
    console.timeLog('v0', '7');
}

// async function OrderNew() {
//   console.time('v0');
//   const newOrder = await Order.find();
//   console.timeLog('v0','1');
//   // newOrder.forEach((ord,index) => {
//   //   order[index] = ord
//   //   // console.log(ord);
//   // })
//   let arrey = {}
//   newOrder.forEach( async (ord,index) => {
//     // order[index] = ord
//     console.timeLog('v0','2');
//     if (Object.keys(arrey).length === 0) {
//       arrey = ord;
//       // console.log('b=',arrey);
//       console.timeLog('v0','3');
//       return
//     }
//     console.timeLog('v0','4');
//     // console.log('a=',arrey,'  ',ord);
//     const obnov_bids = Kolection(arrey.bids, ord.bids);
//     arrey.bids = obnov_bids.o;
//     const obnov_asks = Kolection(arrey.asks, ord.asks);
//     arrey.asks = obnov_asks.o;
//     let obnov
//     if (index === 100) obnov = { bids: obnov_bids.o, asks: obnov_asks.o }
//     else obnov = { bids: obnov_bids.a, asks: obnov_asks.a }
//     console.timeLog('v0','5');
//     const newContact = await Norder.create(obnov);
//     // await Norder.create(obnov);
//     // console.timeLog('v0','6');
//     console.log('obn=',obnov.bids.length,'  ',newContact.bids.length,'  ',index);
    
//     // console.timeLog('v0','7');
//     // if (index === 2) {
//     //   console.log(obnov);
//     //   return
//     // }
//   })
//   // console.timeLog('v0','2');
//   // const one = order[2].bids[0]
//   // Perebor(order, 1, 2)
//   // Poick(order,2)
//   // const obnov_bids = Kolection(order[1].bids, order[2].bids);
//   // const obnov_asks = Kolection(order[1].asks, order[2].asks);
//   // const obnov = { bids: obnov_bids.a, asks: obnov_asks.a }
//   // console.timeLog('v0','3');
//   // const newContact = await Norder.create(obnov)
// // console.timeLog('v0','4');
//   // console.log(obnov);
// }

module.exports = OrderNew;
