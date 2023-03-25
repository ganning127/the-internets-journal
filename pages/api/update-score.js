import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("posts");
  const collection = await db.collection("posts");
  // get total number of documents in the collection
  let posts = await db.collection("posts").find({}).toArray();
  posts = JSON.parse(JSON.stringify(posts));

  let viewSort = await collection.find().sort({ views: -1 }).limit(1).toArray();
  let maxViews = viewSort[0].views;

  viewSort = await collection.find().sort({ views: 1 }).limit(1).toArray();
  let minViews = viewSort[0].views;

  let likeSort = await collection.find().sort({ likes: -1 }).limit(1).toArray();
  let maxLikes = likeSort[0].likes;
  likeSort = await collection.find().sort({ likes: 1 }).limit(1).toArray();

  let minLikes = likeSort[0].likes;

  let shareSort = await collection
    .find()
    .sort({ shares: -1 })
    .limit(1)
    .toArray();

  let maxShares = shareSort[0].shares;
  shareSort = await collection.find().sort({ shares: 1 }).limit(1).toArray();

  let minShares = shareSort[0].shares;

  for (let i = 0; i < posts.length; i++) {
    let normShares = minMaxNorm(minShares, maxShares, posts[i].shares);
    let normLikes = minMaxNorm(minLikes, maxLikes, posts[i].likes);
    let normViews = minMaxNorm(minViews, maxViews, posts[i].views);

    console.log("updating score for post: " + posts[i].slug);

    const score = 0.4 * normLikes + 0.1 * normViews + 0.5 * normShares;

    await collection.updateOne(
      { slug: posts[i].slug },
      { $set: { score: score } }
    );
  }

  res.status(200).json({ success: true });
}

function minMaxNorm(min, max, val) {
  return (val - min) / (max - min);
}
