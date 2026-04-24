import Header from "@/components/layout/header";
import HeroSection from "@/components/landing/hero.section";
import FeaturesSection from "@/components/landing/features.section";
import CommunitySection from "@/components/landing/community.section";
import SubscriptionPage from "@/components/pages/subscription/subscription.page";
import Footer from "@/components/landing/footer";

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
