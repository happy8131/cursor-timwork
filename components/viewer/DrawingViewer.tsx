"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useViewerStore } from "@/lib/store";
import {
  getDrawing,
  getDiscipline,
  getRevisions,
  getDrawingImagePath,
} from "@/lib/metadata";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  ImageOff,
} from "lucide-react";
import BuildingOverlay from "./BuildingOverlay";

export default function DrawingViewer() {
  const {
    selectedDrawingId,
    selectedDiscipline,
    selectedRegion,
    selectedRevisionVersion,
  } = useViewerStore();

  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [viewerKey, setViewerKey] = useState(0);

  const currentImagePath = useCallback(() => {
    const drawing = getDrawing(selectedDrawingId);
    if (!drawing) return null;

    if (selectedDiscipline) {
      const discipline = getDiscipline(selectedDrawingId, selectedDiscipline);
      if (!discipline) return getDrawingImagePath(drawing.image);

      if (selectedRevisionVersion) {
        const revisions = getRevisions(
          selectedDrawingId,
          selectedDiscipline,
          selectedRegion ?? undefined
        );
        const rev = revisions.find(
          (r) => r.version === selectedRevisionVersion
        );
        if (rev) return getDrawingImagePath(rev.image);
      }

      if (discipline.image) {
        return getDrawingImagePath(discipline.image);
      }

      return getDrawingImagePath(drawing.image);
    }

    return getDrawingImagePath(drawing.image);
  }, [selectedDrawingId, selectedDiscipline, selectedRegion, selectedRevisionVersion]);

  const imageSrc = currentImagePath();

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    setViewerKey((k) => k + 1);
  }, [imageSrc]);

  const handleFitToScreen = useCallback(() => {
    transformRef.current?.resetTransform(0);
  }, []);

  const currentDrawing = getDrawing(selectedDrawingId);
  const currentLabel = (() => {
    const parts: string[] = [];
    if (currentDrawing) parts.push(currentDrawing.name);
    if (selectedDiscipline) parts.push(selectedDiscipline);
    if (selectedRegion) parts.push(`Region ${selectedRegion}`);
    if (selectedRevisionVersion) parts.push(selectedRevisionVersion);
    return parts.join(" / ");
  })();

  return (
    <div className="relative flex h-full w-full flex-col bg-neutral-100">
      <div className="absolute top-3 left-3 z-10 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur-sm">
        {currentLabel || "도면을 선택하세요"}
      </div>

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <button
          onClick={() => transformRef.current?.zoomIn()}
          className="rounded-lg bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-colors cursor-pointer hover:bg-blue-100"
          title="확대"
        >
          <ZoomIn className="h-4 w-4 text-neutral-600" />
        </button>
        <button
          onClick={() => transformRef.current?.zoomOut()}
          className="rounded-lg bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-colors cursor-pointer hover:bg-red-100"
          title="축소"
        >
          <ZoomOut className="h-4 w-4 text-neutral-600" />
        </button>
        <button
          onClick={() => transformRef.current?.resetTransform()}
          className="rounded-lg bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-colors cursor-pointer hover:bg-yellow-100"
          title="초기화"
        >
          <RotateCcw className="h-4 w-4 text-neutral-600" />
        </button>
        <button
          onClick={handleFitToScreen}
          className="rounded-lg bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-colors cursor-pointer hover:bg-green-100"
          title="화면 맞춤"
        >
          <Maximize className="h-4 w-4 text-neutral-600" />
        </button>
      </div>

      <div ref={wrapperRef} className="relative flex-1 overflow-hidden">
        {imageSrc && !imageError ? (
          <TransformWrapper
            key={viewerKey}
            ref={transformRef}
            initialScale={1}
            minScale={0.5}
            maxScale={20}
            centerOnInit
            wheel={{ step: 0.1 }}
          >
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="relative flex h-full w-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={currentLabel}
                  className={`transition-opacity ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  draggable={false}
                />
                {imageLoaded && selectedDrawingId === "00" && (
                  <BuildingOverlay />
                )}
              </div>
            </TransformComponent>
          </TransformWrapper>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-400">
            <ImageOff className="h-16 w-16" />
            <p className="text-sm">
              {imageError
                ? "도면 이미지를 불러올 수 없습니다"
                : "도면을 선택해주세요"}
            </p>
            {imageError && imageSrc && (
              <p className="max-w-xs text-center text-xs text-neutral-300">
                {imageSrc}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
