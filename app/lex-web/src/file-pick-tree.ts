/**
 * Folder tree of a workspace for picking files to send with a message:
 * a folder can be ticked as a whole, and a search keeps the matching files
 * with the folders that lead to them.
 */
export type FilePick =
  | { kind: "document"; documentId: string; chunkIndices: number[] }
  | { kind: "template"; templateId: string };

export type PickFile = {
  itemId: string;
  name: string;
  folderId: string | null;
  // Null: cannot be sent yet (e.g. not processed); `note` says why.
  pick: FilePick | null;
  note: string;
};

export type PickFolder = {
  folderId: string | null;
  name: string;
  folders: PickFolder[];
  files: PickFile[];
};

export function pickKey(pick: FilePick): string {
  return pick.kind === "document" ? pick.documentId : pick.templateId;
}

function byName<T extends { name: string }>(left: T, right: T): number {
  return left.name.localeCompare(right.name, "pl");
}

export function buildPickTree(
  rootName: string,
  folders: Array<{ folderId: string; parentId: string | null; name: string }>,
  files: PickFile[]
): PickFolder {
  const known = new Set(folders.map((folder) => folder.folderId));
  const build = (folderId: string | null, name: string, seen: Set<string>): PickFolder => ({
    folderId,
    name,
    folders: folders
      .filter((folder) => folder.parentId === folderId && !seen.has(folder.folderId))
      .map((folder) => build(folder.folderId, folder.name, new Set([...seen, folder.folderId])))
      .sort(byName),
    files: files
      // Files in a folder that no longer exists belong to the root.
      .filter((file) => (file.folderId && known.has(file.folderId) ? file.folderId : null) === folderId)
      .sort(byName)
  });
  return build(null, rootName, new Set());
}

export function filesIn(folder: PickFolder): PickFile[] {
  return [...folder.files, ...folder.folders.flatMap(filesIn)];
}

export function pickableIn(folder: PickFolder): FilePick[] {
  return filesIn(folder).flatMap((file) => (file.pick ? [file.pick] : []));
}

export function folderState(folder: PickFolder, selected: ReadonlySet<string>): "all" | "some" | "none" {
  const picks = pickableIn(folder);
  const chosen = picks.filter((pick) => selected.has(pickKey(pick))).length;
  if (chosen === 0) return "none";
  return chosen === picks.length ? "all" : "some";
}

function normalized(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L").toLowerCase();
}

/** Files whose name matches every word; a matching folder keeps everything in it. */
export function filterPickTree(folder: PickFolder, query: string): PickFolder | null {
  const words = normalized(query).split(/\s+/).filter(Boolean);
  if (!words.length) return folder;
  const matches = (name: string) => {
    const value = normalized(name);
    return words.every((word) => value.includes(word));
  };
  const visit = (current: PickFolder): PickFolder | null => {
    if (current.folderId !== null && matches(current.name)) return current;
    const folders = current.folders.map(visit).filter((item): item is PickFolder => item !== null);
    const files = current.files.filter((file) => matches(file.name));
    return folders.length || files.length ? { ...current, folders, files } : null;
  };
  return visit(folder);
}
