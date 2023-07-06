import React, { useRef, useState, useMemo } from "react";
import { scaleTime, scaleLinear } from "@visx/scale";
import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { Brush } from "@visx/brush";
import { Bounds } from "@visx/brush/lib/types";
import BaseBrush, {
  BaseBrushState,
  UpdateBrush,
} from "@visx/brush/lib/BaseBrush";
import { PatternLines } from "@visx/pattern";
import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";
import { max, extent } from "d3-array";
import { ParentSize } from "@visx/responsive";
import { BrushHandleRenderProps } from "@visx/brush/lib/BrushHandle";
import AreaChart from "./AreaChart";

// Initialize some variables
const stock = appleStock.slice(1100);
const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
const chartSeparation = 30;
const PATTERN_ID = "brush_pattern";
const GRADIENT_ID = "brush_gradient";
export const accentColor = "#f6acc8";
export const background = "#584153";
export const background2 = "#af8baf";
const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: "white",
};

// accessors
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;
const getMonth = (d: any) => new Date(d?.month);
const getValue = (d: any) => d.principalPayment;
const getInterest = (d: any) => d.interestPayment;

export type BrushProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  compact?: boolean;
  loan: any[];
  interestRate: number;
};

function LoanGraphVisualizer2({
  compact = false,
  width,
  height,
  margin = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20,
  },
  loan,
  interestRate,
}: BrushProps) {
  const brushRef = useRef<BaseBrush | null>(null);
  const [filteredStock, setFilteredStock] = useState(loan);

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
    const stockCopy = loan.filter((s) => {
      const x = getMonth(s).getTime();
      const y = getValue(s);
      const z = getInterest(s);

      const compareY = y > z ? y : z;

      return x > x0 && x < x1 && compareY > y0 && compareY < y1;
    });
    setFilteredStock(stockCopy);
  };

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = compact
    ? chartSeparation / 2
    : chartSeparation + 10;
  const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);
  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(
    bottomChartHeight - brushMargin.top - brushMargin.bottom,
    0
  );

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xMax],
        domain: extent(filteredStock, getMonth),
      }),
    [xMax, filteredStock]
  );
  const stockScale = useMemo(() => {
    return scaleLinear<number>({
      range: [yMax, 0],
      domain: [
        0,
        max(filteredStock, function (d) {
          return Math.max(getValue(d), getInterest(d));
        }) || 0,
      ],
      nice: true,
    });
  }, [yMax, filteredStock]);
  const brushDateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, xBrushMax],
        domain: extent(loan, getMonth) as number[],
      }),
    [xBrushMax, loan]
  );
  const brushStockScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [0, max(loan, getValue, getInterest) || 0],
        nice: true,
      }),
    [yBrushMax, loan]
  );

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushDateScale(getMonth(loan[0])) },
      end: { x: brushDateScale(getMonth(loan[100])) },
    }),
    [brushDateScale, loan]
  );

  // event handlers
  const handleClearClick = () => {
    if (brushRef?.current) {
      setFilteredStock(stock);
      brushRef.current.reset();
    }
  };

  const handleResetClick = () => {
    if (brushRef?.current) {
      const updater: UpdateBrush = (prevBrush) => {
        const newExtent = brushRef.current!.getExtent(
          initialBrushPosition.start,
          initialBrushPosition.end
        );

        const newState: BaseBrushState = {
          ...prevBrush,
          start: { y: newExtent.y0, x: newExtent.x0 },
          end: { y: newExtent.y1, x: newExtent.x1 },
          extent: newExtent,
        };

        return newState;
      };
      brushRef.current.updateBrush(updater);
    }
  };

  return (
    <div style={{ width: "560px", height: "300px" }}>
      <ParentSize className="graph-container" debounceTime={10}>
        {({ width, height }) => (
          <svg width={width} height={height}>
            <LinearGradient
              id={GRADIENT_ID}
              from={background}
              to={background2}
              rotate={45}
            />
            <rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={`url(#${GRADIENT_ID})`}
              rx={14}
            />
            <AreaChart
              hideBottomAxis={compact}
              data={filteredStock}
              width={width}
              margin={{ ...margin, bottom: topChartBottomMargin }}
              yMax={yMax}
              xScale={dateScale}
              yScale={stockScale}
              gradientColor={background2}
            />

            <AreaChart
              hideBottomAxis
              hideLeftAxis
              data={loan}
              width={width}
              yMax={yBrushMax}
              xScale={brushDateScale}
              yScale={brushStockScale}
              margin={brushMargin}
              top={topChartHeight + topChartBottomMargin + margin.top}
              gradientColor={background2}
            >
              <PatternLines
                id={PATTERN_ID}
                height={8}
                width={8}
                stroke={accentColor}
                strokeWidth={1}
                orientation={["diagonal"]}
              />
              <Brush
                xScale={brushDateScale}
                yScale={brushStockScale}
                width={xBrushMax}
                height={yBrushMax}
                margin={brushMargin}
                handleSize={8}
                innerRef={brushRef}
                resizeTriggerAreas={["left", "right"]}
                brushDirection="horizontal"
                initialBrushPosition={initialBrushPosition}
                onChange={onBrushChange}
                onClick={() => setFilteredStock(stock)}
                selectedBoxStyle={selectedBrushStyle}
                useWindowMoveEvents
                renderBrushHandle={(props) => <BrushHandle {...props} />}
              />
            </AreaChart>
          </svg>
        )}
      </ParentSize>
      {/* <div style={{ position: "absolute", bottom: "-110px" }}>
        <button onClick={handleClearClick}>Clear</button>&nbsp;
        <button onClick={handleResetClick}>Reset</button>
      </div> */}
    </div>
  );
}
// We need to manually offset the handles for them to be rendered at the right position
function BrushHandle({ x, height, isBrushActive }: BrushHandleRenderProps) {
  const pathWidth = 8;
  const pathHeight = 15;
  if (!isBrushActive) {
    return null;
  }
  return (
    <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
      <path
        fill="#f2f2f2"
        d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
        stroke="#999999"
        strokeWidth="1"
        style={{ cursor: "ew-resize" }}
      />
    </Group>
  );
}

export default LoanGraphVisualizer2;
