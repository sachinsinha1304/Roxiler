import React, { useState, useEffect } from 'react'
import './App.css';
import axios from 'axios';
import PieChart from './components/PieChart';
import BarChart from './components/BarChart';

function App() {
  const [search, setSearch] = useState('')
  const [month, setMonth] = useState('March')
  const [table, setTable] = useState()
  const [pieData, setPieData] = useState([])
  const [barData, setBarData] = useState([])
  const [sold, setSold] = useState()
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  // const [transaction, setTransaction] = useState([])
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  useEffect(()=>{
    const fetch_data = async ()=>{
      try {
        const response = await axios.get(`http://localhost:3001/route/total-details?search=${search}&pageNo=${pageNo}&pageSize=${pageSize}&month=${month}`);
        console.log(response.data)
        setTable(response.data['table']) // The response data
        setPieData(response.data['category_data'])
        setBarData(response.data['bar_data'])
        setSold(response.data['sold_data'])
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetch_data()
    
  }, [search, month, pageNo, pageSize])

  const pageChange = (num)=>{
    let temp = pageNo + num
    if (temp < 1){
      setPageNo(1);
    }
    else{
      setPageNo(temp)
    }
  }

  const date_in_timezone = (dateInMillis) =>{
    const date = new Date(dateInMillis);

    // Convert to a specific timezone (e.g., 'America/New_York')
    const formattedDate = date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    return formattedDate;
  }

  return (
    <div>
      <h3 className='main-heading'>Transaction Dashboard</h3>
      <div className='row filter-container'>
        <div className='col-3'>
          <input type="text" className="form-control" onChange={(e)=>setSearch(e.target.value)} value={search} placeholder='Search Transaction' />
        </div>
        <div className='col-5'></div>
        <div className='col-3'>
          <select className='form-select' onChange={(e)=>setMonth(e.target.value)}>
            {months.map((ele,index)=><option key={index} value={ele} selected={ele===month?true:false}>{ele}</option>)}
          </select>
        </div>
      </div>
      <div className="table-responsive  table-container">
        <table className="table table-dark">
          <thead>
            <tr className="table-warning">
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Sold</th>
              <th scope="col">dateOfSale</th>
              <th scope="col">Image</th>
            </tr>
          </thead>
          <tbody>
            {table && table.map((ele, index)=>
            <tr className="table-warning" key={index}>
                <td>{ele.id}</td>
                <td>{ele.title}</td>
                <td>{ele.description}</td>
                <td>{ele.category}</td>
                <td>{ele.price}</td>
                <td>{ele.sold === 1 ? 'Yes' : 'No'}</td>
                <td>{date_in_timezone(ele.dateOfSale)}</td>
                <td><img src={ele.image} /></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className='page-container'>
        <div><strong>Page No - {pageNo}</strong></div>
        <div>
          <strong onClick={()=>pageChange(-1)}>Prev  </strong> - 
          <strong onClick={()=>pageChange(1)}>Next</strong>
        </div>
        <div><strong>Per Page </strong><input type='number' className='page-input' onChange={(e)=>{setPageSize(e.target.value)}} value={pageSize} /></div>
      </div>
      <div className='statistics'>
        <h3>Statistics - {month}</h3>
        <div className='statistics-container'>
          {console.log(sold)}
            <strong>Total Sale Amount</strong> - {sold && sold[0]['total_sold_price']} <br />
            <strong>Total item Sold</strong> - {sold && sold[0]['total_sold_items']} <br />
            <strong>Total item unsold</strong> - {sold && sold[0]['total_unsold_items']} <br />
        </div>
      </div>
      <div>
          <PieChart pie_data={pieData} month={month} />
      </div>
      <div>
          <BarChart bar_data={barData} month={month} />
      </div>
    </div>
  );
}

export default App;
