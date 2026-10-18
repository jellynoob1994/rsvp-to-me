import Link from "next/link";

export default function PreviewIndex() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#fafafa" }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Stijlvoorbeelden</h1>
        <p className="text-sm mb-8" style={{ color: "#71717a" }}>
          Kies de sfeer voor RSVP to Me
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {[
            { href: "/preview/dark", label: "🌑 Donker en sfeervol", desc: "Diepe tinten met gloeiende paarse accenten" },
            {
              href: "/preview/soft",
              label: "🌸 Zacht en dromerig",
              desc: "Pastelkleuren en zachte kleurverlopen",
            },
            {
              href: "/preview/bold",
              label: "⚡ Gedurfd en kleurrijk",
              desc: "Hoog contrast en een strakke kaart",
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block w-52 p-5 rounded-2xl border text-left hover:shadow-md transition-shadow"
              style={{ background: "#fff", border: "1px solid #e4e4e7" }}
            >
              <div className="text-lg mb-1">{s.label}</div>
              <div className="text-sm" style={{ color: "#71717a" }}>
                {s.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
