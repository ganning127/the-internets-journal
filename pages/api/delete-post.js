import clientPromise from "../../lib/mongodb";
import slug from "slug";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("posts");
  const slug = req.body.slug;

  const result = await db.collection("posts").deleteOne({
    slug: slug,
  });

  if (result.acknowledged) {
    res.status(200).json({ success: true, slug: slug });
  } else {
    res.status(500).json({ success: false });
  }
}
