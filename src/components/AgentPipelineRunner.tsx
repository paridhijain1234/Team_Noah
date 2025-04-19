"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// List of available agents & their config
const AGENTS = [
  { name: "summarize", label: "Summarizer", args: [] },
  {
    name: "translate",
    label: "Translator",
    args: [{ name: "Language", key: "toLang", default: "Spanish" }],
  },
  {
    name: "qa",
    label: "Q&A",
    args: [{ name: "Question", key: "question", default: "" }],
  },
  { name: "explain", label: "Explainer", args: [] },
];

type PipelineStep = {
  name: string;
  args: any[];
};

export default function AgentPipelineRunner() {
  const [text, setText] = useState("");
  const [pipeline, setPipeline] = useState<PipelineStep[]>([
    { name: "summarize", args: [] },
  ]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper to update the pipeline agent and its args
  const handlePipelineChange = (idx: number, agentName: string) => {
    const agentDef = AGENTS.find((a) => a.name === agentName);
    const newArgs = agentDef?.args
      ? agentDef.args.map((arg) => arg.default)
      : [];
    setPipeline((prev) =>
      prev.map((step, i) =>
        i === idx ? { name: agentName, args: newArgs } : step
      )
    );
  };
  const handleArgChange = (idx: number, argIdx: number, value: string) => {
    setPipeline((prev) =>
      prev.map((step, i) =>
        i === idx
          ? {
              ...step,
              args: step.args.map((a, j) => (j === argIdx ? value : a)),
            }
          : step
      )
    );
  };

  // Add or remove steps
  const addStep = () =>
    setPipeline((prev) => [...prev, { name: "summarize", args: [] }]);
  const removeStep = (idx: number) =>
    setPipeline((prev) => prev.filter((_, i) => i !== idx));

  const runPipeline = async () => {
    setLoading(true);
    setOutput("");
    try {
      const resp = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, pipeline }),
      });
      const data = await resp.json();
      setOutput(data.result ?? data.error ?? "Unknown error");
    } catch (e) {
      setOutput(`Error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-6xl mx-auto my-8">
      <CardHeader>
        <CardTitle>AI Agent Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pipeline-text">Input Text</Label>
          <Textarea
            id="pipeline-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here"
            rows={5}
          />
        </div>
        <div className="space-y-4">
          {pipeline.map((step, idx) => {
            const agentDef = AGENTS.find((a) => a.name === step.name);
            return (
              <div key={idx} className="flex flex-col gap-2 p-4 border rounded">
                <div className="flex items-center gap-2">
                  <Select
                    value={step.name}
                    onValueChange={(value) => handlePipelineChange(idx, value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENTS.map((a) => (
                        <SelectItem key={a.name} value={a.name}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeStep(idx)}
                    disabled={pipeline.length === 1}
                  >
                    Remove
                  </Button>
                </div>
                {agentDef?.args && agentDef.args.length > 0 && (
                  <div className="flex gap-2">
                    {agentDef.args.map((arg, argIdx) => (
                      <Input
                        key={arg.key}
                        value={step.args[argIdx] ?? ""}
                        placeholder={arg.name}
                        onChange={(e) =>
                          handleArgChange(idx, argIdx, e.target.value)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Button variant="outline" onClick={addStep}>
            + Add Step
          </Button>
        </div>
        <div className="flex justify-end">
          <Button onClick={runPipeline} disabled={loading || !text.trim()}>
            {loading ? "Running..." : "Run Pipeline"}
          </Button>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Output</Label>
          <Textarea value={output} readOnly rows={6} />
        </div>
      </CardContent>
    </Card>
  );
}
