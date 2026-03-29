import LandingHeader from "@/components/landing/landingHeader";
import HeroSection from "@/components/landing/heroSection";
import FeaturesSection from "@/components/landing/featuresSection";
import CommunitySection from "@/components/landing/communitySection";
import Footer from "@/components/landing/footer";
import SubscriptionPage from "@/components/pages/subscriptionPage";

export default function LandingPage() {
  return (
    <div className="selection:bg-primary/30 min-h-screen text-text-primary">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CommunitySection />
        <SubscriptionPage hideHeader={true} />
      </main>
      <Footer />
    </div>
  );
}
