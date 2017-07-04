const Index = require('./index')
const IDS = ["5XLaA8t0Fkw"]
const BUCKET = `gs://orchard-lane/`
Index(IDS, BUCKET).then(r=>{
  console.log(r);
})