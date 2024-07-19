import {React, useState,useEffect} from 'react'
import Header from "../components/Header"
import Cards from '../components/Cards/card'
import { db,auth } from '../firebase';
import { toast } from 'react-toastify';
import { Modal,Card,Row } from 'antd';
import { Line, Pie } from "@ant-design/charts";
import { addDoc, collection,query,getDocs } from 'firebase/firestore';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { doc, getDoc } from "firebase/firestore";
import {  useAuthState} from 'react-firebase-hooks/auth';
import Charts from '../components/Charts/charts';
import axios from "axios";
import moment from "moment";
import Tables from '../components/Tables/transactionstable';
import tran from "../assets/transactions.svg";
import PlaidLink from '../components/Plaid_link/plaidlink.jsx';
import NestedList from '../components/account_list/list.js';

function Dashboard() {
const [user] = useAuthState(auth)
const [isExpensiveModalVisible, setIsExpensiveModalVisible] = useState(false);
const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
const [transactions, setTransaction] = useState([]);
const [income, setIncome] = useState()
const [expense, setExpense] = useState()
const [totalBalance, setTotalBalance] = useState()
const apiUrl = process.env.REACT_APP_API_URL;

const [loading, setLoading] = useState(false);
const showExpensiveModal = () => {
  setIsExpensiveModalVisible(true)
}
const showIncomeModal = () => {
  setIsIncomeModalVisible(true)
}
const handleExpensiveCancel = () => {
  setIsExpensiveModalVisible(false)
}
const handleIncomeCancel = () => {
  setIsIncomeModalVisible(false)
}

useEffect(() => {
  fetchT()
}, [user])
useEffect(() => {
 calculate();
}, [transactions])

async function calculate(){
  let t = 0;
  let it = 0;
  let et = 0;
  let aet = 0;
  transactions.forEach((transactions) => {
    
    if (transactions.type === "income"){
      it += transactions.amount;
    } else {
      et += transactions.amount;
    }
    }
  );
  setIncome(it);
  setExpense(et);
  // const querySnapshot = await getDocs(collection(db, `users/${user.uid}/accounts`));
  //  querySnapshot.docs.map(doc => t+= (doc.data().balance));
  setTotalBalance(it - et)

};


async function fetchT(){
  setLoading(true);
  if (user){
    const q = query(collection(db, `users/${user.uid}/transactions`))
    const querySnapshot = await getDocs(q);
    let transactionsArray = [];
    querySnapshot.forEach((doc) => {
      transactionsArray.push(doc.data())

    })
    const querysnapshot = await getDocs(collection(db, `users/${user.uid}/accounts`));
    
    const docs = querysnapshot.docs.map(doc =>  ({name: doc.id, 
      data: doc.data()})
  );
    console.log(docs)
    const data = docs.map((d) => ({name: d.name, 
        transactions: d.data.transactions}))
    data.map((d) => {d.transactions.map((i) => { var obj = {
        type:"expense",
        date: i.date,
        amount: i.amount,
        tag:d.name + " Spending",
        name:i.name,
      }
      
      transactionsArray.push(obj)
    })
      
     })
    setTransaction(transactionsArray);
   
  }
  setLoading(false);
}


const onFinish = (values, type) =>{
  console.log("onFinsigh",values,type)
const newTrans = {
  type:type,
  date: values.date.format("YYYY-MM-DD"),
  amount: parseFloat(values.amount),
  tag:values.tag,
  name:values.name,
};
  console.log("onFinsigh",values,type)
  addTrans(newTrans);

};


async function addTrans(trans){
try{
  const docRef = await addDoc(
collection(db, `users/${user.uid}/transactions`),trans
  );
  console.log("Document written with ID: ", docRef.id);
  
    toast.success("Transaction Added!")
    let NA = transactions;
    NA.push(trans);
    setTransaction(NA)
    calculate();
  
} catch (e) {
  console.error("Error adding document: ",e);
 
    toast.error("Couldn't add transaction")
  

}

}
const processChartData = () => {
  const balanceData = [];
  const spendingData = {};

  transactions.forEach((transaction) => {
    const monthYear = moment(transaction.date).format("MMM YYYY");
    const tag = transaction.tag;

    if (transaction.type === "income") {
      if (balanceData.some((data) => data.month === monthYear)) {
        balanceData.find((data) => data.month === monthYear).balance +=
          transaction.amount;
      } else {
        balanceData.push({ month: monthYear, balance: transaction.amount });
      }
    } else {
      if (balanceData.some((data) => data.month === monthYear)) {
        balanceData.find((data) => data.month === monthYear).balance -=
          transaction.amount;
      } else {
        balanceData.push({ month: monthYear, balance: -transaction.amount });
      }

      if (spendingData[tag]) {
        spendingData[tag] += transaction.amount;
      } else {
        spendingData[tag] = transaction.amount;
      }
    }
  });

  const spendingDataArray = Object.keys(spendingData).map((key) => ({
    category: key,
    value: spendingData[key],
  }));

  return { balanceData, spendingDataArray };
};
const { balanceData, spendingDataArray } = processChartData();

const balanceConfig = {
  data: balanceData,
  xField: "month",
  yField: "balance",
};
const containerStyle = {
  display: 'flex',
  // justifyContent: 'space-between',
  alignItems: 'center',
};

const spendingConfig = {
  data: spendingDataArray,
  angleField: "value",
  colorField: "category",
};
const componentStyle = {
  flex: 1,
  padding: '10px',
  margin: '10px',
  border: '1px solid #000',
  textAlign: 'center',
  backgroundColor: '#f0f0f0',
};

const cardStyle = {
  boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
  margin: "2rem",
  borderRadius: "0.5rem",
  minWidth: "400px",
  flex: 1,
};




  return (
    <div>
      <Header/>

      {loading ? ( <p> loading...</p> ) : (

<>
<div style={containerStyle}>
<NestedList/>
<PlaidLink/>
    </div>

        <Cards
        income={income}
        expense={expense}
        totalBalance={totalBalance}
      showExpensiveModal={showExpensiveModal}
      showIncomeModal={showIncomeModal}
      
      />
     
      <AddIncomeModal isIncomeModalVisible={isIncomeModalVisible}
      title="Add Income" handleIncomeCancel={handleIncomeCancel} onFinish={onFinish}/>
       <AddExpenseModal isExpenseModalVisible={isExpensiveModalVisible}
     title="Add Expense" handleExpenseCancel={handleExpensiveCancel} onFinish={onFinish}/> 
     
     
    {transactions.length!=0?<>
  
              <Row gutter={16}>
                <Card bordered={true} style={cardStyle}>
                  <h2>Financial Statistics</h2>
                  <Line {...{ ...balanceConfig, data: balanceData }} />
                </Card>

                <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
                  <h2>Total Spending</h2>
                  {spendingDataArray.length == 0 ? (
                    <p>Seems like you haven't spent anything till now...</p>
                  ) : (
                    <Pie {...{ ...spendingConfig, data: spendingDataArray }} />
                  )}
                </Card>
              </Row>
            </>: <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        marginBottom: "2rem",
      }}
    >
      <img src={tran} style={{ width: "400px", margin: "4rem" }} />
      <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
        You Have No Transactions Currently
      </p>
    </div>}
      <Tables transactions={transactions} />
       </>
     
      )}
      </div>
  )
}

export default Dashboard