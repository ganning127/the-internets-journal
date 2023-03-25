import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;

  //   const body = JSON.parse(req.body);
  let body = req.body;

  try {
    body = JSON.parse(req.body);
  } catch (e) {}
  const slug = body.slug;
  const newReported = body.reported;

  console.log(slug);
  const resp = await client
    .db("posts")
    .collection("posts")
    .updateOne({ slug: slug }, { $set: { reported: newReported } });

  if (resp.acknowledged) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
}
