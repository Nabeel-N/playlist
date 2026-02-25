"use client";

import { on } from "events";
import { MouseEventHandler } from "react";

export default function Topbutton({
  text,
  onClick,
}: {
  text: string;
  onClick: MouseEventHandler;
}) {
  return (
    <button
      className="p-2.5 rounded-3xl bg-gray-500 m-4 font-medium"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
