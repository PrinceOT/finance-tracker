import {React, useState} from 'react'
import { Table ,Select,Radio} from 'antd';
import {unparse, parse} from "papaparse"
import { toast } from 'react-toastify';


import SI from "../../assets/search.svg"


function Tables ({transactions,exportCSV,fetchT,addTrans}) {
  const {Option} = Select
  const [search,setSearch] = useState("");
  const [typeFilter,setTypeFilter] = useState("");
  const [sortKey,setSortKey] = useState();
    const columns = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: 'Tag',
        dataIndex: 'tag',
        key: 'tag',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      }];

      let filter = transactions.filter((item)=> item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter))

      let sort = filter.sort((a,b)=> {
        if (sortKey === "date") {
          return new Date(a.date) - new Date(b.date);
          } else if (sortKey === "amount") {
          return a.amount - b.amount;
          } else {
          return 0;
          }
      });


       function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          // Now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            // Write each transaction to Firebase, you can use the addTransaction function here
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseInt(transaction.amount),
            };
            await addTrans(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchT();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }
      function exportCSV(){
        var csv = unparse({
      fields: ["name","type","tag","date","amount"],
      data:transactions,
    
        });
        var data = new Blob([csv], {type:"text/csv;charset=utf-8;"});
        var csvURL = URL.createObjectURL(data);
        const tempLink = document.createElement("a");
        tempLink.href = csvURL;
        tempLink.download = "transactions.csv";
        document.body.appendChild(tempLink)
        
        tempLink.click()
        document.body.removeChild(tempLink)

      }

      return (
     
       <div 
        style={{width:"95%", padding: "0rem 2rem",}}> 
          <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className='input-flex'> 
          <img src={SI} width="16"/>
<input value={search} onChange={(e)=> setSearch(e.target.value)} placeholder='search by Namw'/>

        </div>
        

        <Select className="select-input" onChange={(value)=> setTypeFilter(value)} value={typeFilter} placeholder="Filter" allowClear>
          <Option value=''>ALL</Option>
          <Option value='income'>Income</Option>
          <Option value='expense'>Expense</Option>
      </Select>
      </div>

      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>
      <Radio.Group
      className="input-radio"
onChange={(e) =>
setSortKey(e.target.value)}
value={sortKey}>
<Radio.Button value="">No Sort</Radio.Button>
<Radio.Button value="date"> Sort by Date</Radio.Button>
 <Radio.Button value="amount"> Sort by Amount</Radio.Button>
 
      </Radio.Group>
      <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={exportCSV}>
              Export to CSV
            </button>
            <label for="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              onChange={importFromCsv}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>
      
      <Table dataSource={sort} columns={columns} /></div></div>
      );
}

export default Tables;