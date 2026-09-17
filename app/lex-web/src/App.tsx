import { useState } from "react";
import ChatApp from "./ChatApp.js";
import CaseControls from "./CaseControls.js";
import type { AuthenticatedUser } from "./api.js";

export default function App({
  user
}: {
  user: AuthenticatedUser;
}) {
  const [caseRefresh, setCaseRefresh] = useState(0);

  return (
    <>
      <CaseControls
        user={user}
        onCasesChanged={() =>
          setCaseRefresh((value) => value + 1)
        }
      />
      <ChatApp
        key={`${user.userId}:${caseRefresh}`}
        user={user}
      />
    </>
  );
}
