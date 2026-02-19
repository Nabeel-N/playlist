import { useRouter } from "next/navigation";

export default function HomeIconDuotone({
  className = "size-16 border-4 rounded-2xl",
}) {
  const router = useRouter();
  return (
    <svg
      onClick={() => router.push("/")}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M6 19.5V10.5l6-6 6 6v9a1.5 1.5 0 0 1-1.5 1.5H7.5a1.5 1.5 0 0 1-1.5-1.5Z" />
      <path d="M12 3L2 13h2v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7h2L12 3zm2 16h-4v-5h4v5z" />
    </svg>
  );
}
