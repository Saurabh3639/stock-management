"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/product");
      let res = await response.json();
      setProducts(res.products);
    };
    fetchProducts();
  }, []);

  const buttonAction = async (action, name, initialQuantity) => {
    // Immediately change the quantity of the product with given name in products
    let index = products.findIndex((item) => item.name == name);
    console.log(index);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
      console.log(newProducts[index].quantity);
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);

    // Immediately change the quantity of the product with given name in dropdown
    let indexdrop = dropdown.findIndex((item) => item.name == name);
    console.log(indexdrop);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action == "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1;
      console.log(newDropdown[indexdrop].quantity);
    } else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);

    console.log(action, name);
    setLoading(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, name, initialQuantity }),
    });
    let res = await response.json();
    console.log(res);
    setLoading(false);
  };

  const addProduct = async (e) => {
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        console.log("Product added successfully");
        toast.success("Product added successfully");
      } else {
        console.error("Error while adding product");
        toast.error("Error while adding product");
      }
    } catch (error) {
      console.log("Error: " + error);
    }
    // Fetch all the products again to sync back
    const response = await fetch("/api/product");
    let res = await response.json();
    setProducts(res.products);
    e.preventDefault();
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownChange = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + query);
      let res = await response.json();
      setDropdown(res.products);
      setLoading(false);
    } else {
      setDropdown([]);
    }
  };

  return (
    <>
      <Header />
      <Toaster />

      <div className="container mx-auto my-8 relative">
        <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
        <div className="flex mb-2">
          <input
            type="text"
            onChange={onDropdownChange}
            // onBlur={() => {
            //   setDropdown([]);
            // }}
            placeholder="Enter Product Name"
            className="flex-1 border border-gray-300 px-4 py-2"
          />
          <select className="border border-gray-300 px-4 py-2 rounded-r-md">
            <option value="">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 50 50"
            >
              <path
                d="M25,5 A20,20 0 0,1 45,25"
                fill="none"
                stroke="#000000"
                strokeWidth="5"
                className="loader"
              />
            </svg>
          </div>
        )}
        <div className="absolute w-full border-1 bg-slate-200 rounded">
          {dropdown.map((item) => {
            return (
              <div
                key={item.name}
                className="container flex justify-between border-b-2 p-2 my-1"
              >
                <span>
                  {item.name} ({item.quantity} available for ₹{item.price})
                </span>
                <div>
                  <button
                    onClick={() => {
                      buttonAction("minus", item.name, item.quantity);
                    }}
                    disabled={loading}
                    className="inline-block py-1 px-3 text-white bg-cyan-500 font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-cyan-300"
                  >
                    -
                  </button>
                  <span className="inline-block min-w-4 mx-2">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      buttonAction("plus", item.name, item.quantity);
                    }}
                    disabled={loading}
                    className="inline-block py-1 px-3 text-white bg-cyan-500 font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-cyan-300"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto my-8">
        <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="productName" className="block mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="name"
              value={productForm?.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={productForm?.quantity || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={productForm?.price || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>
          <button
            type="submit"
            onClick={addProduct}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 font-semibold rounded-lg shadow-md cursor-pointer"
          >
            Add Product
          </button>
        </form>
      </div>

      <div className="container my-8 mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Display Current Stock</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr key={product._id}>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">₹{product.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
}
