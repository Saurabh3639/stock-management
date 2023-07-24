import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const products = database.collection("inventory");

    const query = {};
    const product = await products.find(query).toArray();

    console.log(product);
    return NextResponse.json({ a: 34, product });
  } finally {
    await client.close();
  }
}
