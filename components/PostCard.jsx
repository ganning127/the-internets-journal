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

import { useState } from "react";
import { FiLink2 } from "react-icons/fi";
import { BsFlag } from "react-icons/bs";
import { SlLike } from "react-icons/sl";

export const PostCard = ({ post }) => {
  const [visible, setVisible] = useState("block");
  const toast = useToast();
  const [lines, setLines] = useState(
    post.content.split(" ").length > 30 ? 4 : ""
  );

  const [likes, setLikes] = useState(post.likes);
  const [shares, setShares] = useState(post.shares);

  return (
    <Box
      key={post._id}
      mt={4}
      bg="gray.700"
      p={4}
      rounded="md"
      display={visible}
    >
      <Flex>
        <Heading fontWeight="black" fontSize="2xl">
          {post.title}
        </Heading>
        <Spacer />
        <Text color="gray.400" fontSize="sm">
          {post.views} views • {new Date(post.created_at).toLocaleDateString()}
        </Text>
      </Flex>

      <Text mt={4} noOfLines={lines}>
        {post.content}
      </Text>

      {lines === 4 && (
        <Text
          color="blue.400"
          fontWeight="bold"
          onClick={() => setLines("")}
          _hover={{
            cursor: "pointer",
          }}
          as="span"
        >
          Read More
        </Text>
      )}

      <Flex mt={4}>
        <Button
          p={0}
          bg=""
          m={0}
          rightIcon={<SlLike />}
          color="green.300"
          onClick={async () => {
            setLikes(++post.likes);
            await fetch(`/api/increment-likes/`, {
              method: "POST",
              body: JSON.stringify({
                slug: post.slug,
                currLikes: post.likes,
              }),
            });

            toast({
              title: "Post Liked.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }}
        >
          {post.likes}
        </Button>
        <Spacer />
        <Box>
          <Button
            p={0}
            bg=""
            leftIcon={<FiLink2 />}
            m={0}
            color="blue.300"
            // icon={<FiLink2 />}
            onClick={async () => {
              navigator.clipboard.writeText(
                `https://tij-ecru.vercel.app/${post.slug}`
              );
              toast({
                title: "Link copied.",
                description: "The link to this post has been copied.",
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

              setShares(++post.shares);
            }}
          >
            {post.shares}
          </Button>
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
                setVisible("none");
                console.log("setting to none");
              }

              toast({
                title: "Post Reported.",
                description: `"${post.title}" has been reported for review.`,
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
  );
};
