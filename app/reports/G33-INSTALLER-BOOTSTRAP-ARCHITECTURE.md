# G33 — Offline Installer, Guided Bootstrap and Local Privacy File Architecture

Status: **DESIGN COMPLETE — NOT IMPLEMENTED / NOT PASS**  
Date: 2026-09-16

## 1. Current gate state

Completed and validated before this design:
- G0-G29;
- G27A;
- G28A;
- G31A local case storage foundation;
- G31B safe ZIP intake foundation;
- G32 protected document attachment session.

Still open:
- G30 open-web discovery;
- G31C typed authoring AST / generation-scoped token model;
- G31D deterministic DOCX generation, local deanonymization and immediate download;
- G31E deterministic ODT generation, local deanonymization and immediate download.

This installer design must not be reported as completing G31C-G31E.

---

## 2. Installer objective

The end user should not have to understand or manually install:
- Node.js;
- Python;
- pip packages;
- PaddleOCR/PaddlePaddle;
- Stanza/Torch;
- Polish OCR/NER model files;
- LibreOffice used for local QA/conversion;
- WebView runtime requirements on Windows;
- application corpus files.

The installer is **offline-first**. All required payloads for the selected platform/architecture are shipped inside the installer package.

The application must not depend on whatever happens to exist on the user's PATH.

---

## 3. Desktop packaging choice

Recommended shell: **Tauri 2 + the existing React/Vite UI**.

Reasons:
- reuse the existing frontend instead of introducing a second desktop UI;
- package platform-specific external binaries/sidecars;
- restrictive command permissions for sidecars;
- Windows MSI/NSIS packaging;
- offline WebView2 installer option;
- signed updater artifacts.

Initial production target:
1. Windows 11/10 x86-64;
2. Windows ARM64 after native OCR/ML dependency validation;
3. macOS Apple Silicon;
4. Linux x86-64.

Do not claim a target supported until all native Python/ML and LibreOffice payloads are built and smoke-tested on that target.

### Windows installer

Primary package:
- `LexMachina-Setup-x64.exe` using Tauri/NSIS.

Default installation:
- per-user;
- no administrator rights for Lex Machina application files;
- no modification of system PATH;
- no global Python/Node installation.

System prerequisites that truly require system installation are handled separately by the bootstrap plan.

---

## 4. Two classes of components

### A. Application-private components

These are always installed inside the Lex Machina application version directory and never discovered via PATH:

- Lex desktop shell;
- Lex runtime;
- private Node runtime or later a validated Node single-executable runtime;
- private Python runtime;
- vendored Python packages;
- PaddleOCR worker;
- Stanza NER worker;
- Paddle/PP-OCR Polish models;
- Stanza Polish NER model;
- local ZIP worker;
- legal corpus;
- deterministic DOCX/ODT renderer;
- private LibreOffice runtime for headless QA/conversion;
- static UI assets.

The installer checks **version + SHA-256 + component manifest**, not "does command X exist globally?".

### B. System prerequisites

Windows examples:
- WebView2 at or above the minimum supported version;
- Visual C/C++ runtime if required by the private Python/ML native binaries.

The full offline installer carries the prerequisite installers inside its payload. If the probe shows the system prerequisite is missing or too old, the installer runs the bundled prerequisite package.

Never download an executable during the installation of the full offline package.

---

## 5. Component lock manifest

Build produces an immutable, signed component lock:

```json
{
  "schemaVersion": 1,
  "applicationVersion": "0.x.y",
  "target": "windows-x86_64",
  "components": [
    {
      "id": "lex-runtime",
      "version": "0.x.y",
      "mode": "private",
      "required": true,
      "relativePath": "runtime/lex-runtime/",
      "sha256Manifest": "...",
      "probe": {
        "kind": "command",
        "command": "lex-runtime.exe",
        "args": ["--self-test"]
      }
    },
    {
      "id": "python",
      "version": "3.x",
      "mode": "private",
      "required": true,
      "relativePath": "runtime/python/",
      "sha256Manifest": "..."
    },
    {
      "id": "paddle-ocr-pl",
      "version": "...",
      "mode": "private",
      "required": true,
      "relativePath": "models/paddle/",
      "sha256Manifest": "..."
    },
    {
      "id": "stanza-pl-ner",
      "version": "...",
      "mode": "private",
      "required": true,
      "relativePath": "models/stanza/",
      "sha256Manifest": "..."
    },
    {
      "id": "libreoffice-headless",
      "version": "...",
      "mode": "private",
      "required": true,
      "relativePath": "runtime/libreoffice/",
      "sha256Manifest": "..."
    }
  ]
}
```

Production manifest additionally records:
- payload size;
- executable architecture;
- license/SPDX identifier;
- upstream provenance;
- build timestamp;
- required minimum OS;
- per-file hashes or a Merkle-style component hash;
- installer-signing identity.

The manifest is signed by the release key. Hash verification alone is not enough if an attacker can replace both payload and manifest.

---

## 6. Installation directories

### Windows

Application binaries:

`%LOCALAPPDATA%\Programs\LexMachina\app\<version>\`

Mutable shared application state:

`%LOCALAPPDATA%\LexMachina\`

Case data:

`%LOCALAPPDATA%\LexMachina\data\cases\...`

Suggested layout:

```text
LexMachina/
  app/
    0.x.y/
      LexMachina.exe
      runtime/
        node/
        python/
        libreoffice/
      models/
        paddle/
        stanza/
      corpus/
      ui/
      component-lock.json
  state/
    current.json
    installation.json
    health.json
    logs/
  data/
    cases/
```

The installer may migrate the current development default `~/.lex-machina/data` to the platform application-data path only after explicit migration checks. Never silently duplicate or delete an existing case directory.

macOS/Linux use their normal user application-data paths. `LEX_DATA_DIR` remains an advanced override.

---

## 7. Transactional installation

Never overwrite a running application version in place.

Sequence:

1. create `app/<newVersion>.staging/`;
2. extract bundled private components;
3. verify component hashes;
4. run component probes;
5. create/update configuration in a temporary file;
6. close/fsync files;
7. rename staging directory to `app/<newVersion>/`;
8. atomically update `state/current.json`;
9. launch version self-test;
10. only after PASS offer launch to the user.

If any required component fails:
- do not change `current.json`;
- remove the failed staging version;
- preserve the previous working version;
- preserve all case data.

This is also the update/rollback mechanism.

---

## 8. Preflight scan

Installer preflight returns a structured result for every component:

```ts
type ComponentState =
  | "READY"
  | "MISSING"
  | "OUTDATED"
  | "CORRUPT"
  | "INCOMPATIBLE";

type ComponentProbe = {
  id: string;
  state: ComponentState;
  installedVersion?: string;
  requiredVersion: string;
  source: "PRIVATE" | "SYSTEM";
  action:
    | "KEEP"
    | "INSTALL_FROM_BUNDLE"
    | "REPAIR_FROM_BUNDLE"
    | "BLOCK";
};
```

Checks include:
- OS and CPU architecture;
- free disk space;
- write access to application-data locations;
- WebView2 minimum version on Windows;
- VC runtime probe where required;
- private payload hashes for repair/update;
- Python interpreter startup;
- importability of every pinned ML package;
- model directory integrity;
- `soffice --headless --version`;
- legal corpus checksum/integrity;
- loopback port availability is **not** treated as a fixed prerequisite; runtime should select/configure a safe loopback port when the default is occupied.

No external provider/API key is required to install the application.

---

## 9. Step-by-step installer / onboarding UX

The native OS installer should remain conservative. Rich guidance and animation should live in the first-run Tauri setup wizard where it is testable and accessible.

### Step 1 — Welcome

Message:
- application works locally;
- case files remain local unless the user explicitly sends protected context to an AI provider;
- installer can run fully offline.

Animation:
- short line animation: `Plik → Lokalnie → AI na tokenach → Lokalny wynik`.

### Step 2 — Computer check

Animated checklist:
- system/architecture;
- disk;
- application directory;
- WebView2;
- runtime;
- Python;
- OCR;
- NER;
- LibreOffice;
- legal corpus.

States animate:
- waiting spinner;
- green check PASS;
- amber "will be installed/repaired";
- red blocking error.

### Step 3 — What will be installed

Show exact component list and disk footprint.

The user can expand each row:
- version;
- why it is needed;
- installation location;
- whether it is application-private or system-level.

Core required components cannot be deselected.

### Step 4 — Data location

Default recommended application-data folder.

Options:
- use recommended path;
- choose another local path.

Validation before continuing:
- path writable;
- not inside application binary directory;
- enough free space;
- no unsafe network/removable location warning without explicit confirmation.

### Step 5 — Install/repair

Single progress view with two levels:
- overall progress;
- current component.

Use deterministic progress based on payload bytes/components, not fake timers.

Animation examples:
- unpacking: moving file tiles;
- validating: shield/check pulse;
- OCR models: document scan line.

Accessibility:
- `prefers-reduced-motion` disables decorative movement;
- progress is exposed to assistive technology;
- no critical state communicated by color alone.

### Step 6 — Local self-test

Run without provider access:
- runtime starts and binds loopback;
- corpus loads;
- Python imports;
- OCR tiny local fixture;
- NER tiny local fixture;
- create a tiny local DOCX fixture once G31D exists;
- create a tiny local ODT fixture once G31E exists;
- reopen/parse generated files;
- local LibreOffice headless preview conversion;
- private vault write/read round-trip;
- tokenized file → deanonymized file round-trip using synthetic values.

Every test exposes:
- PASS;
- repair;
- technical details panel.

### Step 7 — Provider configuration

Optional.

The user may:
- skip;
- configure OpenAI/Anthropic/xAI later.

Do not block local document intake on missing API credentials.

Provider secret storage must be handled by the secure credential-settings design, not plaintext configuration files.

### Step 8 — Ready

Show:
- installed version;
- local data folder;
- runtime health;
- "Uruchom Lex Machina".

---

## 10. Animation architecture

Animations belong to the UI layer only.

They must never determine installer state.

State machine drives UI:

`IDLE → PROBING → PLAN_READY → INSTALLING → VERIFYING → SELF_TEST → READY | BLOCKED`

The animation consumes state/progress events:

```ts
type SetupProgressEvent = {
  phase:
    | "PROBE"
    | "EXTRACT"
    | "INSTALL_SYSTEM"
    | "VERIFY"
    | "SELF_TEST";
  componentId: string;
  completedBytes?: number;
  totalBytes?: number;
  status:
    | "START"
    | "PROGRESS"
    | "PASS"
    | "FAIL";
};
```

Never allow frontend JavaScript to execute arbitrary commands based on strings. Expose only typed Tauri commands / tightly scoped sidecars.

---

## 11. Private Python / ML packaging

On Windows use an application-local Python distribution.

At release-build time:
- create/pin Python runtime;
- install/vend all required third-party packages into the private runtime;
- pre-download approved OCR and NER model assets;
- remove installer caches and build-only packages;
- generate a complete file hash manifest.

Do not run `pip install` from the public internet on the user's machine.

Current Python dependency families that must be represented in the component lock:
- PaddleOCR;
- PaddlePaddle;
- PyMuPDF;
- NumPy;
- Pillow;
- Stanza;
- Torch.

Exact release versions must be pinned during implementation. Current `requirements.txt` ranges are development constraints and are not sufficient for reproducible installer payloads.

---

## 12. LibreOffice role

LibreOffice is a **local validation/rendering sidecar**, not the source of document semantics.

Use it only for:
- headless reopen/conversion;
- visual-preview PDF;
- interoperability smoke checks.

The deterministic Lex renderer remains authoritative for DOCX/ODT generation.

Use a private packaged LibreOffice runtime if distribution/legal review permits. Avoid depending on a random system LibreOffice version because output differences would break reproducibility.

Run with:
- headless mode;
- isolated Lex-specific user profile directory;
- no macros;
- no extensions loaded from user/global locations;
- no network-dependent templates.

---

# LOCAL FILE PRIVACY ARCHITECTURE

## 13. Persistent encrypted case vault

Replace the current RAM-only production vault with a file-backed encrypted store before claiming full G31.

Per case:

```text
cases/<caseId>/
  private/
    privacy/
      vault.lmv
      vault-key.ref
      vault-meta.json
```

`vault.lmv` contains the reversible mapping and counters encrypted at rest.

Clear values are never written to plaintext JSON/log/audit files.

### Cryptography contract

Recommended initial format:
- AES-256-GCM;
- random 256-bit case data key;
- fresh nonce for every complete vault rewrite;
- authenticated additional data includes:
  - schema version;
  - case id;
  - vault generation/version.

Case data key protection:
- Windows: protect/wrap using current-user OS credential protection;
- macOS: Keychain;
- Linux: Secret Service/libsecret;
- if secure OS key protection is unavailable, fail closed for persistent reversible mode or require an explicit user-provided recovery passphrase mode.

Do not silently fall back to a plaintext key file.

### Atomic vault update

1. load/decrypt current vault;
2. update token mapping in memory;
3. serialize canonical vault representation;
4. encrypt to `vault.lmv.partial`;
5. fsync/close;
6. decrypt/verify the partial file;
7. atomically replace `vault.lmv`;
8. clear transient plaintext buffers where practical.

A crash before step 7 leaves the previous valid vault intact.

---

## 14. Local pseudonymization saved to files

After local privacy review, persist only the protected representation as ordinary case files:

```text
documents/<documentId>/
  source/
    source-ref.json
  protected/
    pages.jsonl
    chunks.json
    privacy-report.json
```

Raw extracted source content stays in the case-private processing/source area according to retention policy.

The provider sees only selected protected content.

All reversible clear-value mappings remain in `private/privacy/vault.lmv`.

---

## 15. File-based DOCX/ODT deanonymization

Do **not** edit the tokenized artifact in place.

Generation directories:

```text
artifacts/<artifactId>/
  work/
    tokenized.docx | tokenized.odt
    final.partial
  result.docx | result.odt
  artifact.json
```

Sequence:

1. AI returns AST containing only approved `LMPII` references;
2. deterministic renderer writes `tokenized.docx` or `tokenized.odt`;
3. close file and calculate tokenized SHA-256;
4. token gate B scans the tokenized package;
5. local backend unlocks `vault.lmv`;
6. create a **new** `final.partial` package;
7. copy unchanged package entries;
8. for whitelisted visible-text XML entries:
   - parse/decompress the entry locally;
   - reconstruct split run/span text;
   - resolve each approved alias through the local encrypted vault;
   - inject the clear value as escaped text;
   - write the transformed XML into the new package;
9. never replace token text inside relationship URLs, metadata ids, style ids, package paths or field instructions;
10. finish/close `final.partial`;
11. reopen the new package;
12. token gate C requires zero `LMPII` and zero source `PII` tokens anywhere in allowed/user-visible content;
13. validate OOXML/ODF structure;
14. extract final visible text locally;
15. run final legal/export validation;
16. calculate SHA-256 of the exact final bytes;
17. atomically rename `final.partial` to `result.docx` / `result.odt`;
18. mark `artifact.json` as `DOWNLOADABLE`;
19. expose localhost download.

**No provider request is permitted after step 5 begins.**

### Avoid clear-text XML temp trees

Do not unzip a deanonymized DOCX/ODT into a persistent directory.

Transform individual XML parts in memory while streaming/copying package entries into `final.partial`. This reduces clear PII written to temporary disk locations.

The final document itself necessarily contains the restored clear values because that is the user's requested artifact.

---

## 16. Crash recovery

On application startup scan only known Lex work directories.

Examples:
- stale `.partial` installer versions → delete after verifying they are not current;
- stale artifact `final.partial` → never offer for download;
- existing valid `tokenized.docx/odt` + vault → generation may be resumed locally;
- final artifact without PASS manifest → quarantine/not downloadable.

Never infer success merely because a `.docx` or `.odt` file exists.

---

## 17. Repair mode

Installer supports:

**Repair Lex Machina**

Repair:
- re-hashes application-private components;
- restores missing/corrupt files from bundled installer payload;
- reruns self-tests;
- never overwrites case data;
- never resets provider secrets;
- never deletes case vaults.

If repair cannot recover a required runtime component, previous working application version remains selected.

---

## 18. Uninstall

Default uninstall removes:
- application binaries;
- private runtimes;
- private model files;
- launcher shortcuts;
- updater state.

Default uninstall **does not delete case data**.

Final page offers a separate explicit checkbox:

`Usuń również wszystkie lokalne sprawy i wygenerowane dokumenty`

This requires an additional confirmation describing the exact data directory.

No unrelated system Python/Node/LibreOffice installation is ever removed.

---

## 19. Updates

Application updates use the same staged-version transaction.

Security:
- signed release metadata;
- signed update artifacts;
- component hash verification after extraction;
- rollback to previous version if self-test fails.

An application update must not migrate case/vault schema irreversibly until the new version passes startup health checks and a schema backup/recovery path exists.

---

## 20. New gates

### G31C1 — Encrypted persistent privacy vault
PASS requires:
- reversible token mapping survives restart;
- no plaintext clear-value mapping on disk;
- OS-protected case key;
- authenticated encryption;
- atomic update/recovery tests.

### G31C2 — Typed authoring AST + generation aliases
PASS requires:
- provider sees only generation-scoped aliases;
- unknown/invented aliases blocked;
- schema/patch validation.

### G31D — DOCX
PASS requires:
- deterministic OOXML renderer;
- file-to-file local deanonymization;
- token/package/legal gates;
- immediate download.

### G31E — ODT
PASS requires:
- deterministic ODF renderer;
- file-to-file local deanonymization;
- token/package/legal gates;
- immediate download.

### G33A — Installer component manifest
PASS requires:
- pinned component versions/hashes;
- release provenance;
- platform manifests.

### G33B — Offline bundled installation
PASS requires:
- clean-machine installation without internet;
- private Node/Python/OCR/NER/LibreOffice payload;
- prerequisite install from bundled payload only.

### G33C — Guided setup + repair
PASS requires:
- step-by-step wizard;
- real progress events;
- repair mode;
- reduced-motion/accessibility path.

### G33D — Installer self-test / rollback / update
PASS requires:
- complete local self-test;
- failed upgrade rollback;
- signed update verification;
- case data preserved across install/repair/update/uninstall.

---

## 21. Release acceptance test

A clean Windows VM with no Node, Python, LibreOffice and no provider API key must be able to:

1. install Lex Machina from the full offline setup package;
2. pass local self-test;
3. create a case;
4. upload PDF/image/ZIP;
5. OCR locally;
6. pseudonymize and persist encrypted vault state;
7. restart Lex Machina and reopen the reversible case mapping;
8. generate a synthetic tokenized DOCX and ODT;
9. mechanically deanonymize each into a new local file;
10. verify zero residual tokens;
11. download/open both files;
12. uninstall the application while leaving case data intact unless explicit data deletion was selected.

No Internet is required until the user deliberately invokes an external AI provider or legal web verification feature.
