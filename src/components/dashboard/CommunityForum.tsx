
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const forumPosts = [
  {
    title: "Tips for managing soil moisture during dry periods",
    author: "FarmerJoe",
    replies: 12,
    time: "2h ago",
    tags: ["Soil", "Drought", "Tips"]
  },
  {
    title: "New organic pest control method working well for corn",
    author: "OrganicGrower",
    replies: 8,
    time: "Yesterday",
    tags: ["Organic", "Pest Control", "Corn"]
  },
  {
    title: "Looking for advice on crop rotation for small plots",
    author: "NewFarmer22",
    replies: 15,
    time: "2d ago",
    tags: ["Crop Rotation", "Small Farms", "Advice"]
  }
];

export const CommunityForum = () => {
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
          <Button size="sm">New Post</Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {forumPosts.map((post) => (
            <div 
              key={post.title} 
              className="p-3 border border-border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{post.title}</h3>
                <span className="text-xs text-muted-foreground">{post.time}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 bg-muted text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span>{post.replies}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full">View All Discussions</Button>
      </CardFooter>
    </Card>
  );
};
