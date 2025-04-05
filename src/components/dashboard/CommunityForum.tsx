import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { MessageSquare, ThumbsUp } from "lucide-react";

export const CommunityForum = () => {
  const [forumPosts, setForumPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", author: "", tags: "" });
  const [newComments, setNewComments] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/api/forum-posts");
    setForumPosts(res.data);
  };

  const handleSubmit = async () => {
    if (!newPost.title || !newPost.author) return;

    const postData = {
      ...newPost,
      tags: newPost.tags.split(",").map(t => t.trim())
    };
    await axios.post("http://localhost:5000/api/forum-posts", postData);
    setNewPost({ title: "", author: "", tags: "" });
    fetchPosts();
  };

  const handleComment = async (postId: string) => {
    const comment = newComments[postId];
    if (!comment) return;

    await axios.post(`http://localhost:5000/api/forum-posts/${postId}/comments`, {
      author: "Anonymous",
      comment
    });
    setNewComments({ ...newComments, [postId]: "" });
    fetchPosts();
  };

  const handleLike = async (postId: string) => {
    await axios.patch(`http://localhost:5000/api/forum-posts/${postId}/like`);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" /> Community Forum
        </CardTitle>
        <CardDescription>Connect with other farmers</CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Your name"
            value={newPost.author}
            onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Comma-separated tags"
            value={newPost.tags}
            onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <Button className="w-full" onClick={handleSubmit}>Post</Button>
        </div>

        <div className="space-y-4">
          {forumPosts.map((post: any) => (
            <div key={post._id} className="p-3 border border-border rounded-lg">
              <div className="flex justify-between">
                <h3 className="font-medium">{post.title}</h3>
                <span className="text-xs text-muted-foreground">{new Date(post.time).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 bg-muted text-xs rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Button size="sm" variant="ghost" onClick={() => handleLike(post._id)}>
                    <ThumbsUp className="h-4 w-4" /> {post.likes || 0}
                  </Button>
                  <MessageSquare className="h-3 w-3" />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>

              {/* Comments */}
              {post.comments?.map((c: any, i: number) => (
                <div key={i} className="ml-2 mt-2 text-sm text-muted-foreground">
                  <b>{c.author}</b>: {c.comment}
                </div>
              ))}

              {/* Comment input */}
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment"
                  value={newComments[post._id] || ""}
                  onChange={(e) =>
                    setNewComments({ ...newComments, [post._id]: e.target.value })
                  }
                  className="flex-1 p-1 border rounded text-sm"
                />
                <Button size="sm" onClick={() => handleComment(post._id)}>
                  Comment
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
