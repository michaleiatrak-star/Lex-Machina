import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  describe,
  expect,
  it
} from "vitest";
import {
  LocalAuthService
} from "../src/auth/service.js";
import {
  LocalAuthStore
} from "../src/auth/store.js";

describe("G37B managed first-admin password setup", () => {
  it("rewraps the same account under the user password and rotates recovery", async () => {
    const root =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          "lex-g37b-"
        )
      );
    const service =
      new LocalAuthService(
        new LocalAuthStore({
          rootDir: root
        }),
        {
          kdf: {
            memoryKiB: 1024,
            iterations: 1,
            parallelism: 1,
            keyLength: 32,
            version: 1
          }
        }
      );

    const bootstrapSecret =
      "managed-bootstrap-secret-2026-long";
    const userPassword =
      "Uzytkownik ustawia wlasne dlugie haslo 2026";

    try {
      const bootstrap =
        await service.bootstrap({
          loginName:
            "local-admin",
          displayName:
            "Administrator lokalny",
          password:
            bootstrapSecret,
          passwordSetupPending:
            true
        });

      expect(
        bootstrap.user
          .passwordSetupPending
      ).toBe(true);

      const changed =
        await service.changePassword(
          bootstrap,
          {
            currentPassword:
              bootstrapSecret,
            newPassword:
              userPassword
          }
        );

      expect(
        changed.user
          .passwordSetupPending
      ).toBe(false);
      expect(
        "recoveryCode" in changed
          ? changed.recoveryCode
          : undefined
      ).toMatch(
        /^LMR1_[A-Za-z0-9_-]{43}$/
      );

      await expect(
        service.login({
          loginName:
            "local-admin",
          password:
            bootstrapSecret
        })
      ).rejects.toMatchObject({
        code:
          "INVALID_CREDENTIALS"
      });

      const relogin =
        await service.login({
          loginName:
            "local-admin",
          password:
            userPassword
        });
      expect(
        relogin.user
          .passwordSetupPending
      ).toBe(false);
    } finally {
      service.close();
      fs.rmSync(
        root,
        {
          recursive: true,
          force: true
        }
      );
    }
  });

  it("allows admin/admin only for first-run bootstrap and requires a 10-character replacement", async () => {
    const root =
      fs.mkdtempSync(
        path.join(
          os.tmpdir(),
          "lex-g37b-default-admin-"
        )
      );
    const service =
      new LocalAuthService(
        new LocalAuthStore({
          rootDir: root
        }),
        {
          kdf: {
            memoryKiB: 1024,
            iterations: 1,
            parallelism: 1,
            keyLength: 32,
            version: 1
          }
        }
      );

    try {
      const bootstrap =
        await service.bootstrap({
          loginName: "admin",
          displayName: "Administrator",
          password: "admin",
          passwordSetupPending: true
        });

      expect(
        bootstrap.user.loginName
      ).toBe("admin");
      expect(
        bootstrap.user
          .passwordSetupPending
      ).toBe(true);

      await expect(
        service.changePassword(
          bootstrap,
          {
            currentPassword: "admin",
            newPassword: "123456789"
          }
        )
      ).rejects.toMatchObject({
        code:
          "INVALID_PASSWORD_CHANGE"
      });

      const changed =
        await service.changePassword(
          bootstrap,
          {
            currentPassword: "admin",
            newPassword: "1234567890"
          }
        );

      expect(
        changed.user
          .passwordSetupPending
      ).toBe(false);

      await expect(
        service.login({
          loginName: "admin",
          password: "admin"
        })
      ).rejects.toMatchObject({
        code:
          "INVALID_CREDENTIALS"
      });

      await expect(
        service.login({
          loginName: "admin",
          password: "1234567890"
        })
      ).resolves.toMatchObject({
        user: {
          loginName: "admin",
          passwordSetupPending: false
        }
      });
    } finally {
      service.close();
      fs.rmSync(
        root,
        {
          recursive: true,
          force: true
        }
      );
    }
  });

});
