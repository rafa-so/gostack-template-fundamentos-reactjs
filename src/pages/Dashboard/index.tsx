import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface TransactionObject {
  id: string;
  title: string;
  value: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: string;
}

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');
      const { balance, transactions } = response.data;

      const new_transactions = transactions.map((transaction: TransactionObject) => {
        const new_transaction: Transaction = {
          id: transaction.id,
          title: transaction.title,
          value: parseInt(transaction.value, 10),
          formattedValue: transaction.type === 'outcome' ? `- ${formatValue(parseInt(transaction.value, 10))}` : formatValue(parseInt(transaction.value, 10)),
          formattedDate: new Date(transaction.created_at).toLocaleDateString('pt-BR'),
          type: transaction.type,
          category: { title: transaction.category.title },
          created_at: new Date(transaction.created_at)
        };

        return new_transaction
      })

      setTransactions(new_transactions);

      const new_balance: Balance = {
        income: formatValue(parseInt(balance.income, 10)),
        outcome: formatValue(parseInt(balance.outcome, 10)),
        total: formatValue(parseInt(balance.total, 10))
      }

      setBalance(new_balance);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{ balance.income }</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{ balance.outcome }</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{ balance.total }</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              { transactions && 
                transactions.map(transaction => {
                  return (
                    <tr key={ transaction.id }>
                      <td className="title">{ transaction.title }</td>
                      <td className={`${transaction.type}`}>
                        { transaction.formattedValue }
                      </td>
                      <td>{ transaction.category.title }</td>
                      <td>{ new Date(transaction.created_at).toLocaleDateString('pt-BR') }</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
