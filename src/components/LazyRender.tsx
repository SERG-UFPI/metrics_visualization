import type { FunctionComponent, MutableRefObject } from "react";
import React, { useCallback, useRef, useState, useEffect } from "react";

interface IntersectionEvent {
  entry: IntersectionObserverEntry;
}

interface UseOnViewOptions {
  ref: MutableRefObject<HTMLElement | null>;
  beforeChange?: (event: IntersectionEvent) => void;
  initialValue?: boolean;
}

/** Detects if the `ref` element is inside the viewport, and returns an
 * `isViewing` state. Allows triggering actions right before the state
 * changes, via the `beforeChange` argument, and assuming that the element
 * is initially on view, via the `eager` argument
 *
 * !!IMPORTANT!! This hook is very performance sensitive, as it could
 * potentially be applied with a couple of hundred components at a time.
 * As such, be very careful when changing, adding features, or replacing
 * it. Measure render/update time before and after, with some 200
 * components simultaneously, to more clearly track changes.  */
const useOnView = ({ ref, beforeChange, initialValue }: UseOnViewOptions) => {
  const [isViewing, setIsViewing] = useState(initialValue ?? false);

  /** Uses ref for internal tracking of intersection instead of the state above for two reasons:
   * - Prevents the useEffect below from depending on the state and thus being re-generated
   *   every time the state changes, which degrades performance
   * - Allows triggering beforeChange... well, before changes. This allows capturing element
   *   dimensions before the element is hidden, mainly. */
  const isViewingRef = useRef(initialValue ?? false);

  /** Sets up IntersectionObserver */
  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      const { isIntersecting } = entry;

      if (isIntersecting === isViewingRef.current) {
        return;
      }

      if (beforeChange) {
        beforeChange({ entry });
      }

      setIsViewing(isIntersecting);
      isViewingRef.current = isIntersecting;
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, beforeChange]);

  return { isViewing };
};

interface Props {
  initialPlaceholderHeight: number;
  shouldInitiallyRender?: boolean;
  children: React.ReactNode;
}

/** Allows for detecting intersections before the element is actually into
 * the viewport, to reduce flashing.
 * This may or may not be turned into a prop. Right now it's not a
 * prop because a case where this might be changed hasn't come up,
 * and because it's better if all LazyRender thresholds are the same. */
const THRESHOLD_PX = 200;

export const LazyRender: FunctionComponent<Props> = ({
  children,
  initialPlaceholderHeight,
  shouldInitiallyRender = false,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [placeholderHeight, setPlaceholderHeight] = useState(
    initialPlaceholderHeight
  );

  /** Stores the height of the lazy-rendered element on hide, before the
   * state changes and the element actually gets hidden.
   * This is done on hide instead of on show for better initial page load.
   *
   * Also, uses useCallback to prevent the useOnView effect from running
   * on every rerender. */
  const beforeChange = useCallback(({ entry }: IntersectionEvent) => {
    if (!wrapperRef.current) {
      return;
    }

    const isLeavingViewport = !entry.isIntersecting;

    // We only do stuff here when the element is being hidden
    if (!isLeavingViewport) {
      return;
    }

    // Subtracts the top and bottom threshold from the element height
    const newPlaceholderHeight =
      wrapperRef.current.scrollHeight - THRESHOLD_PX * 2;

    // Just in case
    if (Number.isNaN(newPlaceholderHeight)) {
      return;
    }

    setPlaceholderHeight(newPlaceholderHeight);
  }, []);

  const { isViewing } = useOnView({
    ref: wrapperRef,
    initialValue: shouldInitiallyRender,
    beforeChange,
  });

  return (
    <div
      style={{
        // Using style instead of tailwind for fine tuning and better portability
        position: "relative",
        paddingTop: THRESHOLD_PX, // increases the area of the element, allowing for early view detection
        paddingBottom: THRESHOLD_PX, // see more on the `threshold` variable definition.

        marginTop: -THRESHOLD_PX, // ignores the effects of the paddings in terms of pushing the elements
        marginBottom: -THRESHOLD_PX * 2, // x2 due to margin collapse

        boxSizing: "content-box", // makes the padding stretch the element, instead of compressing the content

        pointerEvents: "none", // prevents the paddings from covering the click area of nearby elements

        width: "100%",
        height: isViewing ? "auto" : placeholderHeight,
      }}
      ref={wrapperRef}
    >
      {isViewing ? (
        <div style={{ pointerEvents: "none" }}>{children}</div>
      ) : null}
    </div>
  );
};
