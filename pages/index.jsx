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
  useToast,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { FiLink2 } from "react-icons/fi";
import { BsFlag } from "react-icons/bs";

export default function Home({ success }) {
  const [posts, setPosts] = useState([]);
  const [totalNumPosts, setTotalNumPosts] = useState(0);
  const [postLoading, setPostLoading] = useState(false);
  const [title, setTitle] = useState("untitled post");
  const [content, setContent] = useState("content goes here");
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    console.log("mounted");

    fetch("/api/get-posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        query: JSON.stringify({
          reported: false,
        }),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setTotalNumPosts(data.totalNumPosts);
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

    toast({
      title: "Post Created.",
      description: "We've created your anonymous post (scroll down to see).",
      status: "success",
      duration: 9000,
      isClosable: true,
    });

    router.replace(router.asPath);
    setPostLoading(false);
  };

  return (
    <>
      <Head>
        <title>the internet&apos;s journal</title>
      </Head>

      <Container maxW="container.lg" mt={4}>
        <Heading fontWeight="black" fontSize="6xl" textAlign="center">
          the internet&apos;s journal
        </Heading>
        <Text textAlign="center" color="gray.400" fontSize="lg" mt={2}>
          all posts are completely anonymous
        </Text>

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

        <Text mt={16} color="gray.400" fontSize="lg">
          {totalNumPosts} posts total
        </Text>
        <Box>
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

                  <Flex mt={4}>
                    <Box />
                    <Spacer />
                    <Box>
                      <IconButton
                        p={0}
                        bg=""
                        m={0}
                        color="blue.300"
                        icon={<FiLink2 />}
                        onClick={async () => {
                          navigator.clipboard.writeText(
                            `localhost:3000/${post.slug}`
                          );
                          toast({
                            title: "Link copied.",
                            description:
                              "The link to this post has been copied.",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                          });

                          await fetch(`/api/increment-share/`, {
                            method: "POST",
                            body: JSON.stringify({
                              slug: post.slug,
                              currShare: post.shares,
                            }),
                          });
                        }}
                      />
                      <IconButton
                        p={0}
                        bg=""
                        m={0}
                        icon={<BsFlag />}
                        color="red.300"
                        onClick={async () => {
                          const res = await fetch(`/api/update-reported/`, {
                            method: "POST",
                            body: JSON.stringify({
                              slug: post.slug,
                              reported: true,
                            }),
                          });

                          const data = await res.json();
                          if (data.success) {
                            setPosts(posts.filter((p) => p.slug !== post.slug));
                          }

                          toast({
                            title: "Post Reported.",
                            description: `"${post.title}" has been reported for review}.`,
                            status: "warning",
                            duration: 9000,
                            // status='error'
                            isClosable: true,
                          });
                        }}
                      />
                    </Box>
                  </Flex>
                </Box>
              ))}
          </SimpleGrid>
        </Box>
      </Container>

      <Box mt={16} />
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
