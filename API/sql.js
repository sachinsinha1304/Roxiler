const mysql = require('mysql2');

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database : 'roxilier'
});

const createDatabase = (data, next) =>{
    return new Promise((resolve, reject)=>{
        con.connect(function(err) {
            if (err) throw err;
            let sql = 'create table if not exists items(id int primary key,title text, price float(24), description text, category text, image text, sold boolean, dateOfSale bigint)';
            con.query(sql,  (err, result)=> {
                if (err) next(err);
                console.log("Table created");
                for(let x of data['data']){
                    // console.log(x.description)
                    let dt = new Date(x.dateOfSale)
                    con.query(`insert into items(id, title,price,description,category,image, sold,dateOfSale) values(${x.id}, "${x.title}", ${x.price}, "${x.description}", "${x.category}", "${x.image}", ${x.sold}, ${dt.getTime()})`,(err, result)=>{
                        if (err) next(err)
                        console.log(result)
                        
                    })
                }
              });
            resolve('success')
          });
    })
}

const execute = (sql, next) =>{
    return new Promise((resolve, reject)=>{
        con.query(sql, (err, result)=>{
            if(err) next(err)
            resolve(result)
        })
    })
}

module.exports = { createDatabase, execute }

