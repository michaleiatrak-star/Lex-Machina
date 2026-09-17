import MatterChatApp from "./MatterChatApp.js";
import type { AuthenticatedUser } from "./api.js";

export default function App({
  user
}: {
  user: AuthenticatedUser;
}) {
  return <MatterChatApp user={user} />;
}
