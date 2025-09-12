import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Users, MessageCircle, Heart, ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Community = () => {
  const discussions = [
    {
      id: 1,
      title: "How do you manage exam stress?",
      author: "Sarah M.",
      authorAvatar: "SM",
      category: "Stress Management",
      replies: 12,
      likes: 8,
      timeAgo: "2 hours ago",
      preview: "I'm struggling with anxiety before big exams. What strategies have worked for you all?"
    },
    {
      id: 2,
      title: "Sleep schedule tips for night owls",
      author: "Alex K.",
      authorAvatar: "AK",
      category: "Sleep Health",
      replies: 7,
      likes: 15,
      timeAgo: "5 hours ago",
      preview: "I'm naturally a night person but need to adjust for early classes. Any advice?"
    },
    {
      id: 3,
      title: "Making friends as a transfer student",
      author: "Jordan L.",
      authorAvatar: "JL",
      category: "Social Health",
      replies: 9,
      likes: 6,
      timeAgo: "1 day ago",
      preview: "Just transferred this semester and feeling isolated. How did you build your social circle?"
    },
    {
      id: 4,
      title: "Mindfulness apps that actually work",
      author: "Maya R.",
      authorAvatar: "MR",
      category: "Mindfulness",
      replies: 14,
      likes: 22,
      timeAgo: "2 days ago",
      preview: "Tried several meditation apps but struggling to stick with them. Recommendations?"
    }
  ];

  const categories = ["All", "Stress Management", "Sleep Health", "Social Health", "Mindfulness", "General"];

  return (
    <div className="min-h-screen pt-20 pb-8 bg-gradient-to-br from-background to-secondary/5">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-4">Peer Community</h1>
          <p className="text-xl text-muted-foreground">
            Connect with fellow students and share experiences in a supportive environment
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="p-3 rounded-full bg-primary/10 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">2,500+</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="p-3 rounded-full bg-green-500/10 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">1,200+</div>
            <div className="text-sm text-muted-foreground">Discussions</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="p-3 rounded-full bg-purple-500/10 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">5,800+</div>
            <div className="text-sm text-muted-foreground">Supportive Messages</div>
          </Card>
        </div>

        {/* Category Filter and New Post */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
          <Button className="rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Start Discussion
          </Button>
        </div>

        {/* Discussions */}
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Card key={discussion.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {discussion.authorAvatar}
                      </div>
                    </Avatar>
                    <div>
                      <div className="font-medium">{discussion.author}</div>
                      <div className="text-sm text-muted-foreground">{discussion.timeAgo}</div>
                    </div>
                  </div>
                  <Badge variant="secondary">{discussion.category}</Badge>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">{discussion.title}</h3>
                  <p className="text-muted-foreground">{discussion.preview}</p>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{discussion.replies} replies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{discussion.likes} likes</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Community Guidelines */}
        <Card className="p-8 mt-12">
          <h2 className="text-2xl font-semibold mb-6">Community Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-green-600">✅ Do</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be respectful and supportive</li>
                <li>• Share your experiences honestly</li>
                <li>• Offer helpful advice when you can</li>
                <li>• Report inappropriate content</li>
                <li>• Keep discussions relevant to mental wellness</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-red-600">❌ Don't</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Share personal medical advice</li>
                <li>• Post triggering or harmful content</li>
                <li>• Spam or promote unrelated services</li>
                <li>• Harass or bully other members</li>
                <li>• Share personal contact information</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Community;
