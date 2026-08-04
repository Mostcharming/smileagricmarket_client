import MarketingLayout from "@/components/ui/marketing-layout";
import MarketingDashboard from "@/screens/main/marketing/dashboard";

export default function MarketingBetaEmailPage() {
  return (
    <MarketingLayout breadcrumbs={["Users", "Beta Email"]}>
      <MarketingDashboard />
    </MarketingLayout>
  );
}
