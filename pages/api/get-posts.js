import clientPromise from "../../lib/mongodb";
import slug from "slug";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("posts");
  let totalNumPosts = await db.collection("posts").countDocuments();
  let posts = await db
    .collection("posts")
    .find(JSON.parse(req.headers.query))
    .toArray();
  posts = JSON.parse(JSON.stringify(posts));

  posts.sort((a, b) => b.doc_num - a.doc_num);

  console.log(posts.length);
  if (posts.length > 0) {
    res
      .status(200)
      .json({ success: true, posts: posts, totalNumPosts: totalNumPosts });

    // go through all posts that were fetched and increment their view count
    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];

      // increment the view count
      const newViews = post.views + 1;

      // update the post in the database
      const resp = await db
        .collection("posts")
        .updateOne({ slug: post.slug }, { $set: { views: newViews } });
    }

    return;
  } else {
    res.status(500).json({ success: false });
    return;
  }
}
