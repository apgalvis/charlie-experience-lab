import { getAccount, WEEKLY_LEADS } from "@/lib/charlie/data";
import type { Block } from "@/lib/charlie/script";
import { AccountCoverage, ChartWithInsight, ClarificationPrompt, DiagnosisSummary, DraftResponse, EvidenceDisclosure, NextBestAction, ProductStatusCompact, PropertyDataTable, StateBlock, Summary, TechTrace } from "./blocks";

export function RenderBlock({ b, accountId, onSend }: { b: Block; accountId: string | null; onSend: (t: string) => void }) {
  const acc = accountId ? getAccount(accountId) : null;
  switch (b.t) {
    case "summary": return <Summary>{b.text}</Summary>;
    case "diagnosis": return <DiagnosisSummary d={b.d} />;
    case "next": return <NextBestAction title={b.title} detail={b.detail} cta={b.cta} onCta={() => b.prompt && onSend(b.prompt)} />;
    case "evidence": return <EvidenceDisclosure steps={b.steps} caveats={b.caveats} />;
    case "tech": return <TechTrace calls={b.calls} />;
    case "clarify": return <ClarificationPrompt question={b.question} hint={b.hint} options={b.options} onPick={onSend} />;
    case "product": return acc ? <ProductStatusCompact product={acc.product} opportunity={b.opportunity} /> : null;
    case "coverage": return acc ? <AccountCoverage total={acc.totalProperties} evaluated={acc.evaluated} affected={acc.affected} /> : null;
    case "table": return acc ? <PropertyDataTable account={acc} /> : null;
    case "chart": return <ChartWithInsight data={WEEKLY_LEADS} />;
    case "draft": return <DraftResponse initial={b.text} />;
    case "state": return <StateBlock kind={b.kind} onAction={() => onSend(b.kind === "error" ? "Reintentar" : "Continuar")} />;
  }
}
