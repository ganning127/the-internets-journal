import {
  Container,
  Heading,
  Input,
  Box,
  Textarea,
  Flex,
  Text,
  Spacer,
  Button,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home({ success }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [title, setTitle] = useState("untitled post");
  const [content, setContent] = useState("content goes here");
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("mounted");
    setLoading(true);

    fetch("/api/get-posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      });
  }, [router]);

  console.log(posts);

  const handlePost = async () => {
    setPostLoading(true);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    };

    const res = await fetch("/api/create-post", options);
    const data = await res.json();
    router.replace(router.asPath);
    setPostLoading(false);
  };

  return (
    <>
      <Head>
        <title>The Internet's journal</title>
      </Head>

      <Container maxW="container.lg" mt={4}>
        <Heading fontWeight="black" fontSize="6xl" textAlign="center">
          the internet&apos;s Journal
        </Heading>

        <Box maxW="600px" mx="auto" mt={16} p={4} bg="gray.700" rounded="md">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fontWeight="bold"
            size="lg"
          />
          <Textarea
            value={content}
            placeholder="start typing here..."
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            mt={4}
          />

          <Flex mt={4}>
            <Text color="gray.400">{content.length} characters</Text>
            <Spacer />

            <Button colorScheme="blue" size="sm" onClick={handlePost}>
              {postLoading ? <Spinner size="sm" /> : "Post"}
            </Button>
          </Flex>
        </Box>

        <Box mt={16}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            {posts.length > 0 &&
              posts.map((post) => (
                <Box key={post._id} mt={4} bg="gray.700" p={4} rounded="md">
                  <Flex>
                    <Heading fontWeight="black" fontSize="2xl">
                      {post.title}
                    </Heading>
                    <Spacer />
                    <Text color="gray.400" fontSize="sm">
                      {post.views} views •{" "}
                      {new Date(post.created_at).toLocaleDateString()}
                    </Text>
                  </Flex>
                  <Text mt={4}>{post.content}</Text>
                </Box>
              ))}
          </SimpleGrid>
        </Box>
      </Container>
    </>
  );
}

// export async function getServerSideProps(context) {
//   try {
//     const client = await clientPromise;
//     const db = client.db("posts");
//     let posts = await db.collection("posts").find({}).toArray();
//     posts = JSON.parse(JSON.stringify(posts));

//     return {
//       props: { success: true, posts: posts },
//     };
//   } catch (e) {
//     console.error(e);
//     return {
//       props: { success: false },
//     };
//   }
// }
