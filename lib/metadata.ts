import type { Metadata, Drawing, Discipline, Revision } from "./types";
import rawMetadata from "@/data/metadata.json";

export const metadata = rawMetadata as unknown as Metadata;

export function getDrawing(id: string): Drawing | undefined {
  return metadata.drawings[id];
}

export function getRootDrawing(): Drawing {
  return metadata.drawings["00"];
}

export function getChildDrawings(parentId: string): Drawing[] {
  return Object.values(metadata.drawings).filter(
    (d) => d.parent === parentId
  );
}

export function getBuildingDrawings(): Drawing[] {
  return getChildDrawings("00");
}

export function getDiscipline(
  drawingId: string,
  disciplineName: string
): Discipline | undefined {
  const drawing = getDrawing(drawingId);
  return drawing?.disciplines?.[disciplineName];
}

export function getDisciplineNames(drawingId: string): string[] {
  const drawing = getDrawing(drawingId);
  if (!drawing?.disciplines) return [];
  return Object.keys(drawing.disciplines);
}

export function getRevisions(
  drawingId: string,
  disciplineName: string,
  regionName?: string
): Revision[] {
  const discipline = getDiscipline(drawingId, disciplineName);
  if (!discipline) return [];

  if (regionName && discipline.regions?.[regionName]) {
    return discipline.regions[regionName].revisions;
  }

  return discipline.revisions ?? [];
}

export function getRegionNames(
  drawingId: string,
  disciplineName: string
): string[] {
  const discipline = getDiscipline(drawingId, disciplineName);
  if (!discipline?.regions) return [];
  return Object.keys(discipline.regions);
}

export function getLatestRevision(
  drawingId: string,
  disciplineName: string,
  regionName?: string
): Revision | undefined {
  const revisions = getRevisions(drawingId, disciplineName, regionName);
  return revisions.length > 0 ? revisions[revisions.length - 1] : undefined;
}

export function getDrawingImagePath(filename: string): string {
  return `/drawings/${filename}`;
}

export interface BreadcrumbItem {
  label: string;
  drawingId?: string;
  disciplineName?: string;
  regionName?: string;
  revisionVersion?: string;
}

export function buildBreadcrumb(
  drawingId: string,
  disciplineName?: string,
  regionName?: string,
  revisionVersion?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];

  const root = getRootDrawing();
  items.push({ label: root.name, drawingId: root.id });

  if (drawingId !== "00") {
    const drawing = getDrawing(drawingId);
    if (drawing) {
      items.push({ label: drawing.name, drawingId: drawing.id });
    }
  }

  if (disciplineName) {
    items.push({
      label: disciplineName,
      drawingId,
      disciplineName,
    });
  }

  if (regionName) {
    items.push({
      label: `Region ${regionName}`,
      drawingId,
      disciplineName,
      regionName,
    });
  }

  if (revisionVersion) {
    items.push({
      label: revisionVersion,
      drawingId,
      disciplineName,
      regionName,
      revisionVersion,
    });
  }

  return items;
}

export function searchDrawings(query: string): {
  drawing: Drawing;
  discipline?: string;
  revision?: Revision;
}[] {
  const results: {
    drawing: Drawing;
    discipline?: string;
    revision?: Revision;
  }[] = [];
  const q = query.toLowerCase();

  for (const drawing of Object.values(metadata.drawings)) {
    if (drawing.name.toLowerCase().includes(q)) {
      results.push({ drawing });
    }

    if (drawing.disciplines) {
      for (const [dName, discipline] of Object.entries(drawing.disciplines)) {
        if (dName.toLowerCase().includes(q)) {
          results.push({ drawing, discipline: dName });
        }

        for (const rev of discipline.revisions ?? []) {
          if (
            rev.description.toLowerCase().includes(q) ||
            rev.version.toLowerCase().includes(q) ||
            rev.changes.some((c) => c.toLowerCase().includes(q))
          ) {
            results.push({ drawing, discipline: dName, revision: rev });
          }
        }

        if (discipline.regions) {
          for (const region of Object.values(discipline.regions)) {
            for (const rev of region.revisions) {
              if (
                rev.description.toLowerCase().includes(q) ||
                rev.version.toLowerCase().includes(q) ||
                rev.changes.some((c) => c.toLowerCase().includes(q))
              ) {
                results.push({ drawing, discipline: dName, revision: rev });
              }
            }
          }
        }
      }
    }
  }

  return results;
}
