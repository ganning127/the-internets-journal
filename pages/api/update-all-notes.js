import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("posts");
  const collection = await db.collection("posts");

  // remove all documents from the collection
  // await collection.update(
  //   {
  //     views: { $lt: 30 },
  //   },
  //   { $set: { reported: true } },
  //   false,
  //   true
  // );

  await collection.deleteMany({});
  res.status(200).json({ success: true });
}
