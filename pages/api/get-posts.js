import clientPromise from "../../lib/mongodb";
import slug from "slug";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("posts");
  let posts = await db.collection("posts").find({}).toArray();
  posts = JSON.parse(JSON.stringify(posts));

  if (posts.length > 0) {
    res.status(200).json({ success: true, posts: posts });

    // go through all posts that were fetched and increment their view count
    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];

      // increment the view count
      const newViews = post.views + 1;

      console.log(post.slug);

      // update the post in the database
      const resp = await db
        .collection("posts")
        .updateOne({ slug: post.slug }, { $set: { views: newViews } });

      // if the update was successful, log it
      console.log(resp);
    }
  } else {
    res.status(500).json({ success: false });
  }
}
