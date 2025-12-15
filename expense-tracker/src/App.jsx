import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import { 
  Restaurant, Commute, SportsEsports, ShoppingBag, Home, Category, Delete 
} from '@mui/icons-material';
import { 
  Container, Navbar, Row, Col, Card, Form, Button, Table, Badge, Alert, InputGroup 
} from 'react-bootstrap';

// Categories Configuration
const CATEGORIES = [
  { id: 'food', name: '飲食', icon: <Restaurant />, color: '#0088FE' },
  { id: 'transport', name: '交通', icon: <Commute />, color: '#00C49F' },
  { id: 'entertainment', name: '娛樂', icon: <SportsEsports />, color: '#FFBB28' },
  { id: 'shopping', name: '購物', icon: <ShoppingBag />, color: '#FF8042' },
  { id: 'housing', name: '居住', icon: <Home />, color: '#AF19FF' },
  { id: 'others', name: '其他', icon: <Category />, color: '#8884d8' },
];

const App = () => {
  // State
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(0);

  // Load data from LocalStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudget = localStorage.getItem('budget');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudget) {
      setBudget(parseFloat(savedBudget));
      setTempBudget(parseFloat(savedBudget));
    }
  }, []);

  // Save data to LocalStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budget', budget.toString());
  }, [budget]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date) return;

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      note: formData.note
    };

    setExpenses([newExpense, ...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)));
    setFormData({
      amount: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleBudgetUpdate = () => {
    setBudget(parseFloat(tempBudget));
    setIsEditingBudget(false);
  };

  // Calculations
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = budget - totalExpense;

  const chartData = CATEGORIES.map(cat => ({
    name: cat.name,
    value: expenses.filter(e => e.category === cat.id).reduce((acc, curr) => acc + curr.amount, 0),
    color: cat.color
  })).filter(item => item.value > 0);

  const getCategory = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[5];

  return (
    <div className="min-vh-100 bg-light">
      <Navbar bg="white" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand className="fw-bold text-primary">
            <Category className="me-2" />
            記帳小幫手
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        {/* Summary Section */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center">
              <Card.Body>
                <Card.Title className="text-muted">總支出</Card.Title>
                <h2 className="text-danger fw-bold">${totalExpense.toLocaleString()}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center">
              <Card.Body>
                <Card.Title className="text-muted">預算設定</Card.Title>
                {isEditingBudget ? (
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <Form.Control 
                      type="number" 
                      value={tempBudget} 
                      onChange={(e) => setTempBudget(e.target.value)}
                      style={{ width: '120px' }}
                    />
                    <Button variant="outline-success" size="sm" onClick={handleBudgetUpdate}>確認</Button>
                  </div>
                ) : (
                  <h2 
                    className="text-primary fw-bold cursor-pointer" 
                    onClick={() => setIsEditingBudget(true)}
                    style={{ cursor: 'pointer' }}
                    title="點擊編輯"
                  >
                    ${budget.toLocaleString()}
                  </h2>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center">
              <Card.Body>
                <Card.Title className="text-muted">預算剩餘</Card.Title>
                <h2 className={`fw-bold ${remainingBudget >= 0 ? 'text-success' : 'text-danger'}`}>
                  ${remainingBudget.toLocaleString()}
                </h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Left Column: Form & List */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white fw-bold text-primary border-bottom-0 pt-3">
                新增支出
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleAddExpense}>
                  <Row className="g-2">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>日期</Form.Label>
                        <Form.Control 
                          type="date" 
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>類別</Form.Label>
                        <Form.Select 
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>金額</Form.Label>
                        <Form.Control 
                          type="number" 
                          placeholder="輸入金額"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          min="0"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>備註</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="選填"
                          name="note"
                          value={formData.note}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Button variant="primary" type="submit" className="w-100">
                        新增紀錄
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white fw-bold text-primary border-bottom-0 pt-3">
                最近收支
              </Card.Header>
              <Card.Body className="p-0">
                <Table hover responsive className="mb-0 align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-4">日期</th>
                      <th>類別</th>
                      <th>備註</th>
                      <th>金額</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          尚無資料
                        </td>
                      </tr>
                    ) : (
                      expenses.map(expense => {
                        const cat = getCategory(expense.category);
                        return (
                          <tr key={expense.id}>
                            <td className="ps-4 text-muted small">{expense.date}</td>
                            <td>
                              <Badge 
                                bg="light" 
                                text="dark" 
                                className="d-inline-flex align-items-center gap-1 border"
                              >
                                <span style={{ color: cat.color }}>{cat.icon}</span>
                                {cat.name}
                              </Badge>
                            </td>
                            <td className="text-muted">{expense.note || '-'}</td>
                            <td className="fw-bold">${expense.amount.toLocaleString()}</td>
                            <td>
                              <Button 
                                variant="link" 
                                className="text-danger p-0"
                                onClick={() => handleDeleteExpense(expense.id)}
                              >
                                <Delete fontSize="small" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column: Chart */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white fw-bold text-primary border-bottom-0 pt-3">
                支出統計
              </Card.Header>
              <Card.Body>
                <div style={{ width: '100%', height: 300 }}>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => `$${value}`} />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                      尚無統計資料
                    </div>
                  )}
                </div>
                {chartData.length > 0 && (
                  <div className="mt-3">
                    {chartData.map(item => (
                      <div key={item.name} className="d-flex justify-content-between mb-2 small">
                        <span className="d-flex align-items-center gap-2">
                          <span 
                            style={{ 
                              width: 10, 
                              height: 10, 
                              borderRadius: '50%', 
                              backgroundColor: item.color 
                            }} 
                          />
                          {item.name}
                        </span>
                        <span className="fw-bold">${item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;