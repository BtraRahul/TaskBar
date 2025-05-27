import DarkMode from "@/buttons/DarkMode";
import { UserButton } from "@clerk/clerk-react";
import { Card } from "../ui/card";

export default function Nav() {
  return (
    <Card className=" m-1">
      <header className="flex h-16 items-center justify-between pr-4 sm:px-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <MountainIcon className="h-6 w-6" />
          <span>TaskBar</span>
        </div>

        <div className="flex items-center gap-4 justify-center">
          <DarkMode extraClasses="text-2xl" />
          <UserButton />
        </div>
      </header>
    </Card>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
