import { getHotStories, getLatestStories } from "@/features/story";
import { getGenres } from "@/features/search/server";
import { getAuthFromCookie } from "@/features/auth/server";
import { getContinueReading } from "@/features/reading-history/server";
import { ContinueReadingSection } from "@/features/reading-history";
import {
  HeroSection,
  LatestStoriesSection,
  HotStoriesSection,
  GenresSection,
  Footer,
} from "@/features/home";

export default async function HomePage() {
  // Fetch auth first to determine if we should get continue reading
  const authResult = await getAuthFromCookie();
  const isLoggedIn = authResult.success;

  // Parallel fetches
  const [latestRes, hotRes, genresRes, continueRes] = await Promise.all([
    getLatestStories(6),
    getHotStories(4),
    getGenres(),
    // Only fetch continue reading if logged in
    isLoggedIn
      ? getContinueReading(6)
      : Promise.resolve({ success: false as const, data: [] }),
  ]);

  const newStories = latestRes.success ? latestRes.data : [];
  const hotStories = hotRes.success ? hotRes.data : [];
  const genres = genresRes.success ? genresRes.data : [];
  const continueItems = continueRes.success ? continueRes.data : [];

  return (
    <div className="flex flex-col">
      <HeroSection />
      {continueItems.length > 0 && (
        <ContinueReadingSection items={continueItems} />
      )}
      <LatestStoriesSection stories={newStories} />
      <HotStoriesSection stories={hotStories} />
      <GenresSection genres={genres} />
      <Footer />
    </div>
  );
}
