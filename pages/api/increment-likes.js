import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;

  const body = JSON.parse(req.body);
  const slug = body.slug;
  const currLikes = body.currLikes;

  console.log(slug);
  const resp = await client
    .db("posts")
    .collection("posts")
    .updateOne({ slug: slug }, { $set: { likes: currLikes + 1 } });

  if (resp.acknowledged) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
}
