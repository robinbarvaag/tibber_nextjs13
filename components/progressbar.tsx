const ProgressBar = ({
  size = 150,
  progress = 0,
  trackWidth = 10,
  trackColor = `#ddd`,
  indicatorWidth = 10,
  indicatorColor = `#07c`,
  indicatorCap = `round`,
  label = `Loading...`,
  labelColor = `#333`,
  spinnerMode = false,
  spinnerSpeed = 1,
}: {
  size?: number;
  progress?: number;
  trackWidth?: number;
  trackColor?: string;
  indicatorWidth?: number;
  indicatorColor?: string;
  indicatorCap: "butt" | "round" | "square" | "inherit" | undefined;
  label?: string;
  labelColor?: string;
  spinnerMode?: boolean;
  spinnerSpeed?: number;
}) => {
  const center = size / 2,
    radius =
      center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth),
    dashArray = 2 * Math.PI * radius,
    dashOffset = dashArray * ((100 - progress) / 100);

  let hideLabel = size < 100 || !label.length || spinnerMode ? true : false;

  return (
    <>
      <div className="svg-pi-wrapper" style={{ width: size, height: size }}>
        <svg className="svg-pi" style={{ width: size, height: size }}>
          <circle
            className="svg-pi-track"
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke={trackColor}
            strokeWidth={trackWidth}
          />
          <circle
            className={`svg-pi-indicator ${
              spinnerMode ? "svg-pi-indicator--spinner" : ""
            }`}
            style={{ animationDuration: spinnerSpeed * 1000 + "" }}
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke={indicatorColor}
            strokeWidth={indicatorWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap={indicatorCap}
          />
        </svg>
        {!hideLabel && (
          <div className="svg-pi-label" style={{ color: labelColor }}>
            {!spinnerMode && (
              <span className="svg-pi-label__progress text-white">
                {`${progress > 100 ? 100 : progress.toFixed(2)}%`}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default ProgressBar;
