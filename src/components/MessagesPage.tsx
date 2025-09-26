import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Plus,
  Smile,
  Paperclip
} from "lucide-react";

export function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: 0,
      name: "Team EcoTracker",
      type: "group",
      avatar: "ET",
      lastMessage: "Sarah: Let's finalize the UI mockups today",
      time: "2m ago",
      unread: 3,
      online: true
    },
    {
      id: 1,
      name: "Sarah Chen",
      type: "direct",
      avatar: "SC",
      lastMessage: "Thanks for the code review!",
      time: "15m ago",
      unread: 0,
      online: true
    },
    {
      id: 2,
      name: "AI Study Group",
      type: "group",
      avatar: "AI",
      lastMessage: "Mike: Anyone free for the ML workshop tomorrow?",
      time: "1h ago",
      unread: 1,
      online: false
    },
    {
      id: 3,
      name: "Emma Davis",
      type: "direct",
      avatar: "ED",
      lastMessage: "The hackathon registration is open!",
      time: "3h ago",
      unread: 0,
      online: false
    },
    {
      id: 4,
      name: "Winter Hackathon 2024",
      type: "group",
      avatar: "WH",
      lastMessage: "Admin: Welcome everyone! Let's build something amazing",
      time: "1d ago",
      unread: 0,
      online: false
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Chen",
      avatar: "SC",
      content: "Hey team! I've finished the wireframes for the main dashboard. What do you think?",
      time: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      avatar: "AS",
      content: "They look great! I love the clean layout. Should we add a progress indicator for the carbon tracking?",
      time: "10:32 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: "Mike Johnson",
      avatar: "MJ",
      content: "Agreed! Also, I've set up the backend API endpoints. The documentation is in the shared drive.",
      time: "10:35 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: "Sarah Chen",
      avatar: "SC",
      content: "Perfect timing! I'll integrate the designs with the API structure today.",
      time: "10:36 AM",
      isOwn: false
    },
    {
      id: 5,
      sender: "You",
      avatar: "AS",
      content: "Sounds like a plan. Let's sync up this afternoon to review everything before the sprint demo.",
      time: "10:38 AM",
      isOwn: true
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* Conversations List */}
      <Card className="w-80 bg-gradient-card border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            Messages
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="space-y-1 p-4 pt-0">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedChat === conversation.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-card-hover"
                  }`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className={`${
                        conversation.type === 'group' 
                          ? 'bg-gradient-secondary text-secondary-foreground' 
                          : 'bg-gradient-primary text-primary-foreground'
                      }`}>
                        {conversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.name}</p>
                      <span className="text-xs opacity-70">{conversation.time}</span>
                    </div>
                    <p className="text-sm opacity-70 truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 bg-gradient-card border-0 shadow-md flex flex-col">
        {/* Chat Header */}
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-secondary text-secondary-foreground">
                  ET
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Team EcoTracker</h3>
                <p className="text-sm text-muted-foreground">4 members • 3 online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-96 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
                >
                  {!msg.isOwn && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                        {msg.avatar}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex-1 max-w-md ${msg.isOwn ? 'text-right' : ''}`}>
                    {!msg.isOwn && (
                      <p className="text-sm font-medium mb-1">{msg.sender}</p>
                    )}
                    <div
                      className={`p-3 rounded-lg ${
                        msg.isOwn
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Message Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-12"
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="hero" size="icon" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}