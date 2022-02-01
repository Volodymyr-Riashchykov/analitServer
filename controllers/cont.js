


function Perebor(order, last, next) {
    let k = 1;
        order[next].bids.forEach((one,ind) => {
  const comp = order[last].bids.find((f,i) => {
    // 
    if (f[0] === one[0]&&f[1] === one[1]) {
      console.log('i=',k,'  ', i, ' ', ind, ' ', f);
      k++;
      return f
    }
  })})
}
function Poick(order, curr) {
    let k = 1;
    order[curr].bids.forEach((one, ind) => {
            // const one_ = one[0]
  const comp = order[curr].bids.filter((f,i) => {
    // 
    if (f[0] === one[0]&& i!==ind) {
      console.log('i=',k,'  ', i, ' ', ind, ' ', f);
      k++;
      return f
    }
  })
    })
    console.log('c=');
}
function Kolection( last, next) {
  let k = 1;
  const arr = []
  last.forEach((one, ind) => {
    if (typeof one[2] === 'undefined') one[2] = 0;
    const comp = next.find((f, i) => {
      if (typeof f[2] === 'undefined') f[2] = 0;
      if (f[0] === one[0]&&f[1] === one[1]) {
        // console.log('i=',k,'  ', i, ' ', ind, ' ', f,'  ',one);
        // k++;
        f[2]=one[2]+1;
        // 
        // order[1].bids.splice(ind,1) 
        return f
      }
    
  })
          // one[kol] = 0;
          // one.push(0)
        // if(!one[2])  one[2] = 0
    if(!comp)arr.push(one)
    // console.log('comp=', comp);
        })
  return {o:next,a:arr}
}
module.exports = {
    Perebor,
  Poick,
    Kolection,
}