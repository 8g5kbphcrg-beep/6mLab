import type { Metadata } from "next";
import Link from "next/link";
import "@/app/pages.css";

export const metadata: Metadata = {
  title: "About | 6M Lab",
  description: "6M Lab was built by Raphaël: 5 years in elite-level handball programs, now coach and strength coach of a team.",
  alternates: { canonical: "/en/about" },
};

export default function About() {
  return (
    <div className="pg">
      <h1>About 6M Lab</h1>
      <p className="lead2">I'm Raphaël. I spent 5 years in elite-level handball programs: 5 training sessions a week, alongside academy players, some of whom now play professionally.</p>
      <p>There I saw what real physical preparation changes: more explosive, stronger players who get injured less often. Once I left, one thing was obvious: most amateur players never get access to it.</p>
      <p>Today I coach a team and ran its physical preparation this summer. I'm also completing a sport science degree, specializing in training and coaching.</p>
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
