import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent
} from "react";

type FloatingPosition = {
  left: number;
  top: number;
};

type DragState = {
  pointerId: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export function useFloatingPanelDrag(): {
  style: CSSProperties | undefined;
  handleProps: {
    onPointerDown:
      (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerMove:
      (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerUp:
      (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerCancel:
      (event: ReactPointerEvent<HTMLElement>) => void;
  };
} {
  const [position, setPosition] =
    useState<FloatingPosition | null>(null);
  const dragRef =
    useRef<DragState | null>(null);

  const onPointerDown = (
    event: ReactPointerEvent<HTMLElement>
  ): void => {
    if (event.button !== 0) return;
    const panel =
      event.currentTarget.closest<HTMLElement>(
        "[data-floating-panel='true']"
      );
    if (!panel) return;

    const rect =
      panel.getBoundingClientRect();
    dragRef.current = {
      pointerId:
        event.pointerId,
      offsetX:
        event.clientX - rect.left,
      offsetY:
        event.clientY - rect.top,
      width:
        rect.width,
      height:
        rect.height
    };
    event.currentTarget
      .setPointerCapture?.(
        event.pointerId
      );
    event.preventDefault();
    event.stopPropagation();
  };

  const onPointerMove = (
    event: ReactPointerEvent<HTMLElement>
  ): void => {
    const drag =
      dragRef.current;
    if (
      !drag ||
      drag.pointerId !==
        event.pointerId
    ) {
      return;
    }

    const margin = 8;
    const maxLeft =
      Math.max(
        margin,
        window.innerWidth -
          drag.width -
          margin
      );
    const maxTop =
      Math.max(
        margin,
        window.innerHeight -
          drag.height -
          margin
      );
    const left =
      Math.min(
        maxLeft,
        Math.max(
          margin,
          event.clientX -
            drag.offsetX
        )
      );
    const top =
      Math.min(
        maxTop,
        Math.max(
          margin,
          event.clientY -
            drag.offsetY
        )
      );

    setPosition({
      left,
      top
    });
    event.preventDefault();
    event.stopPropagation();
  };

  const finish = (
    event: ReactPointerEvent<HTMLElement>
  ): void => {
    const drag =
      dragRef.current;
    if (
      !drag ||
      drag.pointerId !==
        event.pointerId
    ) {
      return;
    }
    dragRef.current = null;
    event.currentTarget
      .releasePointerCapture?.(
        event.pointerId
      );
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    style:
      position
        ? {
            left:
              position.left,
            top:
              position.top,
            right:
              "auto",
            bottom:
              "auto"
          }
        : undefined,
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp:
        finish,
      onPointerCancel:
        finish
    }
  };
}
