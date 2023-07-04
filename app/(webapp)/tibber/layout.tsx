import { Tab } from "#/ui/Tab";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-9">
      <div className="flex flex-wrap items-center gap-2">
        <Tab path="/tibber" item={{ text: "2022", slug: "2022" }} />
        <Tab path="/tibber" item={{ text: "2023", slug: "2023" }} />
      </div>

      <div>{children}</div>
    </div>
  );
}
