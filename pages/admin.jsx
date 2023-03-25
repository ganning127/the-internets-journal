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

export default function Admin() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/get-posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        query: JSON.stringify({ reported: true }),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
      });
  }, []);

  return (
    <Container maxW="container.xl" p={0}>
      <Heading my={8} fontWeight="black">
        Reported Posts
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {posts.map((post) => {
          return (
            <Box p={4} key={post._id} rounded="md" shadow="dark-lg">
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Heading size="md">{post.title}</Heading>

                  <Text>
                    {post.views} views | {post.likes} likes | {post.shares}{" "}
                    shares
                  </Text>
                </Box>
                <Button
                  colorScheme="red"
                  mt={4}
                  onClick={async () => {
                    const options = {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        slug: post.slug,
                        reported: false,
                      }),
                    };

                    const res = await fetch("/api/update-reported", options);
                    const data = await res.json();
                    if (data.success) {
                      setPosts(posts.filter((p) => p.slug !== post.slug));
                    }
                  }}
                >
                  Safe
                </Button>
              </Flex>

              <Text mt={4}>{post.content}</Text>
            </Box>
          );
        })}
      </SimpleGrid>
    </Container>
  );
}
