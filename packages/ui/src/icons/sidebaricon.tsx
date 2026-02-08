import Image from "next/image";

interface SidebarIconProps {
  size?: number;
  className?: string;
}

export default function SidebarIcon({
  size = 30,
  className = "",
}: SidebarIconProps) {
  return (
    <div className="border-2 p-1.5 rounded-lg bg-black items-center justify-center mr-8 ">
      <Image
        src="/sidebar-logo.png"
        alt="Sidebar Logo"
        width={size}
        height={size}
        className={`object-contain ${className}`} // object-contain ensures the logo doesn't stretch weirdly
      />
    </div>
  );
}
