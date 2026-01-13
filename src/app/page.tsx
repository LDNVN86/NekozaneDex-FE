import { getHotStories, getLatestStories } from "@/features/story";
import { getGenres } from "@/features/search/server";
import { getAuthFromCookie } from "@/features/auth/server";
import { Header } from "@/shared/components/header";
import {
  HeroSection,
  LatestStoriesSection,
  HotStoriesSection,
  GenresSection,
  Footer,
} from "@/features/home";

export default async function HomePage() {
  const [latestRes, hotRes, genresRes, authResult] = await Promise.all([
    getLatestStories(6),
    getHotStories(4),
    getGenres(),
    getAuthFromCookie(),
  ]);

  const newStories = latestRes.success ? latestRes.data : [];
  const hotStories = hotRes.success ? hotRes.data : [];
  const genres = genresRes.success ? genresRes.data : [];
  const user = authResult.success ? authResult.data : null;

  return (
    <>
      <Header user={user} />
      <main className="min-h-screen flex flex-col">
        <HeroSection />
        <LatestStoriesSection stories={newStories} />
        <HotStoriesSection stories={hotStories} />
        <GenresSection genres={genres} />
        <Footer />
      </main>
    </>
  );
}
