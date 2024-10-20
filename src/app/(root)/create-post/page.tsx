"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { postSchema } from "@/app/schemas/postSchema";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
export default function CreatePostForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    const res = await axios.post("/api/post-thread", { ...data });

    if (res.status === 200) {
      toast({
        title: "Post Updated Successfully",
        description: "Redirecting to home page",
        variant: "default",
      });
      router.replace("/");
    }
    if (res.status !== 200) {
      toast({
        title: "Failed to Upload a post",
        description: "Internal Server Error",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Create Your Post
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Write your post</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Create Post
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
