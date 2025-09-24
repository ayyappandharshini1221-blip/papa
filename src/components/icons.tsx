import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

export function PythonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13.5 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
      <path d="m10.5 14.5.5 4.5" />
      <path d="M13.5 14.5a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
      <path d="m10.5 9.5-.5-4.5" />
      <path d="M14 6.5h-4" />
      <path d="M14 17.5h-4" />
      <path d="M16.5 12a2.5 2.5 0 0 1-2.5-2.5V6" />
      <path d="M7.5 12a2.5 2.5 0 0 0 2.5 2.5V18" />
    </svg>
  );
}

export function JavaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 11h10" />
      <path d="M10 11v6" />
      <path d="M12 11c0 3-2 5-2 5" />
      <path d="M14 11c0 3 2 5 2 5" />
      <path d="M17 11v6" />
      <path d="M17 17a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-3" />
      <path d="M7 8a2 2 0 0 1-2-2c0-2 2-2 4-2s4 0 4 2a2 2 0 0 1-2 2" />
    </svg>
  );
}