"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid } from "react-loader-spinner";
import { welcomeMessage } from "@/lib/strings";
import Bubble from "@/components/chat/bubble";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: welcomeMessage,
      id: "initialai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    const userMessage = {
      role: "user",
      content: input,
      id: `user-${Date.now()}`,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error("Failed to fetch the response");

      const data = await response.json();
      console.log(data)
      const aiMessage = data[0]?.messages?.find((msg: any) => msg.type === "ai");
      if (aiMessage) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: aiMessage.content,
            id: aiMessage.id,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "There was an error processing your request. Please try again later.",
          id: `error-${Date.now()}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="border-purple-700 border-opacity-5 border flex-grow flex flex-col bg-[url('/images/bg.png')] bg-cover h-full px-8 py-4 w-full">
        <ScrollArea className="h-[85%] pr-2 w-full" ref={scrollAreaRef}>
          {messages.map((message) => (
            <Bubble key={message.id} message={message} id={message.id} />
          ))}
        </ScrollArea>
        <div>
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center w-full space-x-2 z-10 marker:b-3"
          >
            <Input
              placeholder="Type your message"
              value={input}
              onChange={handleInputChange}
            />
            <Button disabled={isLoading}>
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  <Grid
                    height={12}
                    width={12}
                    radius={5}
                    ariaLabel="grid-loading"
                    color="#fff"
                    ms-visible={true}
                  />
                  {"Loading..."}
                </div>
              ) : (
                "Send"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
