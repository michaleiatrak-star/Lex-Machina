import MatterChatApp, {
  type SettingsRequest
} from "./MatterChatApp.js";
import { LocalAiSetupPanel } from "./LocalAiSetupPanel.js";
import { MaintenancePanel } from "./MaintenancePanel.js";
import { AccountSecurityPanel } from "./AccountSecurityPanel.js";
import { AdminUsersPanel } from "./AdminUsersPanel.js";
import { AdminSupportPanel } from "./AdminSupportPanel.js";
import type {
  AuthMeResponse,
  AuthenticatedUser
} from "./api.js";

export default function App({
  user,
  onAuthUpdated,
  settingsRequest
}: {
  user: AuthenticatedUser;
  onAuthUpdated: (
    value: AuthMeResponse
  ) => void;
  settingsRequest?: SettingsRequest | null;
}) {
  return (
    <MatterChatApp
      user={user}
      settingsRequest={settingsRequest}
      settingsPanels={{
        localAi: (
          <LocalAiSetupPanel
            user={user}
            embedded
          />
        ),
        security: (
          <AccountSecurityPanel
            user={user}
            onAuthUpdated={
              onAuthUpdated
            }
          />
        ),
        users:
          user.appRole ===
          "ADMIN" ? (
            <>
              <AdminUsersPanel
                currentUserId={
                  user.userId
                }
              />
              <AdminSupportPanel />
            </>
          ) : null,
        maintenance: (
          <MaintenancePanel
            user={user}
            embedded
          />
        )
      }}
    />
  );
}
