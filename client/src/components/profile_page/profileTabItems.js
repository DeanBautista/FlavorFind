import { Bookmark, Heart, LayoutGrid, Star } from "lucide-react";

const profileTabItems = [
  { key: "recipes", label: "My Recipes", icon: LayoutGrid },
  { key: "likes", label: "Likes", icon: Heart },
  { key: "saved", label: "Saved", icon: Bookmark },
  { key: "reviews", label: "My Reviews", icon: Star },
];

export default profileTabItems;
