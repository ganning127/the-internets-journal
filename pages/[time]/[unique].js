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
  HStack,
  Link,
  Divider,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { FiLink2 } from "react-icons/fi";
import clientPromise from "../../lib/mongodb";

export default function Home({ success, post }) {
  return (
    <>
      <Head>
        <title>the internet&apos;s journal</title>
      </Head>

      <Container maxW="container.lg" mt={4} p={4}>
        <Flex>
          <Heading fontWeight="black"> {post.title} </Heading>
          <Spacer />
          <Text>
            {post.views} views | {post.likes} likes | {post.shares} shares
          </Text>
        </Flex>
        <Text mt={4} fontSize="lg">
          {post.content}
        </Text>
        <Divider mt={16} />
        <Text mt={4} textAlign="center">
          head back to the{" "}
          <Link href="/" color="#9d6b53">
            home page
          </Link>
        </Text>
      </Container>

      <Box mt={16} />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const client = await clientPromise;
    const db = client.db("posts");
    const query = context.query;

    // grab the document with the slug that matches the query
    let posts = await db
      .collection("posts")
      .find({ slug: query.time + "/" + query.unique })
      .limit(1)
      .toArray();

    posts = JSON.parse(JSON.stringify(posts));

    // update the view count
    const newViews = posts[0].views + 1;

    // update the post in the database
    const resp = await db
      .collection("posts")
      .updateOne({ slug: posts[0].slug }, { $set: { views: newViews } });

    return {
      props: { success: true, post: posts[0] },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { success: false },
    };
  }
}
