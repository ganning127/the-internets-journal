import clientPromise from "../../lib/mongodb";
import slug from "slug";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("posts");
  let created_at = new Date();
  let totalNumPosts = await db.collection("posts").countDocuments();
  const madeSlug = slug(req.body.title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });

  let useSlug = created_at.getTime() + "/" + madeSlug;

  const data = {
    title: req.body.title,
    content: req.body.content,
    created_at: created_at,
    views: 0,
    shares: 0,
    likes: 0,
    slug: useSlug,
    doc_num: totalNumPosts,
    reported: false,
  };

  const result = await db.collection("posts").insertOne(data);

  if (result.acknowledged) {
    res
      .status(200)
      .json({ success: true, slug: useSlug, _id: result.insertedId });
  } else {
    res.status(500).json({ success: false });
  }
}
