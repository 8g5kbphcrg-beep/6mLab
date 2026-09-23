import type { Metadata } from "next";
import Link from "next/link";
import "@/app/pages.css";

export const metadata: Metadata = {
  title: "About | 6M Lab",
  description: "6M Lab was built by a handball player studying sport science (training and coaching).",
  alternates: { canonical: "/en/about" },
};

export default function About() {
  return (
    <div className="pg">
      <h1>About 6M Lab</h1>
      <p className="lead2">I've played handball for years, and I'm studying sport science, specializing in training and coaching. 6M Lab started from a simple observation: most amateur players don't have access to real physical training built for their sport and their schedule.</p>
      <p>I wanted to build what I wish I'd had: clear programs, designed specifically for handball, with no unnecessary jargon or complicated equipment.</p>
      <ul className="avow">
        <li><strong>The name</strong><span>"6M" refers to the 6-meter line, the goal area in handball.</span></li>
        <li><strong>The approach</strong><span>Solid training principles, applied concretely to handball.</span></li>
        <li><strong>The goal</strong><span>Help amateur players improve and get injured less.</span></li>
      </ul>
      <p>6M Lab is just getting started. The programs evolve with feedback from the first players who try them.</p>
      <p><Link className="btn" href="/en/programmes">See the programs</Link></p>
    </div>
  );
}
