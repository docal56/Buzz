import { TranscriptView } from "@/components/patterns/transcript-view";

export function TranscriptViewDemo() {
  return (
    <div className="rounded-md border border-border bg-surface p-lg">
      <TranscriptView
        messages={[
          {
            id: "1",
            variant: "incoming",
            body: "Hi, Relocate Property management how can I help you?",
          },
          {
            id: "2",
            variant: "outgoing",
            body: "Oh, hi. Yeah, I'd like to report, um, a rat in my kitchen.",
          },
          {
            id: "3",
            variant: "incoming",
            body: "Right, okay. That sounds unpleasant. Can I get your name please?",
          },
          {
            id: "4",
            variant: "outgoing",
            body: "Dave O'Callaghan. I live at 59 Wakefield Road.",
          },
        ]}
      />
    </div>
  );
}
