import MatterChatApp from "./MatterChatApp.js";
import { LocalAiSetupPanel } from "./LocalAiSetupPanel.js";
import { MaintenancePanel } from "./MaintenancePanel.js";
import type { AuthenticatedUser } from "./api.js";

export default function App({
  user
}: {
  user: AuthenticatedUser;
}) {
  return (
    <>
      <MatterChatApp user={user} />
      <MaintenancePanel user={user} />
      <LocalAiSetupPanel user={user} />
    </>
  );
}
