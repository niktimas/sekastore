import { LegalDoc } from "@/lib/legal-docs";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <main className="offer-page legal-page">
      <p className="eyebrow">Правовая информация</p>
      <h1>{doc.title}</h1>
      <p>Редакция от {doc.updatedAt}.</p>
      {doc.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.list ? (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </main>
  );
}
