import React, { useState, useEffect } from "react";
import { Table, Spinner, Container, Badge } from "react-bootstrap";
import { format } from "date-fns";
import { BASE_URL } from "../../../Utils/config";
import { useSelector } from "react-redux";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const shopId = useSelector((state) => state.shop.shopId);
  const token = sessionStorage.getItem("access_token");

useEffect(() => {
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/api/provider/transactions/?page=${pagination.current}&size=${pagination.pageSize}&sortBy=id&direction=ASC&shopId=${shopId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTransactions(data.content);
      setPagination({
        ...pagination,
        total: data.totalElements,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTransactions();
}, [pagination.current, pagination.pageSize, shopId, token]); // Added dependencies
  const getStatusBadge = (status) => {
    switch (status) {
      case "SUCCESS":
        return <Badge bg="success">Success</Badge>;
      case "PENDING":
        return <Badge bg="warning">Pending</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodBadge = (method) => {
    switch (method) {
      case "VNPAY":
        return <Badge bg="info">VNPAY</Badge>;
      case "DEBT":
        return <Badge bg="primary">Debt</Badge>;
      default:
        return <Badge bg="secondary">{method}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Transaction List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Bank</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction?.transactionId}</td>
              <td>{transaction?.order?.id}</td>
              <td>{transaction?.amount.toLocaleString()}VNĐ</td>
              <td>{transaction.bankCode}</td>
              <td>{getPaymentMethodBadge(transaction?.paymentProvider)}</td>
              <td>{getStatusBadge(transaction?.status)}</td>
              <td>
                {format(
                  new Date(transaction?.paymentDate),
                  "MMM dd, yyyy HH:mm"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Transaction;
