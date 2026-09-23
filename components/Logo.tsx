// The 6M Lab mark: a "6" drawn as a thrown handball. The loop is the ball (with its seams),
// the stroke above is its trajectory, and two speed lines show the shot.
export const MARK = `<rect width="48" height="48" rx="12" fill="#100A24"/><path d="M36 8C22 8 12 16 12 29" fill="none" stroke="#FFE14A" stroke-width="6.5" stroke-linecap="round"/><circle cx="23" cy="29" r="11.5" fill="#FFE14A"/><path d="M13.5 25.5Q23 32 32.5 25.5M22 17.6Q18 29 23 40.5" fill="none" stroke="#100A24" stroke-width="2"/><path d="M40 12.5l4-3.5M41.5 18.5l4.5-1.5" stroke="#FF5A1F" stroke-width="3" stroke-linecap="round"/>`;

export function Mark({ size = 32, className }: { size?: number; className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" dangerouslySetInnerHTML={{ __html: MARK }} />;
}

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <>
      <Mark size={size} />
      <span>6M<b>Lab</b></span>
    </>
  );
}
