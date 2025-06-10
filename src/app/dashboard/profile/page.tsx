import Overall from "./_components/overall";
import RegularResultsPage from "./_components/regular-result";

export default function RegularResult() {
  return (
    <div className="flex flex-col gap-12">
      <Overall />
      <RegularResultsPage />
    </div>
  );
}
