import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("smart-shopping-list");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    name: "",
    category: "Mercado",
    quantity: 1,
    price: "",
  });

  useEffect(() => {
    localStorage.setItem("smart-shopping-list", JSON.stringify(items));
  }, [items]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function addItem(e) {
    e.preventDefault();

    if (!form.name.trim()) return;

    const newItem = {
      id: Date.now(),
      name: form.name,
      category: form.category,
      quantity: Number(form.quantity),
      price: Number(form.price) || 0,
      bought: false,
    };

    setItems([...items, newItem]);

    setForm({
      name: "",
      category: "Mercado",
      quantity: 1,
      price: "",
    });
  }

  function removeItem(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  function toggleBought(id) {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, bought: !item.bought }
          : item
      )
    );
  }

  function clearList() {
    setItems([]);
  }

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const boughtItems = items.filter((item) => item.bought).length;

  const formatPrice = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: Inter, Arial, sans-serif;
          background: #f4f5f7;
          color: #18181b;
        }

        button,
        input,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .app {
          min-height: 100vh;
          padding: 40px 20px;
        }

        .container {
          max-width: 1050px;
          margin: auto;
        }

        /* HEADER */

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 30px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .logo-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #18181b;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .logo span {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .header h1 {
          font-size: 36px;
          letter-spacing: -1px;
          margin-bottom: 7px;
        }

        .header p {
          color: #71717a;
          font-size: 15px;
        }

        .total-box {
          background: #18181b;
          color: white;
          padding: 20px 25px;
          border-radius: 18px;
          min-width: 200px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .total-box small {
          display: block;
          color: #a1a1aa;
          margin-bottom: 7px;
        }

        .total-box strong {
          font-size: 28px;
        }

        /* FORM */

        .form-card {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 20px;
          padding: 22px;
          margin-bottom: 20px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.03);
        }

        .form-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .form {
          display: grid;
          grid-template-columns: 2fr 1.2fr 0.7fr 1fr auto;
          gap: 12px;
          align-items: end;
        }

        .field label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #52525b;
          margin-bottom: 7px;
        }

        .field input,
        .field select {
          width: 100%;
          height: 44px;
          border: 1px solid #d4d4d8;
          border-radius: 10px;
          padding: 0 12px;
          outline: none;
          background: white;
        }

        .field input:focus,
        .field select:focus {
          border-color: #18181b;
        }

        .add-button {
          height: 44px;
          padding: 0 20px;
          border: none;
          border-radius: 10px;
          background: #18181b;
          color: white;
          font-weight: 700;
          transition: 0.2s;
        }

        .add-button:hover {
          transform: translateY(-1px);
          background: #27272a;
        }

        /* STATS */

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }

        .stat {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 16px;
          padding: 18px;
        }

        .stat-label {
          color: #71717a;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 800;
        }

        /* LIST */

        .list-card {
          background: white;
          border: 1px solid #e4e4e7;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.03);
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 22px;
          border-bottom: 1px solid #e4e4e7;
        }

        .list-header h2 {
          font-size: 18px;
        }

        .clear-button {
          border: none;
          background: transparent;
          color: #71717a;
          font-size: 13px;
        }

        .clear-button:hover {
          color: #18181b;
        }

        /* ITEM */

        .item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px 22px;
          border-bottom: 1px solid #f0f0f2;
          transition: 0.2s;
        }

        .item:last-child {
          border-bottom: none;
        }

        .item:hover {
          background: #fafafa;
        }

        .check {
          width: 25px;
          height: 25px;
          flex-shrink: 0;
          border-radius: 8px;
          border: 2px solid #d4d4d8;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .check.checked {
          background: #18181b;
          color: white;
          border-color: #18181b;
        }

        .item-main {
          flex: 1;
          min-width: 0;
        }

        .item-name {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .item-details {
          display: flex;
          gap: 8px;
          align-items: center;
          color: #71717a;
          font-size: 12px;
        }

        .category {
          background: #f4f4f5;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .item-price {
          text-align: right;
          min-width: 110px;
        }

        .item-price strong {
          display: block;
          font-size: 15px;
        }

        .item-price small {
          color: #a1a1aa;
          font-size: 11px;
        }

        .delete {
          width: 34px;
          height: 34px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: #a1a1aa;
          font-size: 20px;
        }

        .delete:hover {
          background: #f4f4f5;
          color: #18181b;
        }

        .item.bought .item-name {
          text-decoration: line-through;
          color: #a1a1aa;
        }

        .empty {
          padding: 70px 20px;
          text-align: center;
        }

        .empty-icon {
          font-size: 45px;
          margin-bottom: 15px;
        }

        .empty h3 {
          margin-bottom: 7px;
        }

        .empty p {
          color: #71717a;
          font-size: 14px;
        }

        /* MOBILE */

        @media (max-width: 800px) {
          .header {
            flex-direction: column;
            align-items: stretch;
          }

          .total-box {
            width: 100%;
          }

          .form {
            grid-template-columns: 1fr 1fr;
          }

          .add-button {
            width: 100%;
          }
        }

        @media (max-width: 550px) {
          .app {
            padding: 25px 15px;
          }

          .header h1 {
            font-size: 29px;
          }

          .form {
            grid-template-columns: 1fr;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .item-price {
            min-width: auto;
          }

          .item {
            gap: 10px;
            padding: 15px;
          }
        }
      `}</style>

      <main className="app">
        <div className="container">

          <header className="header">
            <div>
              <div className="logo">
                <div className="logo-icon">🛒</div>
                <span>SMART SHOPPING</span>
              </div>

              <h1>Minha lista de compras</h1>

              <p>
                Organize seus produtos e acompanhe seus gastos.
              </p>
            </div>

            <div className="total-box">
              <small>Total estimado</small>

              <strong>
                {formatPrice(total)}
              </strong>
            </div>
          </header>

          {/* FORMULÁRIO */}

          <section className="form-card">

            <div className="form-title">
              Adicionar produto
            </div>

            <form className="form" onSubmit={addItem}>

              <div className="field">
                <label>Produto</label>

                <input
                  name="name"
                  type="text"
                  placeholder="Ex: Arroz"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Categoria</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>Mercado</option>
                  <option>Hortifruti</option>
                  <option>Bebidas</option>
                  <option>Limpeza</option>
                  <option>Higiene</option>
                  <option>Carnes</option>
                  <option>Padaria</option>
                  <option>Outros</option>
                </select>
              </div>

              <div className="field">
                <label>Quantidade</label>

                <input
                  name="quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Preço unitário</label>

                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>

              <button className="add-button" type="submit">
                + Adicionar
              </button>

            </form>
          </section>

          {/* ESTATÍSTICAS */}

          <section className="stats">

            <div className="stat">
              <div className="stat-label">
                Produtos
              </div>

              <div className="stat-value">
                {items.length}
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">
                Comprados
              </div>

              <div className="stat-value">
                {boughtItems}
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">
                Pendentes
              </div>

              <div className="stat-value">
                {items.length - boughtItems}
              </div>
            </div>

          </section>

          {/* LISTA */}

          <section className="list-card">

            <div className="list-header">

              <h2>Produtos</h2>

              {items.length > 0 && (
                <button
                  className="clear-button"
                  onClick={clearList}
                >
                  Limpar lista
                </button>
              )}

            </div>

            {items.length === 0 ? (

              <div className="empty">
                <div className="empty-icon">
                  🛍️
                </div>

                <h3>
                  Sua lista está vazia
                </h3>

                <p>
                  Adicione seu primeiro produto acima.
                </p>
              </div>

            ) : (

              items.map((item) => (

                <div
                  className={`item ${
                    item.bought ? "bought" : ""
                  }`}
                  key={item.id}
                >

                  <button
                    className={`check ${
                      item.bought ? "checked" : ""
                    }`}
                    onClick={() => toggleBought(item.id)}
                  >
                    {item.bought ? "✓" : ""}
                  </button>

                  <div className="item-main">

                    <div className="item-name">
                      {item.name}
                    </div>

                    <div className="item-details">

                      <span className="category">
                        {item.category}
                      </span>

                      <span>
                        {item.quantity} unidade
                        {item.quantity > 1 ? "s" : ""}
                      </span>

                    </div>

                  </div>

                  <div className="item-price">

                    <strong>
                      {formatPrice(
                        item.price * item.quantity
                      )}
                    </strong>

                    <small>
                      {formatPrice(item.price)} / un.
                    </small>

                  </div>

                  <button
                    className="delete"
                    onClick={() => removeItem(item.id)}
                    title="Remover produto"
                  >
                    ×
                  </button>

                </div>

              ))

            )}

          </section>

        </div>
      </main>
    </>
  );
}

export default App;