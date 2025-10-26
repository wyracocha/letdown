import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner, Card } from 'react-bootstrap';

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Guardar timestamp de expiración (1 hora desde ahora)
        const expirationTime = Date.now() + (60 * 60 * 1000); // 1 hora en milisegundos
        localStorage.setItem('tokenExpiration', expirationTime.toString());
        onLogin();
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch {
      setError('Error de conexión');
    }
    setLoading(false);
  };

  return (
    <Container fluid className="admin-login-container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'black', position: 'relative' }}>
      {loading && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner animation="border" variant="primary" style={{ width: 64, height: 64 }} />
        </div>
      )}
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5} xl={4}>
          <Card className="shadow-lg border-0" style={{ background: '#fff', borderRadius: 24, padding: '32px 0' }}>
            <Card.Body className="px-4 py-4 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
              <div className="d-flex flex-column align-items-center mb-4 w-100">
                <img src="/logo.png" alt="Logo" style={{ width: 200, marginBottom: 12, backgroundColor: 'black', padding: '10px', borderRadius:'8px' }} />
                <p className="text-center mb-0" style={{ color: '#555', fontSize: '1rem' }}>Ingresa tus credenciales para continuar</p>
              </div>
              <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Group className="mb-3" controlId="formUser">
                  <Form.Label style={{ color: '#222', fontWeight: 500 }}>Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Usuario"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    required
                    autoFocus
                    style={{ background: '#f7f7f7', color: '#222', border: '1px solid #ccc', borderRadius: 12, fontSize: '1.1rem' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label style={{ color: '#222', fontWeight: 500 }}>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ background: '#f7f7f7', color: '#222', border: '1px solid #ccc', borderRadius: 12, fontSize: '1.1rem' }}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="w-100"
                  style={{
                    background: 'linear-gradient(90deg, #287cfa 0%, #0056b3 100%)',
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    padding: '10px 0',
                    color: '#fff',
                  }}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Ingresar'}
                </Button>
                {error && <Alert variant="danger" className="mt-3 text-center" style={{ borderRadius: 12 }}>{error}</Alert>}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
