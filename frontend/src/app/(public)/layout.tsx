import { PublicLayout } from "@/components/layout/PublicLayout";

import "../../styles/olds/global.css";
import "../../styles/olds/home.css";
import "../../styles/olds/about.css";
import "../../styles/olds/gallery.css";
import "../../styles/olds/talk.css";

export default function PublicRouteLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
