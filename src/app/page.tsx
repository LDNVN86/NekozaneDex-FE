import { getHotStories, getLatestStories } from "@/features/story";
import { getGenres } from "@/features/search/server";
import {
  HeroSection,
  LatestStoriesSection,
  HotStoriesSection,
  GenresSection,
  Footer,
} from "@/features/home";

export default async function HomePage() {
  const [latestRes, hotRes, genresRes] = await Promise.all([
    getLatestStories(6),
    getHotStories(4),
    getGenres(),
  ]);

  const newStories = latestRes.success ? latestRes.data : [];
  const hotStories = hotRes.success ? hotRes.data : [];
  const genres = genresRes.success ? genresRes.data : [];

  return (
    <div className="flex flex-col">
      <HeroSection />
      <LatestStoriesSection stories={newStories} />
      <HotStoriesSection stories={hotStories} />
      <GenresSection genres={genres} />
      <Footer />
    </div>
  );
}
