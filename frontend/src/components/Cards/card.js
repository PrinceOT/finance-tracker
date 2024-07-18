import { Card, Row } from 'antd'
import "./card.css"
import React from 'react'
import Button from '../Button/button'

function Cards({income,expense,totalBalance,showExpensiveModal,showIncomeModal}) {
  return (
    <div><Row className='my-row'> 
        <Card className='my-card' title="Current Balance"> <p>£{totalBalance}</p>
        <Button text="Reset Balance" blu={true}></Button>
        
        </Card>
        <Card className='my-card' title="Total Income"> <p>£{income}</p>
        <Button text="Add Income" blu={true} onClick={showIncomeModal}></Button>
        
        </Card>
        <Card className='my-card' title="Total Expenses"> <p>£{expense}</p>
        <Button text="Add Expense" blu={true} onClick={showExpensiveModal}></Button>
        
        </Card>
        
        
        </Row></div>
  )
}

export default Cards