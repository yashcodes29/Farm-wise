"use client";

import { useEffect, useState } from "react";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";

export const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [openNewPost, setOpenNewPost] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", author: "", tags: "" });
  const [reply, setReply] = useState({ author: "", comment: "", commentIndex: null });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("http://localhost:3001/api/forum-posts");
    const data = await res.json();
    setPosts(data);
  };

  const handleNewPostSubmit = async () => {
    await fetch("http://localhost:3001/api/forum-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newPost.title,
        author: newPost.author,
        tags: newPost.tags.split(",").map(tag => tag.trim())
      })
    });
    setOpenNewPost(false);
    setNewPost({ title: "", author: "", tags: "" });
    fetchPosts();
  };

  const handleReplySubmit = async () => {
    if (!selectedPost || reply.commentIndex === null) return;

    await fetch(
      `http://localhost:3001/api/forum-posts/${selectedPost._id}/comments/${reply.commentIndex}/reply`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: reply.author, comment: reply.comment })
      }
    );
    setReply({ author: "", comment: "", commentIndex: null });
    const updated = await fetch(`http://localhost:3001/api/forum-posts`);
    const allPosts = await updated.json();
    const refreshed = allPosts.find(p => p._id === selectedPost._id);
    setSelectedPost(refreshed);
  };

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Community Forum
            </CardTitle>
            <CardDescription>Connect with other farmers</CardDescription>
          </div>
          <Dialog open={openNewPost} onOpenChange={setOpenNewPost}>
            <DialogTrigger asChild>
              <Button size="sm">New Post</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
              </DialogHeader>
              <Input placeholder="Title" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
              <Input placeholder="Author" value={newPost.author} onChange={e => setNewPost({ ...newPost, author: e.target.value })} />
              <Textarea placeholder="Tags (comma separated)" value={newPost.tags} onChange={e => setNewPost({ ...newPost, tags: e.target.value })} />
              <DialogFooter>
                <Button onClick={handleNewPostSubmit}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {posts.map(post => (
          <div key={post._id} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition">
            <div className="flex justify-between">
              <h3 className="font-medium">{post.title}</h3>
              <span className="text-xs text-muted-foreground">{new Date(post.time).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex flex-wrap gap-1">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-muted text-xs rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  setSelectedPost(post);
                  setOpenDetails(true);
                }}>Details</Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full">View All Discussions</Button>
      </CardFooter>

      {/* Post Details Modal */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent>
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPost.title}</DialogTitle>
              </DialogHeader>
              <p className="text-sm mb-2 text-muted-foreground">by {selectedPost.author}</p>
              <div className="space-y-4">
                {selectedPost.comments.map((comment, index) => (
                  <div key={index} className="border p-2 rounded-md">
                    <p className="font-semibold text-sm">{comment.author}</p>
                    <p className="text-sm">{comment.comment}</p>
                    <div className="ml-2 mt-1 space-y-1">
                      {comment.replies?.map((reply, i) => (
                        <div key={i} className="text-sm pl-3 border-l">
                          <strong>{reply.author}:</strong> {reply.comment}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      <Input
                        placeholder="Your Name"
                        value={reply.commentIndex === index ? reply.author : ""}
                        onChange={e => setReply({ ...reply, author: e.target.value, commentIndex: index })}
                      />
                      <Textarea
                        placeholder="Your Reply"
                        value={reply.commentIndex === index ? reply.comment : ""}
                        onChange={e => setReply({ ...reply, comment: e.target.value, commentIndex: index })}
                      />
                      <Button onClick={handleReplySubmit} size="sm">Reply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
