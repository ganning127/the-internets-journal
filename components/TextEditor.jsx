import {
  Input,
  Flex,
  Text,
  Button,
  Textarea,
  Spacer,
  useToast,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";

export const TextEditor = (props) => {
  const [title, setTitle] = useState("untitled post");
  const [content, setContent] = useState("what's on your mind?");
  const [postLoading, setPostLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

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
      description: "We've created your anonymous post.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });

    router.replace(router.asPath);
    setPostLoading(false);
    setTitle("untitled post");
    setContent("what's on your mind?");
    props.sortHandler("newest");
  };
  return (
    <Box {...props}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fontWeight="bold"
        size="lg"
        border="1px solid #c38e70"
        color="#774936"
        _focus={{
          border: "1px solid #c38e70",
        }}
      />
      <Textarea
        value={content}
        placeholder="start typing here..."
        onChange={(e) => setContent(e.target.value)}
        border="1px solid #c38e70"
        _focus={{
          border: "1px solid #c38e70",
        }}
        rows={12}
        color="#22223B"
        mt={4}
      />

      <Flex mt={4}>
        <Text color="#774936">{content.length} characters</Text>
        <Spacer />

        <Button
          bg="#774936"
          color="white"
          _hover={{
            bg: "#8a5a44",
          }}
          size="sm"
          onClick={handlePost}
        >
          {postLoading ? <Spinner size="sm" /> : "Post"}
        </Button>
      </Flex>
    </Box>
  );
};
