import clientPromise from "../../lib/mongodb";
import slug from "slug";
export default async function handler(req, res) {
  const client = await clientPromise;

  const db = client.db("posts");
  let toUpdate = [];

  for (let i = 3; i < 200; i++) {
    let created_at = new Date();

    const madeSlug = slug(`Post Title ${i}`, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });

    let useSlug = created_at.getTime() + "/" + madeSlug;

    const data = {
      title: `Post title ${i}`,
      content: `Post content ${i}`,
      created_at: created_at,
      views: randomIntFromInterval(1, 1000),
      shares: randomIntFromInterval(1, 100),
      likes: randomIntFromInterval(1, 500),
      slug: useSlug,
    };

    toUpdate.push(data);
  }

  const result = await db.collection("posts").insertMany(toUpdate);

  if (result.acknowledged) {
    res.status(200).json({ success: true, result });
  } else {
    res.status(500).json({ success: false });
  }
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const rndInt = randomIntFromInterval(1, 6);
