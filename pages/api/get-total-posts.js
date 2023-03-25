import clientPromise from "../../lib/mongodb";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("posts");
  let totalNumPosts = await db.collection("posts").countDocuments();

  res.status(200).json({ success: true, totalNumPosts: totalNumPosts });
}
