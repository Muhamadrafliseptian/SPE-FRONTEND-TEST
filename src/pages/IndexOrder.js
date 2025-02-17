import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export class IndexOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken:
        "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InJhZmxpc2VwdGlhbm5uMjVAZ21haWwuY29tIiwiaWF0IjoxNzM5Nzk4OTE1LCJleHAiOjE3Mzk4MDc5MTV9.L2pMor6NxXfpeWCenk9OU9sOun305jCTR5DhhAoH3J4",
      productData: [],
      orders: [],
      selectedProduct: null,
      quantity: 1,
      showModal: false,
    };
  }

  componentDidMount() {
    this.getProductList();
  }

  async getProductList() {
    try {
      const headers = { Authorization: `Bearer ${this.state.authToken}` };
      const response = await axios.get(
        "https://recruitment-spe.vercel.app/api/v1/products",
        { headers }
      );
      if (response.data) {
        this.setState({ productData: response.data });
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
  }

  handleOrderClick = () => {
    this.setState({ showModal: true, selectedProduct: null, quantity: 1 });
  };

  handleProductChange = (event) => {
    const productId = event.target.value;
    const selectedProduct = this.state.productData.find(
      (product) => product.id === productId
    );
    this.setState({ selectedProduct });
  };

  handleQuantityChange = (event) => {
    const quantity = parseInt(event.target.value, 10) || 1;
    this.setState({ quantity });
  };

  handleSaveOrder = () => {
    const { selectedProduct, quantity, orders } = this.state;
    if (!selectedProduct) return;

    const newOrder = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity,
      subtotal: selectedProduct.price * quantity,
      description: selectedProduct.description,
      url_image: selectedProduct.url_image,
    };

    if (newOrder.quantity > selectedProduct.stock) {
      alert(
        `Maaf stock ${selectedProduct.name} tersisa ${selectedProduct.stock}. mohon kurangi jumlah quantity nya. terima kasih`
      );
      return;
    }

    this.setState({
      orders: [...orders, newOrder],
      showModal: false,
    });
  };

  handleIncreaseQuantity = (orderId) => {
    this.setState((prevState) => ({
      orders: prevState.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              quantity: order.quantity + 1,
              subtotal: order.price * (order.quantity + 1),
            }
          : order
      ),
    }));
  };

  handleDecreaseQuantity = (orderId) => {
    const order = this.state.orders.find((o) => o.id === orderId);

    if (order.quantity === 1) {
      if (window.confirm(`Are you sure you want to remove ${order.name}?`)) {
        this.setState((prevState) => ({
          orders: prevState.orders.filter((o) => o.id !== orderId),
        }));
      }
    } else {
      this.setState((prevState) => ({
        orders: prevState.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                quantity: o.quantity - 1,
                subtotal: o.price * (o.quantity - 1),
              }
            : o
        ),
      }));
    }
  };

  getTotalSubtotal = () => {
    return this.state.orders.reduce((acc, order) => acc + order.subtotal, 0);
  };

  render() {
    const { productData, orders, selectedProduct, quantity, showModal } =
      this.state;

    return (
      <div className="container ms-5 mt-5">
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-sm btn-dark mb-3"
            onClick={this.handleOrderClick}
          >
            Add Order
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Image</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Sub total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.name}</td>
                    <td>
                      <img
                        src={order.url_image}
                        alt={order.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{order.description}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger me-1"
                        onClick={() => this.handleDecreaseQuantity(order.id)}
                      >
                        -
                      </button>
                      {order.quantity}
                      <button
                        className="btn btn-sm btn-success ms-1"
                        onClick={() => this.handleIncreaseQuantity(order.id)}
                      >
                        +
                      </button>
                    </td>
                    <td>Rp {order.price.toLocaleString()}</td>
                    <td>Rp {order.subtotal.toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => this.handleDecreaseQuantity(order.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    Belum ada order
                  </td>
                </tr>
              )}
            </tbody>
            {orders.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end fw-bold">
                    Total
                  </td>
                  <td colSpan="4" className="fw-bold">
                    Rp {this.getTotalSubtotal().toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {showModal && (
          <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Tambah Order</h5>
                  <button
                    className="btn-close"
                    onClick={() => this.setState({ showModal: false })}
                  ></button>
                </div>
                <div className="modal-body text-start">
                  <div className="mb-3">
                    <label className="form-label">Nama Produk</label>
                    <select
                      className="form-select"
                      onChange={this.handleProductChange}
                    >
                      <option value="">Choose...</option>
                      {productData.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedProduct && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Harga satuan</label>
                        <input
                          type="text"
                          className="form-control"
                          value={`Rp ${selectedProduct.price.toLocaleString()}`}
                          readOnly
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Quantity</label>
                        <input
                          type="number"
                          className="form-control"
                          value={quantity}
                          min="1"
                          onChange={this.handleQuantityChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Total</label>
                        <input
                          type="text"
                          className="form-control"
                          value={`Rp ${(
                            selectedProduct.price * quantity
                          ).toLocaleString()}`}
                          readOnly
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => this.setState({ showModal: false })}
                  >
                    Batal
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={this.handleSaveOrder}
                    disabled={!selectedProduct}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default IndexOrder;
