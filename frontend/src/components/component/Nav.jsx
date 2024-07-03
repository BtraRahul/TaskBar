// import { UserButton } from "@clerk/clerk-react";

// function Nav({ loggedIn }) {
//   return (
//     <div className="top-0 w-full">
//       Nav
//       {loggedIn && (
//         <div className="right-1">
//           <UserButton />
//         </div>
//       )}
//     </div>
//   );
// }

// export default Nav;

import DarkMode from "@/buttons/DarkMode";
import { UserButton } from "@clerk/clerk-react";

export default function Nav() {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MountainIcon className="h-6 w-6" />
        <span>TaskBar</span>
      </div>
      <DarkMode extraClasses="absolute right-16 top-4 text-2xl" />

      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
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
