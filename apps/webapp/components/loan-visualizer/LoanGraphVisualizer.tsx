import React, { useRef, useState, useMemo, useEffect } from "react";
import { scaleTime, scaleLinear } from "@visx/scale";
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
import { BrushHandleRenderProps } from "@visx/brush/lib/BrushHandle";
import AreaChart from "./AreaChart";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";

import { generateAmortizationTable } from "./loan-utils";

// Initialize some variables
const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
const chartSeparation = 30;
const PATTERN_ID = "brush_pattern";
const GRADIENT_ID = "brush_gradient";
export const accentColor = "black";
export const background = "black";
export const background2 = "white";
const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: "white",
};

function LegendDemo({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="legend">
      <div className="title">{title}</div>
      {children}
      <style jsx>{`
        .legend {
          line-height: 0.9em;
          color: #efefef;
          font-size: 10px;
          font-family: arial;
          padding: 10px 10px;
          float: left;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          margin: 5px 5px;
        }
        .title {
          font-size: 12px;
          margin-bottom: 10px;
          font-weight: 100;
        }
      `}</style>
    </div>
  );
}

// accessors
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

function GraphWrapper({ loan }) {
  const ordinalColorScale = scaleOrdinal({
    domain: ["Interest payment", "Principal payment"],
    range: ["#bbf7d0", "#fecaca"],
  });

  const graphData = useMemo(
    () => generateAmortizationTable(loan, false, null) as any[],
    [loan]
  );

  const legendGlyphSize = 15;
  return (
    <>
      <LegendDemo title="Info">
        <LegendOrdinal
          scale={ordinalColorScale}
          labelFormat={(label) => `${label.toUpperCase()}`}
        >
          {(labels) => (
            <div style={{ display: "flex", flexDirection: "row" }}>
              {labels.map((label, i) => (
                <LegendItem key={`legend-quantile-${i}`} margin="0 5px">
                  <svg width={legendGlyphSize} height={legendGlyphSize}>
                    <rect
                      fill={label.value}
                      width={legendGlyphSize}
                      height={legendGlyphSize}
                      opacity={0.8}
                    />
                  </svg>
                  <LegendLabel align="left" margin="0 0 0 4px">
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              ))}
            </div>
          )}
        </LegendOrdinal>
      </LegendDemo>
      <div style={{ height: "400px" }}>
        <ParentSize className="graph-container" debounceTime={10}>
          {({ width: visWidth, height: visHeight }) => (
            <LoanGraphVisualizer
              width={visWidth}
              height={visHeight}
              loan={graphData}
              interestRate={loan.interestRate}
            />
          )}
        </ParentSize>
      </div>
    </>
  );
}

function LoanGraphVisualizer({
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

  useEffect(() => {
    setFilteredStock(loan);
  }, [loan]);

  // scales
  const dateScale = useMemo(() => {
    return scaleTime<number>({
      range: [0, xMax],
      domain: extent(filteredStock, getMonth),
    });
  }, [xMax, filteredStock]);

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

  const initialBrushPosition = useMemo(() => {
    const loanStart = getMonth(loan[0]);
    const loanEnd = getMonth(loan[loan.length / 3]);
    if (loan.length > 0) {
      return {
        start: { x: brushDateScale(loanStart) },
        end: { x: brushDateScale(loanEnd) },
      };
    }

    // Return a default value if the loan array is empty
    return {
      start: { x: 0 },
      end: { x: 0 },
    };
  }, [brushDateScale, loan]);

  // event handlers
  const handleClearClick = () => {
    if (brushRef?.current) {
      setFilteredStock(loan);
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
          onClick={() => setFilteredStock(loan)}
          selectedBoxStyle={selectedBrushStyle}
          useWindowMoveEvents
          renderBrushHandle={(props) => <BrushHandle {...props} />}
        />
      </AreaChart>
    </svg>
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

export default GraphWrapper;
