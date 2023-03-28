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
import { BsPencilSquare } from "react-icons/bs";
import { PostCard } from "../components/PostCard";
import { TextEditor } from "../components/TextEditor";

export default function Home() {
  const [writeMode, setWriteMode] = useState("none");
  const [posts, setPosts] = useState([]);
  const [numRendered, setNumRendered] = useState(100);
  const [totalNumPosts, setTotalNumPosts] = useState(0);
  const [sortMode, setSortMode] = useState("best");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const resp1 = await fetch("/api/get-total-posts");
      const data1 = await resp1.json();
      const totalPosts = data1.totalNumPosts;

      setTotalNumPosts(totalPosts);

      const resp2 = await fetch("/api/get-posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          sorttype: sortMode,
          query: JSON.stringify({
            reported: false,
            doc_num: {
              $gte: totalPosts - numRendered,
              $lte: totalPosts + 1,
            },
          }),
        },
      });

      const data2 = await resp2.json();
      setPosts(data2.posts || []);
    }
    fetchData();
  }, [router, numRendered, sortMode]);

  return (
    <>
      <Head>
        <title>the internet&apos;s journal</title>
      </Head>

      <Container maxW="container.xl" mt={4}>
        <Heading
          fontWeight="black"
          fontSize="7xl"
          textAlign="center"
          mt={16}
          color="#774936"
        >
          the internet&apos;s journal
        </Heading>
        <Text textAlign="center" color="#8a5a44" fontSize="lg" mt={2}>
          all posts are completely anonymous •{" "}
          <Text as="span" fontWeight="bold">
            {totalNumPosts} posts total
          </Text>
        </Text>

        <Box textAlign="center">
          <Button
            mt={4}
            leftIcon={writeMode == "none" ? <BsPencilSquare /> : null}
            color="white"
            bg="#9A8C98"
            _hover={{
              bg: "#8a5a44",
            }}
            variant="solid"
            width={{
              base: "100%",
              md: "auto",
            }}
            mx="auto"
            px={8}
            onClick={(e) => {
              if (writeMode == "none") setWriteMode("block");
              else setWriteMode("none");
            }}
          >
            {writeMode == "none" ? "write a post" : "cancel"}
          </Button>
        </Box>

        <TextEditor
          maxW="600px"
          mx="auto"
          mt={16}
          p={4}
          bg="#ebd6ca"
          rounded="md"
          display={writeMode}
          sortHandler={setSortMode}
        ></TextEditor>

        <Text mt={16} color="#774936" fontSize="lg"></Text>
        <Box>
          <Button
            onClick={() => {
              if (sortMode == "newest") {
                setSortMode("best");
              } else {
                setSortMode("newest");
              }
            }}
          >
            Sort by: {sortMode}
          </Button>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            {posts.length > 0 &&
              posts.map((post) => {
                return <PostCard key={post._id} post={post} />;
              })}
          </SimpleGrid>

          {posts.length > 0 && numRendered <= totalNumPosts && (
            <Flex mt={4}>
              <Spacer />
              <Button
                bg="#774936"
                color="white"
                _hover={{
                  bg: "#8a5a44",
                }}
                size="sm"
                onClick={() => setNumRendered(numRendered + 100)}
              >
                Load More
              </Button>
            </Flex>
          )}
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
