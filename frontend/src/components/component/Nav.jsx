import DarkMode from "@/buttons/DarkMode";
import { UserButton } from "@clerk/clerk-react";
import { Card } from "../ui/card";
import { NoteAltSharp } from "@mui/icons-material";

export default function Nav() {
  return (
    <Card className=" m-1">
      <header className="flex h-16 items-center justify-between pr-4 sm:px-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <NoteAltSharp />
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
