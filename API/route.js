const express = require('express');
const router = express.Router();


const { execute } = require('./sql')

router.get('/',async (req, res, next)=>{
    const pageNo = req.query.pageNo === '' ? 1 : parseInt(req.query.pageNo)
    const pageSize = req.query.pageSize === '' ? 10 : parseInt(req.query.pageSize)
    const search = req.query.search === '' ? " ": req.query.search;
    const month = req.query.month === '' ? "March": req.query.month;
    let sql = `select * from items where ((monthname(from_unixtime(dateOfSale/1000)) = '${month}') and (description like '%${search}%' or title like '%${search}%' or price like '%${search}%')) limit ${pageSize} offset ${(pageNo-1)*pageSize}`
    let data =  await execute(sql, next)
    res.json(await data)
})

router.get('/category',async (req, res, next)=>{
    const month = req.query.name === '' ? 'March' : req.query.name
    let sql = `select category, count(*) from items where monthname(from_unixtime(dateOfSale/1000)) = '${month}' group by category;`
    let data =  await execute(sql, next)
    res.json(await data)
})

router.get('/statistics',async (req, res, next)=>{
    const month = req.query.name === '' ? 'March' : req.query.name
    let sql = `SELECT 
    SUM(sold) AS total_sold_items,
        SUM(CASE WHEN sold = 1 THEN price ELSE 0 END) AS total_sold_price,
        COUNT(CASE WHEN sold = 0 THEN 1 END) AS total_unsold_items
    FROM 
    items where monthname(from_unixtime(dateOfSale/1000)) = '${month}';`
    let data =  await execute(sql, next)

    res.json(await data)
})

router.get('/bar-graph', async(req, res, next)=>{
    const month = req.query.name === '' ? 'March' : req.query.name
    let sql = `SELECT 
                CASE 
                    WHEN price BETWEEN 0 AND 100 THEN '0 - 100'
                    WHEN price BETWEEN 101 AND 200 THEN '101 - 200'
                    WHEN price BETWEEN 201 AND 300 THEN '201 - 300'
                    WHEN price BETWEEN 301 AND 400 THEN '301 - 400'
                    WHEN price BETWEEN 401 AND 500 THEN '401 - 500'
                    WHEN price BETWEEN 501 AND 600 THEN '501 - 600'
                    WHEN price BETWEEN 601 AND 700 THEN '601 - 700'
                    WHEN price BETWEEN 701 AND 800 THEN '701 - 800'
                    WHEN price BETWEEN 801 AND 900 THEN '801 - 900'
                    ELSE '901 - above'
                END AS price_range,
                COUNT(*) AS count
            FROM items where monthname(from_unixtime(dateOfSale/1000)) = '${month}'
            GROUP BY price_range
            ORDER BY MIN(price)
            `
    let data =  await execute(sql, next)
    res.json(await data)
})


router.get('/total-details', async(req, res, next)=>{
    const pageNo = req.query.pageNo === '' ? 1 : parseInt(req.query.pageNo)
    const pageSize = req.query.pageSize === '' ? 10 : parseInt(req.query.pageSize)
    const search = req.query.search === '' ? " ": req.query.search;
    const month = req.query.month === '' ? "March": req.query.month;
    let sql = `select * from items where ((monthname(from_unixtime(dateOfSale/1000)) = '${month}') and (description like '%${search}%' or title like '%${search}%' or price like '%${search}%')) limit ${pageSize} offset ${(pageNo-1)*pageSize}`
    let table_data =  await execute(sql, next)

    sql = `SELECT 
    SUM(sold) AS total_sold_items,
        SUM(CASE WHEN sold = 1 THEN price ELSE 0 END) AS total_sold_price,
        COUNT(CASE WHEN sold = 0 THEN 1 END) AS total_unsold_items
    FROM 
    items where monthname(from_unixtime(dateOfSale/1000)) = '${month}';`
    let sold_data =  await execute(sql, next)

    sql = `SELECT 
                CASE 
                    WHEN price BETWEEN 0 AND 100 THEN '0 - 100'
                    WHEN price BETWEEN 101 AND 200 THEN '101 - 200'
                    WHEN price BETWEEN 201 AND 300 THEN '201 - 300'
                    WHEN price BETWEEN 301 AND 400 THEN '301 - 400'
                    WHEN price BETWEEN 401 AND 500 THEN '401 - 500'
                    WHEN price BETWEEN 501 AND 600 THEN '501 - 600'
                    WHEN price BETWEEN 601 AND 700 THEN '601 - 700'
                    WHEN price BETWEEN 701 AND 800 THEN '701 - 800'
                    WHEN price BETWEEN 801 AND 900 THEN '801 - 900'
                    ELSE '901 - above'
                END AS price_range,
                COUNT(*) AS count
            FROM items where monthname(from_unixtime(dateOfSale/1000)) = '${month}'
            GROUP BY price_range
            ORDER BY MIN(price)
            `
    let bar_data =  await execute(sql, next)
    sql = `select category, count(*) from items where monthname(from_unixtime(dateOfSale/1000)) = '${month}' group by category;`
    let category_data =  await execute(sql, next)
    res.json({'table':table_data, 'sold_data':sold_data, 'bar_data':bar_data, 'category_data':category_data})

})

module.exports = router