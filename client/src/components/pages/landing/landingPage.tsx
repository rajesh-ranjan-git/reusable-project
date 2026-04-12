import HeroSection from "@/components/landing/heroSection";
import FeaturesSection from "@/components/landing/featuresSection";
import CommunitySection from "@/components/landing/communitySection";
import Footer from "@/components/landing/footer";
import SubscriptionPage from "@/components/pages/subscription/subscriptionPage";
import Header from "@/components/layout/header";

const LandingPage = () => {
  return (
    <div>
      <Header type="landing" />
      <main className="bg-bg-page min-h-dvh overflow-x-hidden font-poppins text-text-primary">
        <HeroSection />
        <FeaturesSection />
        <CommunitySection />
        <SubscriptionPage hideHeader={true} />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
