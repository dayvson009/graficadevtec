const pg = require('pg')

// const postgres = new pg.Client('postgres://njddiiepratdkm:81334f3ac0d43079d071c73b92b1ce1c2a82945cae9f8b60a09f6db19499a054@ec2-52-7-159-155.compute-1.amazonaws.com:5432/d3vfndamrh71f2')

const postgres = new pg.Client({
  type: 'postgres'
  ,host: 'ec2-52-7-159-155.compute-1.amazonaws.com'
  ,user: 'njddiiepratdkm'
  ,password: '81334f3ac0d43079d071c73b92b1ce1c2a82945cae9f8b60a09f6db19499a054'
  ,database: 'd3vfndamrh71f2'
  ,port: '5432'
  ,ssl: { rejectUnauthorized: false }
  // ,extra: {
  //   ssl: {
  //     require: true,
  //   }
  // }
})



module.exports = postgres